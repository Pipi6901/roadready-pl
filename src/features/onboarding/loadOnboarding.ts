import { adapty, type AdaptyOnboarding } from 'react-native-adapty';

import { ADAPTY_PUBLIC_KEY, ONBOARDING_PLACEMENT_ID } from '@/constants/adapty';

/**
 * Fetching the onboarding funnel built in the Adapty dashboard.
 *
 * Screens compose components and don't talk to SDKs themselves (CLAUDE.md), so
 * this module is the only place on the fetch side that knows Adapty exists.
 */

/** Which step failed — activation and placement lookup fail for different reasons. */
export type OnboardingLoadStage = 'activate' | 'fetch';

export class OnboardingLoadError extends Error {
  constructor(
    readonly stage: OnboardingLoadStage,
    readonly detail: string,
  ) {
    super(detail);
    this.name = 'OnboardingLoadError';
  }
}

/**
 * AdaptyError's `.message` is a generic wrapper ("An error was returned by the
 * server...") — the cause is in `.detail` (the actual HTTP request and response
 * body) and `.adaptyCode`.
 */
function describe(e: unknown): string {
  const err = e as { message?: string; detail?: string; adaptyCode?: unknown };
  const parts = [
    err?.message,
    err?.detail && `detail: ${err.detail}`,
    err?.adaptyCode != null && `code: ${err.adaptyCode}`,
  ].filter(Boolean);

  return parts.length ? parts.join('\n') : JSON.stringify(e);
}

export async function loadOnboarding(): Promise<AdaptyOnboarding> {
  try {
    // Unlike RevenueCat's Purchases.configure(), Adapty exposes isActivated()
    // specifically so callers can avoid a second activate() — which rejects
    // rather than no-oping.
    if (!(await adapty.isActivated())) {
      await adapty.activate(ADAPTY_PUBLIC_KEY);
    }
  } catch (e) {
    // Kept separate from the fetch below: a failure here means the key or the
    // SDK setup, and retrying the placement lookup on top of it would report
    // the wrong cause.
    throw new OnboardingLoadError('activate', describe(e));
  }

  // No locale argument on purpose. The SDK sends the device locale and Adapty
  // falls back to the onboarding's default localisation when there is no match,
  // so hardcoding 'en' here would freeze the funnel in English the day
  // localisations are added in the dashboard.
  try {
    return await adapty.getOnboarding(ONBOARDING_PLACEMENT_ID);
  } catch (targeted) {
    // getOnboarding() resolves through the placement's audience rules;
    // getOnboardingForDefaultAudience() skips them. Trying both keeps a broken
    // audience rule from looking like a missing placement — and when both fail,
    // the two errors together say which it was.
    try {
      return await adapty.getOnboardingForDefaultAudience(ONBOARDING_PLACEMENT_ID);
    } catch (defaultAudience) {
      throw new OnboardingLoadError(
        'fetch',
        `placement: ${ONBOARDING_PLACEMENT_ID}\n\ngetOnboarding:\n${describe(targeted)}\n\ngetOnboardingForDefaultAudience:\n${describe(defaultAudience)}`,
      );
    }
  }
}
