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

/** Free tier limits (docs/06-monetization.md §3). */
export const FREE_QUESTIONS_PER_DAY = 10;

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

/**
 * BCP-47 tag handed to the speech engine for question text. Questions are in
 * the language of the exam, whatever the interface is set to — reading Polish
 * with an English voice produced something no learner would recognise.
 */
export const QUESTION_SPEECH_LANGUAGE = 'pl-PL';
