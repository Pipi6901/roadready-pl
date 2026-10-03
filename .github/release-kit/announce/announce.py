#!/usr/bin/env python3
"""Announce a mobile release: a GitHub release vX.Y.Z and a message in Telegram.

The version comes from the top released section of CHANGELOG.md (Keep a Changelog
1.1.0) in the commit the store build was made from. A version that already has a
release is not announced again, so a build without a new version sends nothing. The
one exception is a platform the release has not seen yet: the first iOS upload
announces the version, the first Android upload of the same version adds a short
follow-up instead of repeating the notes.

Runs as the `announce` composite action and locally:

    python3 announce.py --product Kepler --sha HEAD --repo owner/repo --dry-run

Environment: GH_TOKEN (or a logged-in gh), TELEGRAM_BOT_TOKEN and
TELEGRAM_RELEASE_CHAT_ID (not needed for --dry-run).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from html import escape

SECTIONS = {
    "Added": "✨ New",
    "Changed": "🛠 Improved",
    "Deprecated": "⚠️ Going away",
    "Removed": "🗑 Removed",
    "Fixed": "🐛 Fixed",
    "Security": "🔒 Security",
}
PLATFORMS = {"ios": ("📱", "iOS"), "android": ("🤖", "Android")}
LIMIT = 4000
MARKER_RE = re.compile(r"<!-- release-kit platforms: ([a-z,]*) -->")

SEMVER_RE = re.compile(
    r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"
    r"(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?"
    r"(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$"
)
HEADING_RE = re.compile(r"^##\s+\[?([^\]\s]+)\]?(?:\s+-\s+(\S+))?\s*$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
LINK_DEF_RE = re.compile(r"^\[[^\]]+\]:\s*\S+")


class Fail(Exception):
    """A problem with the release itself: the run goes red with this message."""


# --------------------------------------------------------------------------- versions


def parse_semver(text: str) -> tuple:
    m = SEMVER_RE.match(text)
    if not m:
        raise Fail(f"'{text}' is not a SemVer 2.0.0 version (MAJOR.MINOR.PATCH)")
    pre = m.group(4)
    return int(m.group(1)), int(m.group(2)), int(m.group(3)), pre.split(".") if pre else []


def semver_key(text: str):
    """Sort key with SemVer precedence: 1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0."""
    major, minor, patch, pre = parse_semver(text)
    ids = tuple((0, int(p), "") if p.isdigit() else (1, 0, p) for p in pre)
    # a release (no pre-release part) ranks above every pre-release of the same core
    return (major, minor, patch, 1 if not pre else 0, ids)


def normalize_store_version(text: str) -> str:
    """Apple and Google accept '1.0' and '1'; SemVer wants three parts."""
    text = text.strip()
    if re.fullmatch(r"\d+(\.\d+){0,2}", text):
        parts = text.split(".")
        return ".".join((parts + ["0", "0"])[:3])
    return text


# ------------------------------------------------------------------------- changelog


@dataclass
class Release:
    version: str
    date: str
    summary: str = ""
    sections: list = field(default_factory=list)  # [(name, [item, ...])]
    body: str = ""  # the section verbatim, for the GitHub release


def parse_changelog(text: str) -> Release:
    """Return the top released section. Unreleased is skipped."""
    lines = text.splitlines()
    start = None
    for i, line in enumerate(lines):
        if not line.startswith("## "):
            continue
        m = HEADING_RE.match(line)
        if not m:
            raise Fail(f"cannot read the CHANGELOG heading '{line}', expected '## [1.2.0] - 2026-09-30'")
        if m.group(1).lower() == "unreleased":
            continue
        start = i
        version, date = m.group(1), m.group(2)
        break
    if start is None:
        raise Fail("CHANGELOG has no released version yet, only Unreleased")
    parse_semver(version)
    if not date or not DATE_RE.match(date):
        raise Fail(f"the heading of {version} needs a date: '## [{version}] - YYYY-MM-DD'")

    end = next((j for j in range(start + 1, len(lines)) if lines[j].startswith("## ")), len(lines))
    block = [ln for ln in lines[start + 1:end] if not LINK_DEF_RE.match(ln)]
    while block and not block[-1].strip():
        block.pop()
    while block and not block[0].strip():
        block.pop(0)

    release = Release(version=version, date=date, body="\n".join(block))
    summary, current, items = [], None, None
    for raw in block:
        line = raw.rstrip()
        if line.startswith("### "):
            name = line[4:].strip()
            if name not in SECTIONS:
                allowed = ", ".join(SECTIONS)
                raise Fail(f"section '### {name}' in {version} is not Keep a Changelog; allowed: {allowed}")
            current, items = name, []
            release.sections.append((name, items))
            continue
        if current is None:
            if line.strip():
                summary.append(line.strip())
            elif summary:
                summary.append("")
            continue
        bullet = re.match(r"^(\s*)[-*]\s+(.*)$", line)
        if bullet:
            text = bullet.group(2).strip()
            items.append(("  ◦ " if len(bullet.group(1)) >= 2 else "• ") + text)
        elif line.strip() and items:
            items[-1] += " " + line.strip()
        elif line.strip():
            items.append("• " + line.strip())

    release.summary = re.sub(r"\n{3,}", "\n\n", "\n".join(summary)).strip()
    release.sections = [(n, i) for n, i in release.sections if i]
    if not release.summary and not release.sections:
        raise Fail(f"{version} has neither a summary line nor any items, there is nothing to announce")
    return release


def read_version_file(path: str, text: str) -> str:
    """The version the app itself carries: app.json, app.config.*, package.json,
    project.pbxproj (MARKETING_VERSION) or build.gradle (versionName)."""
    name = os.path.basename(path)
    if name.endswith(".json"):
        data = json.loads(text)
        version = (data.get("expo") or {}).get("version") or data.get("version")
    elif name.startswith("app.config."):
        m = re.search(r"""\bversion\s*:\s*["']([^"']+)["']""", text)
        version = m.group(1) if m else None
    elif name == "project.pbxproj":
        found = set(re.findall(r"MARKETING_VERSION = \"?([^\";]+)\"?;", text))
        if len(found) > 1:
            raise Fail(f"{path} has several MARKETING_VERSION values: {', '.join(sorted(found))}")
        version = found.pop() if found else None
    elif name.startswith("build.gradle"):
        m = re.search(r"""versionName\s*=?\s*["']([^"']+)["']""", text)
        version = m.group(1) if m else None
    else:
        raise Fail(f"do not know how to read a version from {path}")
    if not version:
        raise Fail(f"no version found in {path}")
    return version


# ----------------------------------------------------------------------------- message


def platform_line(platform: str, channel: str, build: str) -> str:
    if not platform:
        return ""
    icon, label = PLATFORMS[platform]
    parts = [label] + [p for p in (channel, f"build {build}" if build else "") if p]
    return f"{icon} " + " · ".join(parts)


def release_lines(product: str, release: Release, platform: str, channel: str, build: str) -> list:
    lines = [f"🚀 {product} {release.version}"]
    where = platform_line(platform, channel, build)
    if where:
        lines.append(where)
    if release.summary:
        lines += [""] + release.summary.split("\n")
    for name, items in release.sections:
        lines += ["", SECTIONS[name]] + items
    return lines


def split_parts(lines: list, limit: int = LIMIT) -> list:
    """Cut a long message on line breaks into parts that each fit the limit.
    Each part after the first repeats the title, and all of them get (k/n)."""
    title = lines[0]
    reserve = len(title) + 12  # room for the repeated title and " (10/10)"
    flat = []
    for line in lines:
        while len(line) > limit - reserve:
            cut = line.rfind(" ", 0, limit - reserve)
            cut = cut if cut > 0 else limit - reserve
            flat.append(line[:cut])
            line = line[cut:].lstrip()
        flat.append(line)

    parts, current, size = [], [], 0
    for line in flat:
        if current and size + len(line) + 1 > limit - reserve:
            parts.append(current)
            current, size = [], 0
            if not line.strip():
                continue
        current.append(line)
        size += len(line) + 1
    if current:
        parts.append(current)
    if len(parts) == 1:
        return ["\n".join(parts[0])]
    n = len(parts)
    out = []
    for k, part in enumerate(parts, 1):
        if k == 1:
            part = [f"{part[0]} ({k}/{n})"] + part[1:]
        else:
            part = [f"{title} ({k}/{n})", ""] + part
        out.append("\n".join(part))
    return out


def to_html(text: str) -> str:
    """Plain text with Markdown `code` and **bold** -> Telegram HTML. The first line is the title."""
    out = []
    for i, line in enumerate(text.split("\n")):
        html = escape(line, quote=False)
        html = re.sub(r"`([^`]+)`", r"<code>\1</code>", html)
        html = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", html)
        out.append(f"<b>{html}</b>" if i == 0 else html)
    return "\n".join(out)


# ------------------------------------------------------------------------------ github


def run(cmd: list, check: bool = True, stdin: str | None = None) -> subprocess.CompletedProcess:
    res = subprocess.run(cmd, input=stdin, capture_output=True, text=True)
    if check and res.returncode != 0:
        raise Fail(f"`{' '.join(cmd[:4])} ...` failed: {res.stderr.strip() or res.stdout.strip()}")
    return res


def git_show(sha: str, path: str) -> str:
    res = run(["git", "show", f"{sha}:{path}"], check=False)
    if res.returncode != 0:
        raise Fail(f"{path} is not in commit {sha[:12]}: {res.stderr.strip()}")
    return res.stdout


def resolve_sha(sha: str) -> str:
    return run(["git", "rev-parse", f"{sha}^{{commit}}"]).stdout.strip()


def list_releases(repo: str) -> list:
    res = run(["gh", "api", "--paginate", f"repos/{repo}/releases?per_page=100", "--jq", ".[] | tojson"])
    return [json.loads(line) for line in res.stdout.splitlines() if line.strip()]


def tag_sha(repo: str, tag: str) -> str | None:
    res = run(["gh", "api", f"repos/{repo}/git/ref/tags/{tag}"], check=False)
    if res.returncode != 0:
        return None
    obj = json.loads(res.stdout)["object"]
    if obj["type"] == "tag":  # annotated tag: follow it to the commit
        obj = json.loads(run(["gh", "api", f"repos/{repo}/git/tags/{obj['sha']}"]).stdout)["object"]
    return obj["sha"]


def with_marker(body: str, platforms: set) -> str:
    body = MARKER_RE.sub("", body).rstrip()
    return f"{body}\n\n<!-- release-kit platforms: {','.join(sorted(platforms))} -->\n"


def write_notes(body: str) -> str:
    fd, path = tempfile.mkstemp(suffix=".md")
    with os.fdopen(fd, "w") as f:
        f.write(body)
    return path


# ---------------------------------------------------------------------------- telegram


def send_telegram(text: str) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat = os.environ.get("TELEGRAM_RELEASE_CHAT_ID", "").strip()
    if not token or not chat:
        raise Fail("TELEGRAM_BOT_TOKEN or TELEGRAM_RELEASE_CHAT_ID is empty")
    payload = json.dumps({
        "chat_id": chat,
        "text": to_html(text),
        "parse_mode": "HTML",
        "link_preview_options": {"is_disabled": True},
    }).encode()
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            answer = json.load(resp)
    except urllib.error.HTTPError as e:
        try:
            answer = json.load(e)
        except Exception:
            raise Fail(f"Telegram answered HTTP {e.code}") from None
    except (urllib.error.URLError, TimeoutError) as e:
        # the reason never carries the URL, so the token cannot leak through it
        raise Fail(f"Telegram is unreachable: {getattr(e, 'reason', e)}") from None
    if not answer.get("ok"):
        migrated = (answer.get("parameters") or {}).get("migrate_to_chat_id")
        if migrated:
            raise Fail(
                f"the group became a supergroup, its new id is {migrated}: "
                "set TELEGRAM_RELEASE_CHAT_ID to it"
            )
        raise Fail(f"Telegram refused the message: {answer.get('description', answer)}")


# -------------------------------------------------------------------------------- main


def output(name: str, value: str) -> None:
    path = os.environ.get("GITHUB_OUTPUT")
    if path:
        with open(path, "a") as f:
            f.write(f"{name}={value}\n")


def summary(text: str) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a") as f:
            f.write(text + "\n")


def announce(args) -> int:
    if args.platform and args.platform not in PLATFORMS:
        raise Fail(f"platform must be one of {', '.join(PLATFORMS)}, got '{args.platform}'")
    if args.mode not in ("release", "rollback"):
        raise Fail(f"mode must be release or rollback, got '{args.mode}'")

    sha = resolve_sha(args.sha)
    release = parse_changelog(git_show(sha, args.changelog))
    tag = f"{args.tag_prefix}{release.version}"
    output("version", release.version)
    output("tag", tag)
    print(f"{args.changelog} @ {sha[:12]}: top released version {release.version} ({release.date})")

    if args.version_file:
        own = read_version_file(args.version_file, git_show(sha, args.version_file))
        if normalize_store_version(own) != release.version:
            raise Fail(
                f"{args.version_file} says {own}, the top of {args.changelog} is {release.version}: "
                "the mirror moves in the same commit that releases the version"
            )

    if args.mode == "rollback":
        if not args.reason.strip():
            raise Fail("rollback needs a reason")
        text = f"↩️ {args.product} rolled back to {release.version}\n\n{args.reason.strip()}"
        print("--- message ---\n" + text + "\n---------------")
        if args.dry_run:
            print("dry run: nothing sent")
            return 0
        send_telegram(text)
        output("announced", "true")
        return 0

    if args.store_version and normalize_store_version(args.store_version) != release.version:
        raise Fail(
            f"the store build carries version {args.store_version}, the top of {args.changelog} "
            f"is {release.version}: the binary was built with another version than the one being "
            "announced, fix the version the build stamps"
        )

    releases = [r for r in list_releases(args.repo) if not r.get("draft")]
    existing = next((r for r in releases if r["tag_name"] == tag), None)

    if existing:
        m = MARKER_RE.search(existing.get("body") or "")
        seen = set(filter(None, m.group(1).split(","))) if m else set()
        if args.platform and args.platform not in seen:
            text = f"📦 {args.product} {release.version} is now on " + platform_line(
                args.platform, args.channel, args.build
            ).split(" ", 1)[1]
            print("--- message ---\n" + text + "\n---------------")
            summary(f"### {tag}: new platform\n\n```\n{text}\n```")
            if args.dry_run:
                print(f"dry run: would send the message and record {args.platform} on release {tag}")
                return 0
            send_telegram(text)
            notes = write_notes(with_marker(existing.get("body") or "", seen | {args.platform}))
            run(["gh", "release", "edit", tag, "--repo", args.repo, "--notes-file", notes])
            output("announced", "true")
            return 0
        print(f"{tag} was announced before, nothing to do")
        if args.warn_if_announced:
            print(f"::warning::shipped without a new version: {tag} was announced before")
        output("announced", "false")
        return 0

    newer_than = [
        r["tag_name"][len(args.tag_prefix):]
        for r in releases
        if r["tag_name"].startswith(args.tag_prefix)
        and SEMVER_RE.match(r["tag_name"][len(args.tag_prefix):])
    ]
    top = max(newer_than, key=semver_key, default=None)
    if top and semver_key(release.version) <= semver_key(top):
        raise Fail(
            f"{release.version} is not newer than the releases already made "
            f"(latest {args.tag_prefix}{top}): the version in {args.changelog} did not grow"
        )

    points_at = tag_sha(args.repo, tag)
    if points_at and points_at != sha:
        raise Fail(
            f"tag {tag} already exists without a release and names {points_at[:12]}, not the "
            f"built commit {sha[:12]}: delete the tag or release a new version"
        )

    parts = split_parts(release_lines(args.product, release, args.platform, args.channel, args.build))
    for k, part in enumerate(parts, 1):
        print(f"--- message {k}/{len(parts)} ---\n{part}")
    print("---------------")
    summary(f"### {tag}\n\n```\n" + "\n\n".join(parts) + "\n```")

    plan = f"release {tag} on {sha[:12]}, {len(parts)} Telegram message(s)"
    if args.dry_run:
        print(f"dry run: would create {plan}")
        return 0

    platforms = {args.platform} if args.platform else set()
    notes = write_notes(with_marker(release.body, platforms))
    cmd = ["gh", "release", "create", tag, "--repo", args.repo, "--target", sha,
           "--title", f"{args.product} {release.version}", "--notes-file", notes]
    if parse_semver(release.version)[3]:
        cmd.append("--prerelease")
    run(cmd)
    print(f"created release {tag}")

    try:
        send_telegram(parts[0])
    except Fail:
        run(["gh", "release", "delete", tag, "--repo", args.repo, "--yes", "--cleanup-tag"], check=False)
        print(f"Telegram refused the first part: release {tag} and its tag were removed, a rerun starts over")
        raise
    for part in parts[1:]:
        send_telegram(part)
    output("announced", "true")
    print(f"announced {plan}")
    return 0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--product", required=True, help="name in the message title")
    p.add_argument("--sha", required=True, help="the commit the store build was made from")
    p.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", ""), help="owner/repo")
    p.add_argument("--mode", default="release", help="release or rollback")
    p.add_argument("--reason", default="", help="why, for rollback")
    p.add_argument("--platform", default="", help="ios or android")
    p.add_argument("--channel", default="", help="where the build went: TestFlight, Google Play internal")
    p.add_argument("--build", default="", help="build number in the store")
    p.add_argument("--store-version", default="", help="the version inside the uploaded binary")
    p.add_argument("--changelog", default="CHANGELOG.md")
    p.add_argument("--tag-prefix", default="v")
    p.add_argument("--version-file", default="", help="app.json, app.config.ts, project.pbxproj, build.gradle")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--warn-if-announced", action="store_true")
    args = p.parse_args(argv)
    if not args.repo and args.mode == "release":
        p.error("--repo is required (or GITHUB_REPOSITORY)")
    try:
        return announce(args)
    except Fail as e:
        # workflow commands are read from stdout, so the annotation goes there
        print(f"::error::{e}" if os.environ.get("GITHUB_ACTIONS") else f"error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
