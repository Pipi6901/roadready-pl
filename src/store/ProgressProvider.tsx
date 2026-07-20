import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEMO_BUNDLE } from '@/data/demo-bundle';
import { LESSON_SIZE, XP_PER_CORRECT, DAILY_GOAL_LESSONS } from '@/constants/rules';
import { KEYS, load, save } from './storage';

export interface QuestionProgress {
  attempts: number;
  correct: number;
  /** Two correct answers in a row => mastered (docs/01-product-scope.md §4). */
  streak: number;
  mastered: boolean;
  inReview: boolean;
  lastAnsweredAt: string;
}

export interface MockAttempt {
  finishedAt: string;
  score: number;
  total: number;
  passed: boolean;
  perTopic: Record<string, { correct: number; total: number }>;
  wrongQuestionIds: string[];
}

export interface ProgressState {
  totalXp: number;
  streakDays: number;
  streakLastDate: string | null;
  questions: Record<string, QuestionProgress>;
  /** topicId -> number of completed lessons */
  lessons: Record<string, number>;
  /** ISO date -> lessons completed that day */
  daily: Record<string, { lessons: number; xp: number }>;
  mockAttempts: MockAttempt[];
  achievements: string[];
}

const EMPTY: ProgressState = {
  totalXp: 0,
  streakDays: 0,
  streakLastDate: null,
  questions: {},
  lessons: {},
  daily: {},
  mockAttempts: [],
  achievements: [],
};

export interface TopicStats {
  topicId: string;
  mastered: number;
  total: number;
  accuracy: number;
  completedLessons: number;
  totalLessons: number;
  unlocked: boolean;
  completed: boolean;
  weakestSubtopic: string | null;
}

interface ProgressContextValue {
  ready: boolean;
  state: ProgressState;
  todayKey: string;
  lessonsToday: number;
  xpToday: number;
  goalMet: boolean;
  masteredCount: number;
  accuracy: number;
  readiness: number;
  reviewQueue: string[];
  topicStats: (topicId: string) => TopicStats;
  allTopicStats: () => TopicStats[];
  nextTopicId: string | null;
  recordAnswer: (questionId: string, correct: boolean) => void;
  completeLesson: (topicId: string, correctCount: number) => { xp: number; newAchievements: string[] };
  recordMockAttempt: (attempt: MockAttempt) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const dayKey = (d: Date = new Date()) => d.toISOString().slice(0, 10);

const ACHIEVEMENTS: { id: string; test: (s: ProgressState) => boolean }[] = [
  { id: 'first-lesson', test: (s) => Object.values(s.lessons).reduce((a, b) => a + b, 0) >= 1 },
  { id: 'streak-5', test: (s) => s.streakDays >= 5 },
  { id: 'questions-100', test: (s) => Object.values(s.questions).filter((q) => q.mastered).length >= 100 },
  { id: 'mock-passed', test: (s) => s.mockAttempts.some((m) => m.passed) },
];

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    load<ProgressState>(KEYS.progress, EMPTY).then((s) => {
      setState({ ...EMPTY, ...s });
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: ProgressState) => {
    void save(KEYS.progress, next);
    return next;
  }, []);

  const recordAnswer = useCallback(
    (questionId: string, correct: boolean) => {
      setState((prev) => {
        const existing = prev.questions[questionId] ?? {
          attempts: 0, correct: 0, streak: 0, mastered: false, inReview: false, lastAnsweredAt: '',
        };
        const streak = correct ? existing.streak + 1 : 0;
        const updated: QuestionProgress = {
          attempts: existing.attempts + 1,
          correct: existing.correct + (correct ? 1 : 0),
          streak,
          mastered: streak >= 2,
          inReview: correct ? (streak >= 2 ? false : existing.inReview) : true,
          lastAnsweredAt: new Date().toISOString(),
        };
        return persist({
          ...prev,
          totalXp: prev.totalXp + (correct ? XP_PER_CORRECT : 0),
          questions: { ...prev.questions, [questionId]: updated },
        });
      });
    },
    [persist],
  );

  const completeLesson = useCallback(
    (topicId: string, correctCount: number) => {
      const xp = correctCount * XP_PER_CORRECT;
      const newAchievements: string[] = [];

      setState((prev) => {
        const today = dayKey();
        const yesterday = dayKey(new Date(Date.now() - 86_400_000));
        const todayEntry = prev.daily[today] ?? { lessons: 0, xp: 0 };

        // Streak advances the first time the daily goal is met.
        const lessonsToday = todayEntry.lessons + 1;
        let streakDays = prev.streakDays;
        let streakLastDate = prev.streakLastDate;
        if (lessonsToday >= DAILY_GOAL_LESSONS && streakLastDate !== today) {
          streakDays = streakLastDate === yesterday ? streakDays + 1 : 1;
          streakLastDate = today;
        }

        const next: ProgressState = {
          ...prev,
          totalXp: prev.totalXp,
          streakDays,
          streakLastDate,
          lessons: { ...prev.lessons, [topicId]: (prev.lessons[topicId] ?? 0) + 1 },
          daily: { ...prev.daily, [today]: { lessons: lessonsToday, xp: todayEntry.xp + xp } },
        };

        for (const a of ACHIEVEMENTS) {
          if (!next.achievements.includes(a.id) && a.test(next)) newAchievements.push(a.id);
        }
        next.achievements = [...next.achievements, ...newAchievements];

        return persist(next);
      });

      return { xp, newAchievements };
    },
    [persist],
  );

