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
  /** Whether XP has ever been paid out for this question. Once true, it
   *  stays true forever — otherwise replaying a lesson, quiz or weak-spots
   *  session over already-mastered questions would let XP (and achievements
   *  like "500 XP Club") be farmed without limit. */
  xpAwarded: boolean;
}

export interface MockAttempt {
  finishedAt: string;
  /**
   * Points scored, and points that were on offer. Where a country weights
   * its questions these are not answer counts: a Polish paper is 32
   * questions but 74 points, so `total` is 74 and `score` can jump by three
   * for a single answer. `perTopic` below still counts answers.
   */
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
  /**
   * Whether the learner has answered anything in this topic yet.
   *
   * This used to gate the topic: `index === 0 || previous topic complete`. That
   * is the right rule for a language course, where lesson 8 genuinely needs
   * lesson 7, and the wrong one for road rules — prohibition signs do not
   * depend on warning signs, and first aid depends on nothing at all. It also
   * contradicted the rest of the app, because the mock test has always drawn
   * from every topic regardless. Worst of all it hit the paying case hardest:
   * an exam in a week and a known weakness in priority rules, and the app
   * answers with a padlock on section eight.
   *
   * Nothing is locked now. The route is a recommended order, not a fence.
   */
  started: boolean;
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
  /** `xp` is what was actually paid out for this answer (0 if none — see
   *  xpAwarded). `newAchievements` covers achievements this single answer
   *  just unlocked — callers that answer questions outside a lesson/mock
   *  flow (Quick Quiz, Weak Spots) must surface these themselves, since
   *  nothing else will. */
  recordAnswer: (questionId: string, correct: boolean) => { xp: number; newAchievements: string[] };
  completeLesson: (topicId: string, sessionXp: number) => { xp: number; newAchievements: string[] };
  recordMockAttempt: (attempt: MockAttempt) => { newAchievements: string[] };
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const dayKey = (d: Date = new Date()) => d.toISOString().slice(0, 10);

/** Whether every lesson in a topic has been completed, per topicStats' own math. */
function isTopicComplete(s: ProgressState, topicId: string): boolean {
  const total = DEMO_BUNDLE.questions.filter((q) => q.topicId === topicId).length;
  if (total === 0) return false;
  const totalLessons = Math.max(1, Math.ceil(total / LESSON_SIZE));
  const completedLessons = Math.min(s.lessons[topicId] ?? 0, totalLessons);
  return completedLessons >= totalLessons;
}

const ACHIEVEMENTS: { id: string; test: (s: ProgressState) => boolean }[] = [
  { id: 'first-lesson', test: (s) => Object.values(s.lessons).reduce((a, b) => a + b, 0) >= 1 },
  { id: 'streak-5', test: (s) => s.streakDays >= 5 },
  { id: 'questions-100', test: (s) => Object.values(s.questions).filter((q) => q.mastered).length >= 100 },
  { id: 'mock-passed', test: (s) => s.mockAttempts.some((m) => m.passed) },
  { id: 'streak-14', test: (s) => s.streakDays >= 14 },
  { id: 'xp-500', test: (s) => s.totalXp >= 500 },
  { id: 'topic-master', test: (s) => DEMO_BUNDLE.topics.some((t) => isTopicComplete(s, t.id)) },
  { id: 'road-ready', test: (s) => DEMO_BUNDLE.topics.every((t) => isTopicComplete(s, t.id)) },
  { id: 'fifty-correct', test: (s) => Object.values(s.questions).reduce((a, q) => a + q.correct, 0) >= 50 },
  { id: 'mock-x3', test: (s) => s.mockAttempts.length >= 3 },
];

/**
 * Applies every not-yet-earned achievement whose condition now holds.
 *
 * Every mutator that can move a stat an achievement depends on — not just
 * completeLesson and recordMockAttempt — must call this, or an achievement
 * earned purely through Quick Quiz / Weak Spots (which only ever call
 * recordAnswer) would sit true forever without ever being detected, since
 * nothing else re-runs the check.
 */
function checkAchievements(next: ProgressState): { state: ProgressState; newAchievements: string[] } {
  const newAchievements = ACHIEVEMENTS.filter(
    (a) => !next.achievements.includes(a.id) && a.test(next),
  ).map((a) => a.id);
  if (!newAchievements.length) return { state: next, newAchievements };
  return { state: { ...next, achievements: [...next.achievements, ...newAchievements] }, newAchievements };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);
  // The single source of truth every mutator (recordAnswer, completeLesson,
  // recordMockAttempt) reads its `prev` from and writes its `next` back to,
  // instead of the setState updater form. They need to compose reliably when
  // called back-to-back in the same tick (e.g. useSubmitMock loops
  // recordAnswer many times then calls recordMockAttempt immediately) —
  // React's updater form doesn't guarantee it's run by the time the next
  // caller needs the result, and this effect alone is too late for that,
  // since it only fires after the commit that follows. It still matters as a
  // catch-all for state set outside these mutators, like the initial load()
  // below.
  const stateRef = React.useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    load<ProgressState>(KEYS.progress, EMPTY).then((s) => {
      const loaded = { ...EMPTY, ...s };
      stateRef.current = loaded;
      setState(loaded);
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: ProgressState) => {
    void save(KEYS.progress, next);
    return next;
  }, []);

