import { Directory, File, Paths } from 'expo-file-system';

import { DEMO_BUNDLE } from '@/data/demo-bundle';
import type { MediaAsset } from '@/types/content';

/**
 * The offline media pack — the images and hazard clips questions reference by
 * mediaId, downloaded once and afterwards read from disk.
 *
 * Question TEXT never needs any of this: it ships inside the binary
 * (src/data/demo-bundle.ts) and is refreshed by a ~200 KB content.json fetch,
 * which is why the app has always opened offline. Media is the part that
 * cannot travel that way — a single hazard clip outweighs the entire question
 * bank — so it is the one thing worth a real download with progress, a size
 * readout and a delete button.
 *
 * Files live under Paths.document rather than Paths.cache: the system may
 * purge the cache directory under storage pressure, and a pack the learner
 * explicitly downloaded must not evaporate the morning of their exam.
 *
 * KNOWN GAP (docs/08-risks-open-questions.md): on iOS this directory is also
 * included in iCloud backup, while Apple's storage guidelines want
 * re-downloadable content marked NSURLIsExcludedFromBackupKey. expo-file-system
 * exposes no API for that flag, so it needs a config plugin before the clip
 * pack ships — a few hundred MB of backup per user is the kind of thing review
 * notices.
 */

const DIR_NAME = 'media';

/** Only a plausible, harmless file extension is carried over from the URL. */
const SAFE_EXTENSION = /^\.[a-z0-9]{1,5}$/;

// create() is a synchronous native call, and localFile() runs once per asset
// on every status refresh and every question that mounts — so the directory is
// materialised once per app run rather than on each lookup.
let ensuredDirectory: Directory | null = null;

function packDirectory(): Directory {
  if (ensuredDirectory) return ensuredDirectory;
  const dir = new Directory(Paths.document, DIR_NAME);
  dir.create({ intermediates: true, idempotent: true });
  ensuredDirectory = dir;
  return dir;
}

function fileNameFor(asset: MediaAsset): string {
  // The name is derived from the asset id, not the remote filename: two
  // uploads can share a name in the admin's media library, and the id is
  // what a question actually points at.
  const id = asset.id.replace(/[^A-Za-z0-9_-]/g, '_');
  const path = asset.url.split('?')[0];
  const dot = path.lastIndexOf('.');
  const ext = dot === -1 ? '' : path.slice(dot).toLowerCase();
  // The extension is cosmetic — <Image> and expo-video both sniff the content
  // themselves — but it keeps the sandbox readable when debugging a report of
  // "the picture won't load".
  return id + (SAFE_EXTENSION.test(ext) ? ext : '');
}

function localFile(asset: MediaAsset): File {
  return new File(packDirectory(), fileNameFor(asset));
}

/** The local URI for an asset, or null when it hasn't been downloaded yet. */
export function cachedUri(asset: MediaAsset): string | null {
  try {
    const file = localFile(asset);
    return file.exists ? file.uri : null;
  } catch {
    // An unreadable path is indistinguishable from a missing one as far as
    // every caller is concerned: both mean "stream it from the network".
    return null;
  }
}

/** Assets referenced by the currently published content. */
export function packAssets(): MediaAsset[] {
  return Object.values(DEMO_BUNDLE.media);
}

export interface MediaPackStatus {
  /** Assets the current content references. 0 = nothing to download. */
  total: number;
  cached: number;
  bytes: number;
  downloading: boolean;
  /** 0..1 across the whole run; null when nothing is running. */
  progress: number | null;
  /** Assets that failed in the last run — the rest still downloaded. */
  failed: number;
}

let snapshot: MediaPackStatus = {
  total: 0,
  cached: 0,
  bytes: 0,
  downloading: false,
  progress: null,
  failed: 0,
};

const listeners = new Set<() => void>();

// The same external-store shape as data/remoteContent.ts, for the same reason:
// this state lives outside React (the filesystem does), and useSyncExternalStore
// is how a screen learns it changed. getSnapshot MUST keep returning the same
// object identity until something actually changes, or React re-renders forever.
function emit(patch: Partial<MediaPackStatus>): void {
  const next = { ...snapshot, ...patch };
  if ((Object.keys(next) as (keyof MediaPackStatus)[]).every((k) => next[k] === snapshot[k])) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

export const mediaPackStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): MediaPackStatus {
    return snapshot;
  },
};

/** Recounts what's on disk. Cheap enough to call after every state change. */
export function refreshMediaStatus(): void {
  const assets = packAssets();
  let cached = 0;
  let bytes = 0;

  for (const asset of assets) {
    try {
      const file = localFile(asset);
      if (file.exists) {
        cached += 1;
        bytes += file.size;
      }
    } catch {
      // Counts as missing — see cachedUri.
    }
  }

  emit({ total: assets.length, cached, bytes });
}

let running: AbortController | null = null;

/**
 * Downloads everything not already on disk. Never rejects: one unreachable
 * asset must not abandon the rest of the pack, so failures are counted and
 * reported through the store instead of thrown.
 */
export async function downloadMediaPack(): Promise<void> {
  if (running) return;

  const missing = packAssets().filter((a) => !cachedUri(a));
  if (missing.length === 0) {
    refreshMediaStatus();
    return;
  }

  const controller = new AbortController();
  running = controller;
  emit({ downloading: true, progress: 0, failed: 0 });

  let done = 0;
  let failed = 0;

  for (const asset of missing) {
    if (controller.signal.aborted) break;

    try {
      await File.downloadFileAsync(asset.url, localFile(asset), {
        idempotent: true,
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted) break;
      failed += 1;
    }

    done += 1;
    refreshMediaStatus();
    emit({ progress: done / missing.length, failed });
  }

  running = null;
  emit({ downloading: false, progress: null });
  refreshMediaStatus();
}

export function cancelMediaDownload(): void {
  running?.abort();
}

export function deleteMediaPack(): void {
  cancelMediaDownload();

  try {
    const dir = new Directory(Paths.document, DIR_NAME);
    if (dir.exists) dir.delete();
  } catch {
    // Nothing actionable: the next refresh reports whatever survived.
  } finally {
    // The memo now points at a directory that no longer exists — dropping it
    // is what makes the next download recreate it instead of writing nowhere.
    ensuredDirectory = null;
  }

  refreshMediaStatus();
}

const inFlight = new Set<string>();

/**
 * Caches a single asset in the background, so a learner who simply practises
 * ends up with the questions they've seen available offline without ever
 * opening Settings. Returns null when it couldn't be fetched — callers keep
 * streaming from the network in that case.
 */
export async function ensureAsset(asset: MediaAsset): Promise<string | null> {
  const existing = cachedUri(asset);
  if (existing) return existing;
  // Three questions in a row can reference the same illustration; without this
  // guard each mount starts its own download of the same file.
  if (inFlight.has(asset.id)) return null;

  inFlight.add(asset.id);
  try {
    const file = await File.downloadFileAsync(asset.url, localFile(asset), { idempotent: true });
    refreshMediaStatus();
    return file.uri;
  } catch {
    return null;
  } finally {
    inFlight.delete(asset.id);
  }
}
