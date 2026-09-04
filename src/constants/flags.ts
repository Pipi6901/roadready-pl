/**
 * Feature flags.
 *
 * Everything here is a temporary switch, not a product decision. Screens behind
 * a disabled flag stay in the repository, fully written and type-checked — they
 * are only unreachable at runtime. Flipping a flag back to `true` is the whole
 * re-enable procedure; see docs/11-feature-flags.md.
 */

/**
 * Onboarding flow: Welcome → (Country) → Language → Goal → Paywall.
 *
 * ON — RevenueCat + App Store products exist (ADR-012). The Country step is
 * itself skipped — see COUNTRY_SELECTOR_ENABLED below.
 */
export const ONBOARDING_ENABLED = true;

/**
 * The in-app country picker (onboarding step + Settings → Country + the
 * Learn tab's country pill).
 *
 * OFF (ADR-013): the product now ships one country per app build instead of
 * one app covering many countries — this build is Poland-only. `countryCode`
 * stays hardcoded to `'PL'` (see ONBOARDING_SKIP_DEFAULTS and
 * SettingsProvider's DEFAULTS). Unlike the other flags here, this one isn't
 * expected to flip back to `true` in this codebase — a second country means a
 * new app, not a re-enabled picker — but the screens stay in place in case
 * that changes.
 */
export const COUNTRY_SELECTOR_ENABLED = false;

/**
 * Paywall and the free-tier limits that push users towards it.
 *
 * ON for iOS: react-native-purchases(-ui) renders the RevenueCat-hosted
 * paywall and drives the purchase (ADR-014, supersedes ADR-012's
 * react-native-iap choice — that package is no longer installed). Monthly/Yearly
 * products exist in App Store Connect and are attached to the `RoadReady Pro`
 * entitlement.
 *
 * Verified on a real device via TestFlight (2026-08): the app does not crash
 * on launch with this SDK despite the open New Architecture issue ADR-012
 * originally avoided it for, and a sandbox purchase completed end-to-end
 * (native StoreKit sheet, entitlement unlocked). Android is not configured in
 * RevenueCat yet.
 */
export const PAYWALL_ENABLED = true;

/**
 * Hazard Perception (ADR-006). British module: Poland has no separate hazard
 * exam, only ordinary questions that happen to carry a video clip, so this
 * stays off and the video questions run through the normal question screen.
 */
export const HAZARD_ENABLED = false;

/** Defaults applied when onboarding is skipped. */
export const ONBOARDING_SKIP_DEFAULTS = {
  countryCode: 'PL',
  /** null = "Polish only (no translation)". */
  localeCode: null as string | null,
} as const;