  const recordAnswer = useCallback(
    (questionId: string, correct: boolean): { xp: number; newAchievements: string[] } => {
      // Reads/writes stateRef synchronously (not the setState updater form)
      // for the same reason as completeLesson/recordMockAttempt: callers like
      // useSubmitMock fire many recordAnswer calls in a tight loop followed
      // immediately by recordMockAttempt in the same tick. If recordAnswer
      // only queued a functional update, recordMockAttempt's own stateRef
      // read (via a useEffect that hasn't flushed yet) would still be
      // pre-loop and clobber all of it — mixing the two update styles is
      // exactly what caused that bug, so every mutator here has to agree on
      // one.
      const prev = stateRef.current;
      const existing = prev.questions[questionId] ?? {
        attempts: 0, correct: 0, streak: 0, mastered: false, inReview: false, lastAnsweredAt: '', xpAwarded: false,
      };
      const streak = correct ? existing.streak + 1 : 0;
      // XP for a question is paid out once, ever, the first time it is
      // answered correctly — never again after that, no matter how many
      // times it resurfaces in a lesson retry, a replayed lesson, a quiz, or
      // a weak-spots session. Without this, any of those replays would let
      // XP (and XP-based achievements) be farmed without limit.
      const xpEarned = correct && !existing.xpAwarded ? XP_PER_CORRECT : 0;
      const updated: QuestionProgress = {
        attempts: existing.attempts + 1,
        correct: existing.correct + (correct ? 1 : 0),
        streak,
        mastered: streak >= 2,
        inReview: correct ? (streak >= 2 ? false : existing.inReview) : true,
        lastAnsweredAt: new Date().toISOString(),
        xpAwarded: existing.xpAwarded || xpEarned > 0,
      };
      const next: ProgressState = {
        ...prev,
        totalXp: prev.totalXp + xpEarned,
        questions: { ...prev.questions, [questionId]: updated },
      };

      const { state: withAchievements, newAchievements } = checkAchievements(next);
      stateRef.current = withAchievements;
      setState(persist(withAchievements));
      return { xp: xpEarned, newAchievements };
    },
    [persist],
  );

  const completeLesson = useCallback(
    // `sessionXp` is the sum of what recordAnswer() actually paid out during
    // this lesson — not derived from the number of correct answers, since a
    // replayed or partly-already-mastered lesson can have correct answers
    // that pay zero XP (see recordAnswer's global xpAwarded dedup).
    (topicId: string, sessionXp: number) => {
      const xp = sessionXp;
      const prev = stateRef.current;
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

      const { state: withAchievements, newAchievements } = checkAchievements(next);
      stateRef.current = withAchievements;
      setState(persist(withAchievements));

      return { xp, newAchievements };
    },
    [persist],
  );

  const recordMockAttempt = useCallback(
    (attempt: MockAttempt) => {
      const prev = stateRef.current;
      const next = { ...prev, mockAttempts: [attempt, ...prev.mockAttempts].slice(0, 20) };
      const { state: withAchievements, newAchievements } = checkAchievements(next);
      stateRef.current = withAchievements;
      setState(persist(withAchievements));

      return { newAchievements };
    },
    [persist],
  );

  const reset = useCallback(() => {
    // Must clear stateRef too — every mutator reads its `prev` from there,
    // not from `state`. Skipping this let an in-flight recordAnswer/
    // completeLesson (e.g. from a lesson screen that hadn't unmounted yet)
    // read the stale pre-reset ref and write the "reset" progress right back.
    stateRef.current = EMPTY;
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
        started: completedLessons > 0 || topicAttempts > 0,
        completed: completedLessons >= totalLessons && total > 0,
        weakestSubtopic,
      };
    };

    const allStats = () => DEMO_BUNDLE.topics.map((t) => topicStats(t.id));
    const stats = allStats();
    // Deliberately no fallback to "any unlocked topic" here: topic 0 is
    // always unlocked, so that fallback silently returned it once every
    // topic was completed — Home then kept offering "Continue" into a
    // finished topic, landing on the lesson screen's dead-end "No lessons
    // left" state. `null` here means "genuinely nothing left to do", and
    // callers must render a completion state for it instead of guessing.
    const nextTopic = stats.find((s) => !s.completed) ?? null;

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
