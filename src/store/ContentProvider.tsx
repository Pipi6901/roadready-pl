import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import { COUNTRIES, DEMO_BUNDLE } from '@/data/demo-bundle';
import { initRemoteContent, remoteContentStore } from '@/data/remoteContent';
import { topicName } from '@/features/i18n/topicNames';
import { LESSON_SIZE } from '@/constants/rules';
import {
  questionAppliesTo,
  questionCategory,
  questionPoints,
  type Country,
  type DisplayQuestion,
  type Question,
  type QuestionTranslation,
  type Topic,
} from '@/types/content';
import { useProgress } from './ProgressProvider';
import { useSettings } from './SettingsProvider';
import { useSubscription } from './SubscriptionProvider';

/**
 * Single point of access to content. Screens never touch the bundle directly —
 * this layer decides whether a translation is attached, based on the selected
 * language AND the subscription tier (translation is a Pro feature).
 *
 * The bundled demo-bundle.ts is only the seed/fallback now — on mount this
 * fetches content.json from Firebase Hosting (see src/data/remoteContent.ts)
 * and swaps it in if newer, so content can change without an app-store
 * release. Screens stay unchanged either way, they only ever go through
 * useContent().
 */

/**
 * The question as the catalogue wrote it: Polish, in the shape a translation
 * has, so the two can be used interchangeably below.
 */
function polishOf(q: Question): QuestionTranslation {
  return {
    text: q.text,
    options: Object.fromEntries(q.options.map((o) => [o.id, o.text])),
    explanation: q.explanation,
  };
}

/** One language of a question, or null if the bundle does not carry it. */
function translationOf(q: Question, locale: string, source: QuestionTranslation) {
  return locale === 'pl' ? source : (DEMO_BUNDLE.translations[locale]?.[q.id] ?? null);
}

interface ContentContextValue {
  country: Country;
  countries: Country[];
  topics: Topic[];
  getTopic: (topicId: string) => Topic | undefined;
  getQuestion: (id: string) => DisplayQuestion | undefined;
  questionsForTopic: (topicId: string) => Question[];
  /** Questions for lesson N (0-based) of a topic. */
  lessonQuestions: (topicId: string, lessonIndex: number) => DisplayQuestion[];
  randomQuestions: (count: number) => DisplayQuestion[];
  mockQuestions: () => DisplayQuestion[];
  decorate: (q: Question) => DisplayQuestion;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { localeCode, questionLocale, countryCode, licenceCategory, uiLocaleCode } = useSettings();
  const { can } = useSubscription();
  const progress = useProgress();

  // Fires once per app start: apply whatever was cached from the last fetch,
  // then check Firebase Hosting for anything newer in the background. Never
  // blocks — the app renders with the bundled seed immediately either way
  // (NFR-01, cold start must not wait on the network).
  useEffect(() => {
    void initRemoteContent();
  }, []);

  // DEMO_BUNDLE's fields get mutated in place when new content arrives
  // (see remoteContent.ts) — invisible to the `value` useMemo below unless
  // something in its dependency array actually changes, so this is that
  // something.
  const contentVersion = React.useSyncExternalStore(
    remoteContentStore.subscribe,
    remoteContentStore.getVersion,
  );

  // The second line only. The first one is not gated: reading the paper in
  // one of the four languages the exam is actually sat in is the exam, not a
  // feature, and a learner who will answer in English should never be shown
  // Polish because they have not paid.
  const showTranslation = !!localeCode && localeCode !== questionLocale && can('translation');

  const decorate = useCallback(
    (q: Question): DisplayQuestion => {
      // Screens re-decorate questions they are already holding — the lesson
      // queue is frozen at mount and decorated afresh on every render — so the
      // Polish has to be carried along rather than read back off `text`, which
      // by then may be in any of the four languages. Without this, picking
      // Polish as the second line showed the first line twice.
      const source = 'source' in q ? (q as DisplayQuestion).source : polishOf(q);
      const base = translationOf(q, questionLocale, source) ?? source;
      const translation = showTranslation ? translationOf(q, localeCode!, source) : null;
      return {
        ...q,
        source,
        // Field by field, so a translation that covers the question and not an
        // option leaves that one option in Polish rather than blanking it.
        text: base.text,
        options: q.options.map((o) => ({
          ...o,
          text: base.options?.[o.id] ?? source.options[o.id] ?? o.text,
        })),
        explanation: base.explanation || source.explanation,
        textLocale: base === source ? 'pl' : questionLocale,
        translation,
        media: q.mediaId ? (DEMO_BUNDLE.media[q.mediaId] ?? null) : null,
      };
    },
    [showTranslation, localeCode, questionLocale],
  );

