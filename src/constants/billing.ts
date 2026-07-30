import { Platform } from 'react-native';

/**
 * Billing config (ADR-012 supersedes ADR-005's "Adapty" pick for RevenueCat +
 * react-native-iap — see docs/00-decisions.md).
 *
 * All values below are placeholders until the RevenueCat project and the two
 * store listings exist. Nothing here is secret: RevenueCat's public API keys
 * and store product identifiers are meant to ship inside the client, the same
 * way a Stripe publishable key does.
 */

/** From the RevenueCat dashboard → Project settings → API keys → Public app-specific key. */
export const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_HPwkqAEbFVWiRWIjtbbMJCmyuAA',
  // Android app not configured in RevenueCat yet — fill in once it exists.
  android: 'REPLACE_WITH_REVENUECAT_GOOGLE_PUBLIC_KEY',
  default: '',
})!;

/** Must match the SKUs created in App Store Connect / Google Play Console exactly. */
export const PRODUCT_IDS = {
  monthly: 'com.astonio.roadready.pro.monthly',
  yearly: 'com.astonio.roadready.pro.yearly',
} as const;

export const SUBSCRIPTION_SKUS = Object.values(PRODUCT_IDS);

/**
 * The entitlement identifier configured in the RevenueCat dashboard for "Pro"
 * access. Not a slug — the onboarding wizard used the display name typed in
 * at project setup verbatim as the identifier.
 */
export const ENTITLEMENT_ID = 'RoadReady Pro';

export const REVENUECAT_RECEIPTS_URL = 'https://api.revenuecat.com/v1/receipts';
export const REVENUECAT_SUBSCRIBER_URL = 'https://api.revenuecat.com/v1/subscribers';
