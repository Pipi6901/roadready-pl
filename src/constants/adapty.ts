import { Platform } from 'react-native';

/**
 * Adapty config for the onboarding flow built in the Adapty dashboard
 * (Splash → Welcome → Language → Goal → Building Plan → Trial → Paywall).
 *
 * This is separate from RevenueCat (src/constants/billing.ts), which still
 * owns the actual paywall/purchase — Adapty here is presentation-only for the
 * pre-paywall screens. Nothing here is secret: Adapty's public SDK key is
 * meant to ship inside the client, same as the RevenueCat key.
 */

/** From the Adapty dashboard → the Polish app (not the UK "RoadReady" one) → SDK keys → Public SDK key. */
export const ADAPTY_PUBLIC_KEY = Platform.select({
  ios: 'public_live_TdjyNzCS.EfqolgrssZRXt86nJFG4',
  android: 'REPLACE_WITH_ADAPTY_PL_ANDROID_PUBLIC_KEY',
  default: '',
})!;

/**
 * Whether the Adapty app for Poland exists yet. With the placeholders above
 * activate() rejects, the funnel screen shows its debug error state, and the
 * first thing a tester sees is a stack trace. Until the keys are real the
 * funnel is skipped outright — see app/index.tsx.
 */
export const ONBOARDING_CONFIGURED =
  ADAPTY_PUBLIC_KEY.length > 0 && !ADAPTY_PUBLIC_KEY.startsWith('REPLACE_WITH_');

/**
 * The Placement ID configured in Adapty for the Polish onboarding
 * funnel. Dashboard → Placements → Onboardings → the placement serving the
 * `main` onboarding.
 *
 * This id looks unremarkable and cost several builds: the original placement
 * had been created with a trailing space in its ID ("roadready_onboarding "),
 * which the dashboard renders trimmed and refuses to edit after creation. Every
 * build 404'd with "Placement Not Found" while the dashboard looked perfectly
 * configured, because the SDK asked for the string without the space. The
 * placement has since been recreated clean, and this id was verified against
 * Adapty's SDK endpoint directly before shipping.
 *
 * So: never paste this value from anywhere. Type it, and keep it byte-identical
 * to the dashboard's Placement ID field.
 */
export const ONBOARDING_PLACEMENT_ID = 'roadready_pl_onboarding';
