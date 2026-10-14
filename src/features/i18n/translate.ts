import { CATALOGUES, EN, type StringKey } from './strings';
import { FALLBACK_UI_LOCALE } from './locales';

/**
 * Translation without React, and without a cycle.
 *
 * This used to live in useT.ts next to the hook — but that file imports
 * useSettings, so everything that only wanted the plain function dragged in
 * the settings provider behind it: SettingsProvider -> reminders -> useT ->
 * SettingsProvider. Metro tolerates that today because nothing calls across
 * the cycle at module-evaluation time, which is a property of the current
 * code rather than a guarantee.
 *
 * Keeping the function here, where the only imports are the catalogues and
 * the fallback locale, means the provider, the notification scheduler and the
 * plain helper modules can all translate without touching React at all.
 */

export type Translate = (key: StringKey, vars?: Record<string, string | number>) => string;

/** Fills `{name}` placeholders. Unknown names are left alone rather than blanked. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  );
}

export function translate(
  locale: string,
  key: StringKey,
  vars?: Record<string, string | number>,
): string {
  // English last, and unconditionally: a key with no translation yet reads in
  // English rather than as a blank or a raw dotted key.
  const value = CATALOGUES[locale]?.[key] ?? CATALOGUES[FALLBACK_UI_LOCALE]?.[key] ?? EN[key];
  return interpolate(value, vars);
}
