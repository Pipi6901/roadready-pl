import { Platform } from 'react-native';

import { AMPLITUDE_API_KEY, AMPLITUDE_ENDPOINT, ANALYTICS_ENABLED } from '@/constants/analytics';
import { KEYS, load, save } from '@/store/storage';

/**
 * Product analytics — the funnel events listed in docs/06-monetization.md §7.
 *
 * Deliberately Amplitude's HTTP API over `@amplitude/analytics-react-native`,
 * which docs/09-tech-stack.md nominated. Two reasons, and this is a documented
 * deviation rather than an oversight:
 *
 *  1. docs/09-tech-stack.md itself flags that the RN SDK's New Architecture
 *     support is unconfirmed. This app runs New Architecture. Adding a native
 *     module that might crash on launch is the exact failure ADR-012 already
 *     cost us once with react-native-purchases.
 *  2. A plain `fetch` needs no prebuild, no autolinking and no config plugin —
 *     the same reasoning ADR-011 used to keep the Firebase SDK out and fetch
 *     content.json over plain HTTPS instead.
 *
 * Swapping to the SDK later means reimplementing `track()` and nothing else:
 * no screen imports Amplitude, they all go through this module.
 */

/** Amplitude's own cap is 2000 events per request; we batch far below it. */
const MAX_BATCH = 30;
/** Beyond this the queue is dropping the oldest events rather than growing forever. */
const MAX_QUEUE = 200;

interface AmplitudeEvent {
  event_type: string;
  event_properties?: Record<string, unknown>;
  time: number;
  platform: string;
  os_name: string;
  app_version: string;
}

let deviceId: string | null = null;
let queue: AmplitudeEvent[] = [];
let flushing = false;
let ready = false;

/**
 * A random id generated once and kept on the device. Not a user id: the app has
 * no accounts (ADR-002) and this must never be derived from anything that
 * identifies a person — no IDFA, no install id, no email. Deleting the app
 * deletes it, which is exactly what the privacy policy promises.
 */
function newDeviceId(): string {
  const rnd = () => Math.random().toString(36).slice(2, 10);
  return `rr-${Date.now().toString(36)}-${rnd()}${rnd()}`;
}

export async function initAnalytics(appVersion: string): Promise<void> {
  version = appVersion;
  const stored = await load<string | null>(KEYS.analyticsDeviceId, null);
  deviceId = stored ?? newDeviceId();
  if (!stored) void save(KEYS.analyticsDeviceId, deviceId);
  ready = true;
  void flush();
}

let version = '0.0.0';

/**
 * Records one event. Never throws and never blocks the caller — a screen must
 * not care whether analytics is reachable, and a dropped event is always
 * preferable to a broken lesson.
 */
export function track(eventType: string, properties?: Record<string, unknown>): void {
  if (!ANALYTICS_ENABLED) return;

  queue.push({
    event_type: eventType,
    event_properties: properties,
    time: Date.now(),
    platform: Platform.OS,
    os_name: Platform.OS,
    app_version: version,
  });

  if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
  void flush();
}

async function flush(): Promise<void> {
  // `ready` gates on the device id: events sent without one are attributed to
  // nobody and Amplitude cannot build a funnel out of them.
  if (!ANALYTICS_ENABLED || !ready || flushing || queue.length === 0) return;

  flushing = true;
  const batch = queue.slice(0, MAX_BATCH);

  try {
    const res = await fetch(AMPLITUDE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: AMPLITUDE_API_KEY,
        events: batch.map((e) => ({ ...e, device_id: deviceId })),
      }),
    });

    // 4xx means Amplitude rejected the payload itself — retrying identical
    // events would loop forever, so they are dropped. 5xx and network failures
    // are transient, so the batch stays queued for the next track() call.
    if (res.ok || (res.status >= 400 && res.status < 500)) {
      queue = queue.slice(batch.length);
    }
  } catch {
    // Offline. The queue survives until the next event or app start.
  } finally {
    flushing = false;
  }

  // Events fired while the request was in flight found `flushing` true and
  // returned without sending. Without this line they would sit in the queue
  // until the *next* track() call — so the last event of any burst always
  // arrived one event late, and the final one never arrived at all.
  if (queue.length > 0) void flush();
}

/** Events from docs/06-monetization.md §7. Named here so screens can't typo them. */
export const EVENTS = {
  appOpened: 'app_opened',
  onboardingStarted: 'onboarding_started',
  onboardingCompleted: 'onboarding_completed',
  paywallShown: 'paywall_shown',
  paywallDismissed: 'paywall_dismissed',
  purchaseCompleted: 'purchase_completed',
  purchaseRestored: 'purchase_restored',
  lessonStarted: 'lesson_started',
  lessonCompleted: 'lesson_completed',
  mockTestFinished: 'mock_test_finished',
  limitHit: 'limit_hit',
  mediaDownloadFinished: 'content_download_finished',
} as const;
