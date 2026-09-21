import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { DEMO_BUNDLE } from '@/data/demo-bundle';
import { EVENTS, track } from '@/features/analytics/analytics';
import { questionAppliesTo, type MediaAsset } from '@/types/content';

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

/**
 * Assets the offline pack holds: what the questions for one licence category
 * refer to, not the whole library. The ministry's archive is 1,500 pictures
 * and 1,100 clips — about two gigabytes — and a car candidate has no use for
 * the tram and lorry clips in it, so the pack follows the picker.
 */
export function packAssets(licence: string): MediaAsset[] {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];
  for (const q of DEMO_BUNDLE.questions) {
    if (!q.mediaId || seen.has(q.mediaId) || !questionAppliesTo(q, licence)) continue;
    const asset = DEMO_BUNDLE.media[q.mediaId];
    if (!asset) continue;
    seen.add(q.mediaId);
    assets.push(asset);
  }
  return assets;
}

export interface MediaPackStatus {
  /** Assets the current content references for the chosen licence. 0 = nothing to download. */
  total: number;
  cached: number;
  /** On disk now. */
  bytes: number;
  /** Whole pack, from the sizes the publisher recorded; 0 when unknown. */
  totalBytes: number;
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
  totalBytes: 0,
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

// The licence the pack was last measured for; downloads and deletes recount
// with the same one so the figures on screen stay about a single pack.
let currentLicence = 'B';

/** Recounts what's on disk. Cheap enough to call after every state change. */
export function refreshMediaStatus(licence: string = currentLicence): void {
  currentLicence = licence;
  const assets = packAssets(licence);
  let cached = 0;
  let bytes = 0;
  let totalBytes = 0;

  for (const asset of assets) {
    totalBytes += asset.bytes ?? 0;
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

  emit({ total: assets.length, cached, bytes, totalBytes });
}

let running: AbortController | null = null;

/**
 * Downloads everything not already on disk. Never rejects: one unreachable
 * asset must not abandon the rest of the pack, so failures are counted and
 * reported through the store instead of thrown.
 */
export async function downloadMediaPack(licence: string = currentLicence): Promise<void> {
  if (running) return;
  currentLicence = licence;

  const missing = packAssets(licence).filter((a) => !cachedUri(a));
  if (missing.length === 0) {
    refreshMediaStatus(licence);
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
  track(EVENTS.mediaDownloadFinished, {
    requested: missing.length,
    failed,
    size_mb: Math.round((snapshot.bytes / (1024 * 1024)) * 10) / 10,
  });
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

const inFlight = new Map<string, Promise<string | null>>();

/**
 * Downloads a single asset to the pack directory, once, and resolves to its
 * local URI — or null when it could not be fetched, in which case callers
 * stream from the network instead.
 *
 * Every viewing goes through here first (see useMediaUri), so a question's
 * picture is transferred exactly once and is then on disk for good: a learner
 * who simply practises ends up with everything they have seen available
 * offline without opening Settings. It used to be the other way round — the
 * screen streamed the URL while this downloaded the same file alongside —
 * which on mobile data meant every clip came down twice, at half speed each.
 *
 * Concurrent callers (a prefetch and the screen that reached the question)
 * share one download rather than starting a second.
 */
export function ensureAsset(asset: MediaAsset): Promise<string | null> {
  const existing = cachedUri(asset);
  if (existing) return Promise.resolve(existing);
  const running = inFlight.get(asset.id);
  if (running) return running;

  const download = (async () => {
    try {
      const file = await File.downloadFileAsync(asset.url, localFile(asset), { idempotent: true });
      refreshMediaStatus();
      return file.uri;
    } catch {
      return null;
    } finally {
      inFlight.delete(asset.id);
    }
  })();
  inFlight.set(asset.id, download);
  return download;
}

/**
 * Warms the cache for the questions about to be shown — a lesson's ten, an
 * exam's thirty-two — a couple at a time, in the order they will appear, so
 * that by the time the learner taps through to the next one its picture or
 * clip is already local. Never rejects; a failed file just streams later.
 */
export function prefetchQuestionMedia(questions: { mediaId: string | null }[], concurrency = 2): void {
  void preloadQuestionMedia(questions, undefined, concurrency);
}

export interface PreloadProgress {
  /** Files that were not on disk when the preload began. */
  total: number;
  /** Files finished so far, failures included. */
  done: number;
  failed: number;
}

/**
 * Same warm-up, but awaited and reported: the mock test waits on this before
 * its clock starts, so that no picture or clip has to load while the
 * per-question timer is already running. Resolves with the final tally
 * rather than rejecting — a file that failed simply streams when reached.
 *
 * On the web there is no file cache (see useMediaUri), so it resolves
 * immediately with nothing to do.
 */
export function preloadQuestionMedia(
  questions: { mediaId: string | null }[],
  onProgress?: (p: PreloadProgress) => void,
  concurrency = 3,
): Promise<PreloadProgress> {
  const seen = new Set<string>();
  const assets: MediaAsset[] = [];
  if (Platform.OS !== 'web') {
    for (const q of questions) {
      if (!q.mediaId || seen.has(q.mediaId)) continue;
      seen.add(q.mediaId);
      const asset = DEMO_BUNDLE.media[q.mediaId];
      if (asset && !cachedUri(asset)) assets.push(asset);
    }
  }
  const progress: PreloadProgress = { total: assets.length, done: 0, failed: 0 };
  onProgress?.(progress);
  if (assets.length === 0) return Promise.resolve(progress);

  let next = 0;
  const worker = async () => {
    while (next < assets.length) {
      const uri = await ensureAsset(assets[next++]);
      progress.done += 1;
      if (!uri) progress.failed += 1;
      onProgress?.({ ...progress });
    }
  };
  const workers = [];
  for (let i = 0; i < Math.min(concurrency, assets.length); i += 1) workers.push(worker());
  return Promise.all(workers).then(() => ({ ...progress }));
}
