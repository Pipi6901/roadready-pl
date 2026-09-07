import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import { COUNTRIES, DEMO_BUNDLE } from '@/data/demo-bundle';
import { initRemoteContent, remoteContentStore } from '@/data/remoteContent';
import { LESSON_SIZE } from '@/constants/rules';
import {
  questionCategory,
  questionPoints,
  type Country,
  type DisplayQuestion,
  type Question,
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
  const { localeCode, countryCode } = useSettings();
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

  const showTranslation = !!localeCode && can('translation');

  const decorate = useCallback(
    (q: Question): DisplayQuestion => ({
      ...q,
      translation: showTranslation ? (DEMO_BUNDLE.translations[localeCode!]?.[q.id] ?? null) : null,
      media: q.mediaId ? (DEMO_BUNDLE.media[q.mediaId] ?? null) : null,
    }),
    [showTranslation, localeCode],
  );

  const value = useMemo<ContentContextValue>(() => {
    const country = COUNTRIES.find((c) => c.code === countryCode) ?? DEMO_BUNDLE.country;

    const questionsForTopic = (topicId: string) =>
      DEMO_BUNDLE.questions.filter((q) => q.topicId === topicId);

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
      topics: DEMO_BUNDLE.topics,
      getTopic: (topicId) => DEMO_BUNDLE.topics.find((t) => t.id === topicId),
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
      randomQuestions: (count) => shuffled(DEMO_BUNDLE.questions, count).map(decorate),
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
              const pool = DEMO_BUNDLE.questions.filter(
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
            const rest = DEMO_BUNDLE.questions.filter((q) => !picked.includes(q));
            picked.push(...shuffled(rest, target - picked.length));
          }
          return shuffled(picked, Math.min(target, picked.length)).map(decorate);
        }

        if (composition) {
          const picked: Question[] = [];
          for (const [category, wanted] of Object.entries(composition)) {
            const pool = DEMO_BUNDLE.questions.filter((q) => questionCategory(q) === category);
            picked.push(...shuffled(pool, wanted));
          }
          if (picked.length < target) {
            const rest = DEMO_BUNDLE.questions.filter((q) => !picked.includes(q));
            picked.push(...shuffled(rest, target - picked.length));
          }
          return shuffled(picked, Math.min(target, picked.length)).map(decorate);
        }

        // Proportional sampling across topics, as the real exam does.
        const perTopic = Math.max(1, Math.floor(target / DEMO_BUNDLE.topics.length));
        const picked: Question[] = [];
        for (const topic of DEMO_BUNDLE.topics) {
          picked.push(...shuffled(questionsForTopic(topic.id), perTopic));
        }
        const remaining = DEMO_BUNDLE.questions.filter((q) => !picked.includes(q));
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
  }, [countryCode, decorate, progress.state.lessons, contentVersion]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