  const value = useMemo<ContentContextValue>(() => {
    const country = COUNTRIES.find((c) => c.code === countryCode) ?? DEMO_BUNDLE.country;

    // The bank for the licence the learner is going for. The exam paper is
    // the same shape for every category — 20 basic, 12 specialist, 74 points —
    // but a lorry candidate is asked about tachographs and a motorcyclist
    // about counter-steering, so every draw below comes from this list, not
    // from the whole catalogue. Sections with nothing in them for this
    // licence disappear from the map rather than sitting there empty.
    const bank = DEMO_BUNDLE.questions.filter((q) => questionAppliesTo(q, licenceCategory));
    // Section names follow the interface language, not the question language:
    // they are navigation, and a map of Polish headings is unreadable to the
    // learner the app exists for. Falls back to the bundle's Polish for any
    // id the catalogue in topicNames.ts does not know.
    const named = (t: Topic): Topic => ({ ...t, name: topicName(uiLocaleCode, t.id, t.name) });
    const topics = DEMO_BUNDLE.topics.filter((t) => bank.some((q) => q.topicId === t.id)).map(named);

    const questionsForTopic = (topicId: string) => bank.filter((q) => q.topicId === topicId);

    const shuffled = (source: Question[], count: number) => {
      const copy = [...source];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, count);
    };

    return {
      country,
      countries: COUNTRIES,
      topics,
      getTopic: (topicId) => {
        const topic = DEMO_BUNDLE.topics.find((t) => t.id === topicId);
        return topic ? named(topic) : undefined;
      },
      // By id, from the whole catalogue: a saved or wrong question stays
      // reachable after a change of licence category.
      getQuestion: (id) => {
        const q = DEMO_BUNDLE.questions.find((x) => x.id === id);
        return q ? decorate(q) : undefined;
      },
      questionsForTopic,
      lessonQuestions: (topicId, lessonIndex) =>
        questionsForTopic(topicId)
          .slice(lessonIndex * LESSON_SIZE, lessonIndex * LESSON_SIZE + LESSON_SIZE)
          .map(decorate),
      // Quick Quiz draws from the whole bank, which is what the exam does from
      // the first day. It used to be restricted to topics unlocked on the Learn
      // map, back when the map gated them sequentially; with that gate gone
      // there is nothing left to respect, and holding questions back would only
      // make the quiz an easier exam than the real one.
      randomQuestions: (count) => shuffled(bank, count).map(decorate),
      mockQuestions: () => {
        const { questionCount: target, composition, weights } = country.mockTest;

        // Where the exam fixes the make-up of a paper, that comes first and
        // topic spread second: a paper with the wrong number of specialist
        // questions is the wrong exam, however well it covers the syllabus.
        //
        // Poland fixes it twice over — by class AND by weight — so the paper is
        // built bucket by bucket: 10 basic worth 3 points, 6 worth 2, 4 worth 1,
        // then the specialist grid. Sampling 32 questions at random would land
        // on some other total than 74, and a pass mark of 68 points would then
        // be a number with nothing behind it.
        if (weights) {
          const picked: Question[] = [];
          for (const [category, grid] of Object.entries(weights)) {
            for (const [points, wanted] of Object.entries(grid)) {
              const pool = bank.filter(
                (q) => questionCategory(q) === category && questionPoints(q) === Number(points),
              );
              // Shuffling the whole bucket is what spreads the paper across
              // topics: every section of that class and weight is in the hat.
              picked.push(...shuffled(pool, wanted));
            }
          }
          // A bucket the bank cannot fill yet would otherwise serve a paper
          // shorter than the exam, so the shortfall is topped up from what is
          // left. It makes the total wrong, which is the right kind of wrong:
          // visibly short rather than silently mis-weighted.
          if (picked.length < target) {
            const rest = bank.filter((q) => !picked.includes(q));
            picked.push(...shuffled(rest, target - picked.length));
          }
          return shuffled(picked, Math.min(target, picked.length)).map(decorate);
        }

        if (composition) {
          const picked: Question[] = [];
          for (const [category, wanted] of Object.entries(composition)) {
            const pool = bank.filter((q) => questionCategory(q) === category);
            picked.push(...shuffled(pool, wanted));
          }
          if (picked.length < target) {
            const rest = bank.filter((q) => !picked.includes(q));
            picked.push(...shuffled(rest, target - picked.length));
          }
          return shuffled(picked, Math.min(target, picked.length)).map(decorate);
        }

        // Proportional sampling across topics, as the real exam does.
        const perTopic = Math.max(1, Math.floor(target / Math.max(1, topics.length)));
        const picked: Question[] = [];
        for (const topic of topics) {
          picked.push(...shuffled(questionsForTopic(topic.id), perTopic));
        }
        const remaining = bank.filter((q) => !picked.includes(q));
        picked.push(...shuffled(remaining, Math.max(0, target - picked.length)));
        return shuffled(picked, Math.min(target, picked.length)).map(decorate);
      },
      decorate,
    };
    // Deliberately not depending on `progress` as a whole: it gets a new
    // identity on every recordAnswer (any question answered anywhere), and
    // that used to redraw an in-progress Quick Quiz's entire question set out
    // from under the learner mid-session (see randomQuestions above). Topic
    // unlock state only ever changes via completeLesson touching
    // `state.lessons`, so that's the one thing worth reacting to here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode, licenceCategory, uiLocaleCode, decorate, progress.state.lessons, contentVersion]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
