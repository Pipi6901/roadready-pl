/**
 * Interface languages.
 *
 * Distinct from the translation languages in `LOCALES` (src/data/demo-bundle.ts),
 * which decide what appears *under* a question. This list decides what the app
 * itself says — buttons, settings, results — and the two are chosen separately
 * on purpose: someone sitting the exam in Polish may still want the app in
 * Ukrainian, and someone comfortable in Polish may want no translation at all.
 *
 * Polish is here and absent from the translation list for the same reason: it
 * is the original the questions are written in, so it can never be a
 * translation, but it is a perfectly ordinary choice for the interface.
 */
export interface UiLocale {
  code: string;
  nameNative: string;
  nameEnglish: string;
  flagEmoji: string;
}

export const UI_LOCALES: UiLocale[] = [
  { code: 'pl', nameNative: 'Polski', nameEnglish: 'Polish', flagEmoji: '🇵🇱' },
  { code: 'uk', nameNative: 'Українська', nameEnglish: 'Ukrainian', flagEmoji: '🇺🇦' },
  { code: 'ru', nameNative: 'Русский', nameEnglish: 'Russian', flagEmoji: '🇷🇺' },
  { code: 'en', nameNative: 'English', nameEnglish: 'English', flagEmoji: '🇬🇧' },
  { code: 'es', nameNative: 'Español', nameEnglish: 'Spanish', flagEmoji: '🇪🇸' },
  { code: 'be', nameNative: 'Беларуская', nameEnglish: 'Belarusian', flagEmoji: '🇧🇾' },
];

/**
 * The language the app falls back to.
 *
 * English rather than Polish, even though this is a Polish-market app: the
 * audience is largely people who do not read Polish yet — that gap is the whole
 * product — so defaulting the interface to Polish would greet exactly the wrong
 * user with a wall of the language they came here not knowing.
 */
export const FALLBACK_UI_LOCALE = 'en';

export function findUiLocale(code: string | null | undefined): UiLocale | null {
  if (!code) return null;
  return UI_LOCALES.find((l) => l.code === code) ?? null;
}

/**
 * The device's language, if the app speaks it.
 *
 * Read through Intl rather than expo-localization: Hermes ships a resolved
 * locale already, and this is the only thing the app needs from it — not worth
 * a native module in the build.
 */
export function deviceUiLocale(): string {
  try {
    const tag = Intl.DateTimeFormat().resolvedOptions().locale;
    const base = tag.split(/[-_]/)[0].toLowerCase();
    return findUiLocale(base) ? base : FALLBACK_UI_LOCALE;
  } catch {
    return FALLBACK_UI_LOCALE;
  }
}
