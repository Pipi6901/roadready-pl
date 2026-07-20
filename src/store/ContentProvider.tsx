import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { COUNTRIES, DEMO_BUNDLE } from '@/data/demo-bundle';
import { LESSON_SIZE } from '@/constants/rules';
import type { Country, DisplayQuestion, Question, Topic } from '@/types/content';
import { useSettings } from './SettingsProvider';
import { useSubscription } from './SubscriptionProvider';

/**
 * Single point of access to content. Screens never touch the bundle directly —
 * this layer decides whether a translation is attached, based on the selected
 * language AND the subscription tier (translation is a Pro feature).
 *
 * Today it serves the bundled demo pack; in production it reads the downloaded
 * content package (docs/02-architecture.md §3). Screens stay unchanged.
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

  const showTranslation = !!localeCode && can('translation');

  const decorate = useCallback(
    (q: Question): DisplayQuestion => ({
      ...q,
      translation: showTranslation ? (DEMO_BUNDLE.translations[localeCode!]?.[q.id] ?? null) : null,
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
      randomQuestions: (count) => shuffled(DEMO_BUNDLE.questions, count).map(decorate),
      mockQuestions: () => {
        // Proportional sampling across topics, as the real exam does.
        const target = country.mockTest.questionCount;
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
  }, [countryCode, decorate]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
