import { Platform } from 'react-native';

/**
 * Billing config (ADR-012 supersedes ADR-005's "Adapty" pick; ADR-014
 * supersedes ADR-012's react-native-iap choice with the native
 * react-native-purchases(-ui) SDK — see docs/00-decisions.md).
 *
 * Nothing here is secret: RevenueCat's public API keys and store product
 * identifiers are meant to ship inside the client, the same way a Stripe
 * publishable key does.
 */

/** From the RevenueCat dashboard → Project settings → API keys → Public app-specific key. */
export const REVENUECAT_API_KEY = Platform.select({
  ios: 'REPLACE_WITH_REVENUECAT_PL_IOS_PUBLIC_KEY',
  // Android app not configured in RevenueCat yet — fill in once it exists.
  android: 'REPLACE_WITH_REVENUECAT_PL_ANDROID_PUBLIC_KEY',
  default: '',
})!;

/** Must match the SKUs created in App Store Connect / Google Play Console exactly. */
export const PRODUCT_IDS = {
  monthly: 'com.astonio.roadreadypl.pro.monthly',
  yearly: 'com.astonio.roadreadypl.pro.yearly',
} as const;

/**
 * The entitlement identifier configured in the RevenueCat dashboard for "Pro"
 * access. Not a slug — the onboarding wizard used the display name typed in
 * at project setup verbatim as the identifier.
 */
export const ENTITLEMENT_ID = 'RoadReady Pro';
