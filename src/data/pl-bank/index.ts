import type { QuestionTranslation, TranslationBundle } from '@/types/content';
import { EN } from './en';
import { ES } from './es';
import { PL_QUESTIONS } from './questions';
import { RU } from './ru';
import { TR } from './tr';
import type { BankTranslation } from './types';
import { UK } from './uk';

export { PL_QUESTIONS } from './questions';

/** How TAK / NIE read in each translation language. */
const YES_NO: Record<string, [string, string]> = {
  en: ['Yes', 'No'],
  uk: ['Так', 'Ні'],
  ru: ['Да', 'Нет'],
  es: ['Sí', 'No'],
  tr: ['Evet', 'Hayır'],
};

const SOURCES: Record<string, Record<string, BankTranslation>> = { en: EN, uk: UK, ru: RU, es: ES, tr: TR };

/**
 * Expands the short per-language files into the bundle shape the app reads.
 *
 * Options are keyed by the ids the questions use — T/N for basic, A/B/C for
 * specialist — so `question.translation.options[option.id]` lines up without
 * the screens knowing which class they are showing.
 */
function expand(source: Record<string, BankTranslation>, yesNo: [string, string]): Record<string, QuestionTranslation> {
  const out: Record<string, QuestionTranslation> = {};
  for (const question of PL_QUESTIONS) {
    const entry = source[question.id];
    if (!entry) continue;
    const options: Record<string, string> = entry.o
      ? { A: entry.o[0], B: entry.o[1], C: entry.o[2] }
      : { T: yesNo[0], N: yesNo[1] };
    out[question.id] = { text: entry.t, options, explanation: entry.e };
  }
  return out;
}

export const PL_BANK_TRANSLATIONS: TranslationBundle = Object.fromEntries(
  Object.entries(SOURCES).map(([locale, source]) => [locale, expand(source, YES_NO[locale])]),
);
