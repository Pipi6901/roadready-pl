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

/** From the Adapty dashboard → the "RoadReady" app (not "Kepler") → SDK keys → Public SDK key. */
export const ADAPTY_PUBLIC_KEY = Platform.select({
  ios: 'public_live_TJPMyjPL.sPAJ9Xx9M9A6DmmmOpd8',
  android: 'REPLACE_WITH_ADAPTY_ANDROID_PUBLIC_KEY',
  default: '',
})!;

/**
 * The Placement ID configured in Adapty for the "roadready" onboarding
 * funnel. Dashboard → Placements → create one pointing at that funnel, then
 * paste its ID here.
 */
export const ONBOARDING_PLACEMENT_ID = 'REPLACE_WITH_ONBOARDING_PLACEMENT_ID';