  const recordMockAttempt = useCallback(
    (attempt: MockAttempt) => {
      setState((prev) => {
        const next = { ...prev, mockAttempts: [attempt, ...prev.mockAttempts].slice(0, 20) };
        const gained = ACHIEVEMENTS.filter((a) => !next.achievements.includes(a.id) && a.test(next)).map((a) => a.id);
        next.achievements = [...next.achievements, ...gained];
        return persist(next);
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setState(persist(EMPTY));
  }, [persist]);

  const value = useMemo<ProgressContextValue>(() => {
    const today = dayKey();
    const todayEntry = state.daily[today] ?? { lessons: 0, xp: 0 };
    const questionEntries = Object.values(state.questions);
    const attempts = questionEntries.reduce((a, q) => a + q.attempts, 0);
    const corrects = questionEntries.reduce((a, q) => a + q.correct, 0);
    const masteredCount = questionEntries.filter((q) => q.mastered).length;

    const topicStats = (topicId: string): TopicStats => {
      const topic = DEMO_BUNDLE.topics.find((t) => t.id === topicId);
      const questions = DEMO_BUNDLE.questions.filter((q) => q.topicId === topicId);
      const total = questions.length;
      const mastered = questions.filter((q) => state.questions[q.id]?.mastered).length;
      const answered = questions.filter((q) => state.questions[q.id]);
      const topicAttempts = answered.reduce((a, q) => a + (state.questions[q.id]?.attempts ?? 0), 0);
      const topicCorrect = answered.reduce((a, q) => a + (state.questions[q.id]?.correct ?? 0), 0);
      const totalLessons = Math.max(1, Math.ceil(total / LESSON_SIZE));
      const completedLessons = Math.min(state.lessons[topicId] ?? 0, totalLessons);

      // Sequential unlock: a topic opens once the previous one is finished.
      const index = DEMO_BUNDLE.topics.findIndex((t) => t.id === topicId);
      const prevTopic = index > 0 ? DEMO_BUNDLE.topics[index - 1] : null;
      const prevDone = prevTopic
        ? (state.lessons[prevTopic.id] ?? 0) >= Math.ceil(
            DEMO_BUNDLE.questions.filter((q) => q.topicId === prevTopic.id).length / LESSON_SIZE,
          )
        : true;

      // Weakest subtopic = highest error rate among answered questions.
      const bySubtopic = new Map<string, { attempts: number; wrong: number }>();
      for (const q of questions) {
        const p = state.questions[q.id];
        if (!p || !q.subtopic) continue;
        const entry = bySubtopic.get(q.subtopic) ?? { attempts: 0, wrong: 0 };
        entry.attempts += p.attempts;
        entry.wrong += p.attempts - p.correct;
        bySubtopic.set(q.subtopic, entry);
      }
      let weakestSubtopic: string | null = null;
      let worstRate = 0;
      bySubtopic.forEach((v, k) => {
        const rate = v.attempts ? v.wrong / v.attempts : 0;
        if (rate > worstRate) {
          worstRate = rate;
          weakestSubtopic = k;
        }
      });

      return {
        topicId,
        mastered,
        total,
        accuracy: topicAttempts ? Math.round((topicCorrect / topicAttempts) * 100) : 0,
        completedLessons,
        totalLessons,
        unlocked: index === 0 || prevDone,
        completed: completedLessons >= totalLessons && total > 0,
        weakestSubtopic,
      };
    };

    const allStats = () => DEMO_BUNDLE.topics.map((t) => topicStats(t.id));
    const stats = allStats();
    const nextTopic = stats.find((s) => s.unlocked && !s.completed) ?? stats.find((s) => s.unlocked) ?? null;

    return {
      ready,
      state,
      todayKey: today,
      lessonsToday: todayEntry.lessons,
      xpToday: todayEntry.xp,
      goalMet: todayEntry.lessons >= DAILY_GOAL_LESSONS,
      masteredCount,
      accuracy: attempts ? Math.round((corrects / attempts) * 100) : 0,
      readiness: DEMO_BUNDLE.questions.length
        ? Math.round((masteredCount / DEMO_BUNDLE.questions.length) * 100)
        : 0,
      reviewQueue: Object.entries(state.questions)
        .filter(([, p]) => p.inReview)
        .sort((a, b) => b[1].attempts - b[1].correct - (a[1].attempts - a[1].correct))
        .map(([id]) => id),
      topicStats,
      allTopicStats: allStats,
      nextTopicId: nextTopic?.topicId ?? null,
      recordAnswer,
      completeLesson,
      recordMockAttempt,
      reset,
    };
  }, [state, ready, recordAnswer, completeLesson, recordMockAttempt, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
