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
  { code: 'de', nameNative: 'Deutsch', nameEnglish: 'German', flagEmoji: '🇩🇪' },
  { code: 'es', nameNative: 'Español', nameEnglish: 'Spanish', flagEmoji: '🇪🇸' },
  { code: 'tr', nameNative: 'Türkçe', nameEnglish: 'Turkish', flagEmoji: '🇹🇷' },
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

/**
 * BCP-47 tag for `toLocaleDateString` and friends, from an interface language.
 *
 * Dates used to be formatted with a hardcoded British locale, so a Ukrainian
 * interface still said "14 Sept 2026" between two lines of Ukrainian. The
 * region halves are the conventional ones; only the language half changes what
 * a date looks like.
 */
export function dateLocaleFor(uiLocaleCode: string): string {
  return bcp47For(uiLocaleCode);
}

const BCP47: Record<string, string> = {
  pl: 'pl-PL', uk: 'uk-UA', ru: 'ru-RU', en: 'en-GB', de: 'de-DE', es: 'es-ES', tr: 'tr-TR',
};

/** Full BCP-47 tag for a bare language code — dates, and the speech engine. */
export function bcp47For(code: string): string {
  return BCP47[code] ?? 'en-GB';
}

/**
 * The languages the Polish theory exam is actually sat in.
 *
 * Article 51 of the driving-licence act lets a candidate take the exam in
 * Polish, English, German or Ukrainian, and the ministry publishes the
 * catalogue in all four. For those the app shows the question in that language
 * ALONE: it is the wording the candidate will meet at WORD, so putting Polish
 * above it would be showing them a language they will never have to read.
 *
 * Every other language in LOCALES is a study aid. There the Polish stays on
 * top and the translation sits underneath, because on the day the paper will
 * be in Polish whatever the app showed.
 *
 * Not in content.json on purpose: remoteContent replaces the locale list
 * wholesale on every publish, and which languages a state exam accepts is a
 * fact about the exam, not about a content bundle.
 */
export const EXAM_LANGUAGES = ['pl', 'en', 'de', 'uk'] as const;

export function isExamLanguage(code: string | null | undefined): boolean {
  return !!code && (EXAM_LANGUAGES as readonly string[]).includes(code);
}
