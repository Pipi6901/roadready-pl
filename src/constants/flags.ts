/**
 * Feature flags.
 *
 * Everything here is a temporary switch, not a product decision. Screens behind
 * a disabled flag stay in the repository, fully written and type-checked — they
 * are only unreachable at runtime. Flipping a flag back to `true` is the whole
 * re-enable procedure; see docs/11-feature-flags.md.
 */

/**
 * Onboarding flow: Welcome → Country → Language → Goal.
 *
 * OFF until the flow is wired through Adapty. While off, the splash screen
 * routes straight to the tabs and the app runs on the defaults below.
 * Country and translation language remain changeable in Settings.
 */
export const ONBOARDING_ENABLED = false;

/**
 * Paywall and the free-tier limits that push users towards it.
 *
 * OFF until billing is connected (ADR-005). While off, every feature is
 * unlocked: gating features without a way to pay for them would leave the app
 * unusable, not monetised.
 */
export const PAYWALL_ENABLED = false;

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
