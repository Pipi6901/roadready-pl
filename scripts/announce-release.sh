#!/usr/bin/env bash
# Зовет workflow announce.yml после того, как сборка ушла в стор.
#
#   scripts/announce-release.sh ios     TestFlight             path/to/App.ipa
#   scripts/announce-release.sh android "Google Play internal" path/to/build.gradle
#   scripts/announce-release.sh android "Google Play internal" app.json 42
#
# Версию и номер сборки берет из того, что реально собрано: у iOS из Info.plist внутри
# .ipa, у Android из build.gradle, который собирался. Сборке EAS без папки android/ версию
# дает app.json, а номер сборки четвертым аргументом (его видно в eas build:list). Анонс
# сверит версию с верхней в CHANGELOG и откажет, если бинарник несет другую.
#
# В Codemagic токен берется из GITHUB_ANNOUNCE_TOKEN (группа release_announce, fine-grained
# токен с правом Actions: write на этот репозиторий), коммит из CM_COMMIT. Локально, после
# fastlane или eas submit, хватает залогиненного gh, коммит HEAD должен быть запушен.
# DRY_RUN=true показывает сообщение в логе прогона и ничего не шлет.
set -euo pipefail

REPO="Pipi6901/roadready-pl"
# Ветка по умолчанию: GitHub запускает workflow_dispatch только из нее, коммит сборки
# передается отдельно и может лежать в любой ветке
REF="master"

PLATFORM="${1:?platform: ios or android}"
CHANNEL="${2:?channel: TestFlight, Google Play internal}"
ARTIFACT="${3:?path to the .ipa (ios), build.gradle or app.json (android)}"
SHA="${CM_COMMIT:-$(git rev-parse HEAD)}"

case "$PLATFORM" in
  ios)
    [ -f "$ARTIFACT" ] || { echo "нет $ARTIFACT"; exit 1; }
    TMP=$(mktemp -d)
    unzip -q -o "$ARTIFACT" 'Payload/*.app/Info.plist' -d "$TMP"
    PLIST=$(find "$TMP/Payload" -maxdepth 2 -name Info.plist | head -1)
    VERSION=$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$PLIST")
    BUILD=$(/usr/libexec/PlistBuddy -c 'Print CFBundleVersion' "$PLIST")
    ;;
  android)
    [ -f "$ARTIFACT" ] || { echo "нет $ARTIFACT"; exit 1; }
    case "$ARTIFACT" in
      *.json)
        VERSION=$(python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));print((d.get("expo") or d).get("version",""))' "$ARTIFACT")
        BUILD="${4:-}"
        ;;
      *)
        VERSION=$(sed -nE 's/.*versionName[ =]*"([^"]+)".*/\1/p' "$ARTIFACT" | head -1)
        BUILD="${4:-$(sed -nE 's/.*versionCode[ =]*([0-9]+).*/\1/p' "$ARTIFACT" | head -1)}"
        ;;
    esac
    ;;
  *) echo "platform: ios or android"; exit 1 ;;
esac
[ -n "$VERSION" ] || { echo "не нашел версию в $ARTIFACT"; exit 1; }

echo "анонс: $REPO $PLATFORM $VERSION ($BUILD) из ${SHA:0:12} → $CHANNEL"
DRY="${DRY_RUN:-false}"

if [ -n "${CM_BUILD_ID:-}" ] && [ -z "${GITHUB_ANNOUNCE_TOKEN:-}" ]; then
  # Анонс еще не подключен у этого приложения: сборку из-за него не валим
  echo "GITHUB_ANNOUNCE_TOKEN не задан (группа release_announce в Codemagic), анонс пропущен"
  exit 0
fi

if [ -n "${GITHUB_ANNOUNCE_TOKEN:-}" ]; then
  BODY=$(jq -n --arg ref "$REF" --arg sha "$SHA" --arg platform "$PLATFORM" \
    --arg channel "$CHANNEL" --arg build "$BUILD" --arg version "$VERSION" --arg dry "$DRY" \
    '{ref: $ref, inputs: {sha: $sha, platform: $platform, channel: $channel, build: $build,
      store_version: $version, dry_run: $dry}}')
  CODE=$(curl -sS -o /tmp/announce-dispatch.out -w '%{http_code}' -X POST \
    -H "Authorization: Bearer $GITHUB_ANNOUNCE_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/actions/workflows/announce.yml/dispatches" \
    -d "$BODY")
  if [ "$CODE" != "204" ]; then
    echo "сборка в сторе, но анонс не вызван: GitHub ответил $CODE"
    cat /tmp/announce-dispatch.out
    exit 1
  fi
else
  gh workflow run announce.yml --repo "$REPO" --ref "$REF" \
    -f sha="$SHA" -f platform="$PLATFORM" -f channel="$CHANNEL" -f build="$BUILD" \
    -f store_version="$VERSION" -f dry_run="$DRY"
fi
echo "анонс вызван: https://github.com/$REPO/actions/workflows/announce.yml"
