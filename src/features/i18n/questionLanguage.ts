import { useMemo } from 'react';

import { bcp47For } from '@/features/i18n/locales';
import { useSettings } from '@/store/SettingsProvider';

/**
 * Which language a question, its options and its explanation are shown in.
 *
 * Two modes, decided by EXAM_LANGUAGES:
 *
 * - Exam language (English, German, Ukrainian) — the chosen language REPLACES
 *   the Polish. The candidate may sit the exam in it, so the wording they have
 *   to recognise on the day is the translated one, and a Polish line above it
 *   would only be noise. "Polish only" is the same mode with nothing to swap in.
 * - Study aid (Russian, Spanish, Turkish) — Polish on top, translation below,
 *   because the paper at WORD will be in Polish whatever the app showed.
 *
 * Every field falls back to the Polish on its own: a translation may cover the
 * question text and not an option, and half a missing language is worse than
 * a language that quietly stays Polish where it has nothing to say.
 */
export function useQuestionLanguage() {
  const { localeCode, examLanguage, translationEnabled } = useSettings();
  // translationEnabled only says a language is *selected*; ContentProvider is
  // the one that decides whether the tier allows it and passes null if not,
  // which is why every helper below tolerates a missing translation.
  const single = translationEnabled && examLanguage;
  const tag = bcp47For(single && localeCode ? localeCode : 'pl');

  // Memoised: the screens hang Speech.speak off a useCallback that takes this
  // object as a dependency, and a fresh object on every render would restart the
  // narration on every state change.
  return useMemo(() => ({
    /** The chosen language replaces the Polish instead of sitting under it. */
    examLanguage: single,
    /** The line to show first. */
    primary: (original: string, translation?: string | null) =>
      single && translation ? translation : original,
    /** The line to show underneath, if any. */
    secondary: (translation?: string | null) => (single ? null : (translation ?? null)),
    /**
     * What to read aloud, and in which voice. The tag has to follow the text:
     * reading English with a Polish voice produced something no learner would
     * recognise, and so does the reverse.
     */
    spoken: (original: string, translation?: string | null) =>
      single && translation
        ? { text: translation, language: tag }
        : { text: original, language: bcp47For('pl') },
  }), [single, tag]);
}
