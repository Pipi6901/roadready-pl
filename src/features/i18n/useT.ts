import React from 'react';

import { useSettings } from '@/store/SettingsProvider';
import { type StringKey } from './strings';
import { dateLocaleFor } from './locales';
import { translate, type Translate } from './translate';

// Re-exported so the many screens that import both the hook and the plain
// function from here keep working, and so there is still one obvious place to
// look for either.
export { translate, type Translate };

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
