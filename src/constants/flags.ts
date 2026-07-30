/**
 * Feature flags.
 *
 * Everything here is a temporary switch, not a product decision. Screens behind
 * a disabled flag stay in the repository, fully written and type-checked — they
 * are only unreachable at runtime. Flipping a flag back to `true` is the whole
 * re-enable procedure; see docs/11-feature-flags.md.
 */

/**
 * Onboarding flow: Welcome → Country → Language → Goal → Paywall.
 *
 * ON — RevenueCat + App Store products exist (ADR-012). Country and
 * translation language remain changeable in Settings regardless.
 */
export const ONBOARDING_ENABLED = true;

/**
 * Paywall and the free-tier limits that push users towards it.
 *
 * ON for iOS: react-native-iap + RevenueCat REST are wired (ADR-012), the
 * Monthly/Yearly products exist in App Store Connect and are attached to the
 * `RoadReady Pro` entitlement. NOTE: this has not been exercised on a real
 * device/TestFlight build yet (no Mac available in this environment) — verify
 * purchase, restore, and trial expiry against a sandbox account before
 * shipping. Android is not configured in RevenueCat yet; requestPurchase's
 * `google` branch will fail until it is.
 */
export const PAYWALL_ENABLED = true;

/**
 * Hazard Perception (ADR-006). The clips ship with the DVSA licence pack we do
 * not have yet, so the screen exists but is unreachable.
 */
export const HAZARD_ENABLED = false;

/** Defaults applied when onboarding is skipped. */
export const ONBOARDING_SKIP_DEFAULTS = {
  countryCode: 'GB',
  /** null = "English only (no translation)". */
  localeCode: null as string | null,
} as const;
