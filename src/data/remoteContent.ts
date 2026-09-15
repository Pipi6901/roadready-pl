import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { COUNTRIES, DEMO_BUNDLE, LOCALES } from './demo-bundle';
import { KEYS, load, remove, save } from '@/store/storage';
import type { ContentBundle, Country, Locale } from '@/types/content';

/**
 * Live content, fetched from Firebase Hosting instead of only ever reading
 * the bundled demo-bundle.ts.
 *
 * This is deliberately the "simple" half of the pipeline docs/02-architecture.md
 * and docs/03-content-pipeline.md describe: one static content.json on Firebase
 * Hosting (see scripts/export-content-json.ts), not yet the full
 * Firestore + Cloud Function + CDN bundle-assembly pipeline. It exists so
 * content can change without an app-store release; growing it into the full
 * pipeline later doesn't require touching the app's content-reading code
 * again, only what produces content.json.
 *
 * No Firebase SDK here on purpose (ADR-011) — this is a plain HTTPS GET.
 */

/**
 * Where published content comes from.
 *
 * This must point at the POLISH project's Hosting site. It was inherited from
 * the British repository still pointing at `roadready-80e53`, which meant the
 * Polish build fetched the British bundle and applied it whole — country,
 * questions, topics and locales — turning itself into the UK app on its first
 * online launch. The guard below is the belt to this braces.
 */
const CONTENT_URL = 'https://roadready-pl.web.app/content.json';

/**
 * The country this build ships for. A payload for anyone else is refused.
 *
 * Cheap, and it turns the class of mistake above into a no-op instead of a
 * silent swap: a wrong URL, a mis-deployed bundle, or a shared project all
 * fail closed on the bundled seed rather than replacing the exam a candidate
 * is preparing for.
 */
const EXPECTED_COUNTRY = 'PL';

interface RemoteContentPayload extends ContentBundle {
  countries: Country[];
  locales: Locale[];
}

function isValidPayload(x: unknown): x is RemoteContentPayload {
  if (!x || typeof x !== 'object') return false;
  const p = x as Record<string, unknown>;
  return (
    Array.isArray(p.topics) &&
    Array.isArray(p.questions) &&
    Array.isArray(p.countries) &&
    Array.isArray(p.locales) &&
    typeof p.versionHash === 'string' &&
    !!p.country &&
    (p.country as Country).code === EXPECTED_COUNTRY
  );
}

// A plain external store (same shape as features/practice/mockSession.ts) so
// ContentProvider can subscribe via useSyncExternalStore and recompute once
// new content actually lands — mutating DEMO_BUNDLE's fields in place is
// invisible to React on its own, nothing about that mutation is a "prop" or
// piece of state React is watching.
let version = 0;
const listeners = new Set<() => void>();

function applyPayload(payload: RemoteContentPayload): void {
  DEMO_BUNDLE.country = payload.country;
  DEMO_BUNDLE.topics = payload.topics;
  DEMO_BUNDLE.questions = payload.questions;
  DEMO_BUNDLE.translations = payload.translations;
  // Older cached payloads (saved before media publishing existed) won't have
  // this field — fall back to empty rather than wiping out a question's
  // ability to resolve its mediaId.
  DEMO_BUNDLE.media = payload.media ?? {};
  DEMO_BUNDLE.versionHash = payload.versionHash;
  // COUNTRIES/LOCALES are imported by reference elsewhere (e.g.
  // ContentProvider destructures COUNTRIES directly) — splice in place
  // rather than reassigning, so every existing reference sees the update.
  COUNTRIES.splice(0, COUNTRIES.length, ...payload.countries);
  LOCALES.splice(0, LOCALES.length, ...payload.locales);
  version += 1;
  listeners.forEach((l) => l());
}

export const remoteContentStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getVersion(): number {
    return version;
  },
};

/**
 * Applies whatever was cached from the last successful fetch (so a
 * returning learner sees last-known content immediately, not the bundled
 * seed), then fetches fresh content in the background and swaps in only if
 * it actually changed. Safe to call once at app startup — never throws,
 * never blocks: a lesson must still open with the bundled seed if the
 * network is unreachable or the fetch fails for any reason.
 */
export async function initRemoteContent(): Promise<void> {
  const cached = await readCache();
  if (cached && isValidPayload(cached)) applyPayload(cached);

  try {
    // no-store: this fetch's entire purpose is checking for something newer
    // than whatever's cached locally — respecting the HTTP cache here would
    // mean a background update check that never actually checks anything
    // new within the Cache-Control window.
    const res = await fetch(CONTENT_URL, { cache: 'no-store' });
    if (!res.ok) return;
    const json: unknown = await res.json();
    if (!isValidPayload(json)) return;
    if (json.versionHash === DEMO_BUNDLE.versionHash) return;
    applyPayload(json);
    void writeCache(json);
  } catch {
    // Offline, DNS failure, malformed JSON — keep whatever we already have
    // (cache applied above, or the bundled seed untouched).
  }
}

/* ------------------------------------------------------------------ cache --- */

/**
 * The last good payload, kept on disk.
 *
 * The full catalogue is 3.5k questions with three translations — about 4 MB
 * of JSON. That used to sit in AsyncStorage, whose Android database is capped
 * at 6 MB in total, so one content update plus the learner's progress would
 * have started failing silently. A plain file under the document directory
 * has no such limit and is backed up with the rest (see storage.ts). The web
 * build has no file system and keeps the old AsyncStorage path; its payload
 * is the same size, but browsers give localStorage/IndexedDB far more room.
 */
const CACHE_FILE = 'remote-content.json';

function cacheFile(): File {
  return new File(Paths.document, CACHE_FILE);
}

async function readCache(): Promise<unknown> {
  if (Platform.OS === 'web') return load<RemoteContentPayload | null>(KEYS.remoteContent, null);
  try {
    const file = cacheFile();
    if (!file.exists) {
      // First launch after the move from AsyncStorage: pick up what the
      // previous version cached, so the learner does not drop back to the
      // seed while the fresh fetch is in flight.
      return load<RemoteContentPayload | null>(KEYS.remoteContent, null);
    }
    return JSON.parse(await file.text()) as unknown;
  } catch {
    return null;
  }
}

async function writeCache(payload: RemoteContentPayload): Promise<void> {
  const text = JSON.stringify(payload);
  if (Platform.OS === 'web') {
    await save(KEYS.remoteContent, payload);
    return;
  }
  try {
    const file = cacheFile();
    if (!file.exists) file.create();
    file.write(text);
    // The old AsyncStorage copy is dead weight now — and the thing most likely
    // to push that database over its cap.
    void remove(KEYS.remoteContent);
  } catch {
    // A failed cache write costs one extra fetch next launch, nothing more.
  }
}
