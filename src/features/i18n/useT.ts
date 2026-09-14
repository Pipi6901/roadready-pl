import React from 'react';

import { useSettings } from '@/store/SettingsProvider';
import { CATALOGUES, EN, type StringKey } from './strings';
import { dateLocaleFor, FALLBACK_UI_LOCALE } from './locales';

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

/**
 * The interface translator.
 *
 * Reads the language from settings, so a change re-renders every screen using
 * it — the picker takes effect immediately, with no restart and nothing to
 * reload, because the whole catalogue ships in the binary.
 */
export function useT(): Translate {
  const { uiLocaleCode } = useSettings();
  return React.useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => translate(uiLocaleCode, key, vars),
    [uiLocaleCode],
  );
}

/** The BCP-47 tag matching the interface language, for date formatting. */
export function useDateLocale(): string {
  const { uiLocaleCode } = useSettings();
  return dateLocaleFor(uiLocaleCode);
}
