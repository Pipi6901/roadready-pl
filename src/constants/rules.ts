/**
 * Product mechanics from docs/01-product-scope.md §4.
 *
 * NOTE: exam parameters (question count, time limit, pass mark) deliberately do
 * NOT live here — they are per-country DATA and come from the content bundle.
 * Putting 50/57/43 in code is exactly what makes a second country impossible.
 */

/** Questions per lesson. */
export const LESSON_SIZE = 10;

/** XP for a correct first attempt. */
export const XP_PER_CORRECT = 10;

/** Lessons per day required to keep the streak. */
export const DAILY_GOAL_LESSONS = 3;

/** Quick Quiz length. */
export const QUICK_QUIZ_SIZE = 10;

/**
 * What a learner without Pro can do (docs/06-monetization.md §3).
 *
 * Every gate in the app reads this one object through
 * SubscriptionProvider — `can(feature)` and `questionsLeftToday` — and every
 * piece of copy that describes the free plan (trial-ended comparison,
 * Settings → Subscription) is derived from it too, so switching presets is a
 * one-line change and nothing else falls out of date.
 */
export interface FreeTier {
  /** Lesson questions a free learner may answer per day; null = unlimited. */
  questionsPerDay: number | null;
  /** Translation under the question in the chosen language. */
  translation: boolean;
  mockTest: boolean;
  weakSpots: boolean;
  /** Downloading images and clips for offline use. */
  offline: boolean;
}

export const FREE_TIER_PRESETS = {
  /**
   * The model as originally specified: 10 questions a day, Polish only, and
   * everything beyond a lesson behind Pro. Kept intact so `launch` can be
   * reverted by pointing FREE_TIER back here.
   */
  original: { questionsPerDay: 10, translation: false, mockTest: false, weakSpots: false, offline: false },
  /**
   * Launch model (2026-09-21): lessons are free, unlimited and translated —
   * that is what gets a learner hooked. Pro is the exam layer: Mock Test and
   * Weak Spots.
   */
  launch: { questionsPerDay: null, translation: true, mockTest: false, weakSpots: false, offline: true },
} as const satisfies Record<string, FreeTier>;

export const FREE_TIER: FreeTier = FREE_TIER_PRESETS.launch;

export const ACHIEVEMENT_META: Record<string, { title: string; description: string; icon: string }> = {
  'first-lesson': {
    title: 'First Lesson',
    description: 'Complete your first lesson',
    icon: 'trophy',
  },
  'streak-5': {
    title: '5-Day Streak',
    description: 'Practise five days in a row',
    icon: 'flame',
  },
  'questions-100': {
    title: '100 Questions',
    description: 'Master 100 questions',
    icon: 'book-open-check',
  },
  'mock-passed': {
    title: 'Mock Passed',
    description: 'Pass a full mock test',
    icon: 'clipboard-check',
  },
  'streak-14': {
    title: 'Two-Week Streak',
    description: 'Practise fourteen days in a row',
    icon: 'crown',
  },
  'xp-500': {
    title: '500 XP Club',
    description: 'Earn 500 total XP',
    icon: 'gem',
  },
  'topic-master': {
    title: 'Topic Master',
    description: 'Finish every lesson in a topic',
    icon: 'list-checks',
  },
  'road-ready': {
    title: 'Road Ready',
    description: 'Finish every lesson in every topic',
    icon: 'car-front',
  },
  'fifty-correct': {
    title: 'Half Century',
    description: 'Answer 50 questions correctly',
    icon: 'check-check',
  },
  'mock-x3': {
    title: 'Mock Test Regular',
    description: 'Complete three mock tests',
    icon: 'timer',
  },
};

