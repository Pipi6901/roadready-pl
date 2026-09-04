import type { MockAttempt } from '@/store/ProgressProvider';
import {
  questionCategory,
  questionPoints,
  type DisplayQuestion,
  type MockTestConfig,
} from '@/types/content';

/**
 * In-memory mock-test session.
 *
 * The mock flow spans four screens (setup -> run -> review -> results) that are
 * separate router entries, so answers cannot live in one screen's state. This is
 * a plain module singleton: it survives navigation inside the flow and dies with
 * the process, which is exactly the lifetime a mock attempt should have — a
 * half-finished exam is not something we want to restore days later.
 */

export interface MockSessionState {
  questions: DisplayQuestion[];
  /** questionId -> chosen option id */
  answers: Record<string, string>;
  /** questionId -> flagged for review. Unused where the exam forbids revisiting. */
  flagged: Record<string, boolean>;
  /**
   * Absolute epoch ms of the start. The countdown is always derived from this,
   * never decremented per tick — a decrementing timer stops while the app is
   * backgrounded and hands the user free time.
   */
  startedAt: number;
  durationMs: number;
  /** Set once the attempt has been scored, so a late timeout cannot score twice. */
  submitted: boolean;
  /**
   * Which question is on screen. This lives in the session rather than in the
   * run screen's state because the per-question clock advances it on its own,
   * and because a one-way exam has no other authority on where the candidate is.
   */
  index: number;
  /**
   * Absolute epoch ms the current question was first shown, for the same reason
   * `startedAt` is absolute. Zero where the country sets no per-question limit.
   */
  questionStartedAt: number;
  /** Copied from the country config at start so scoring never re-reads content. */
  timing: MockTestConfig['timing'];
  allowReview: boolean;
}

const EMPTY: MockSessionState = {
  questions: [],
  answers: {},
  flagged: {},
  startedAt: 0,
  durationMs: 0,
  submitted: false,
  index: 0,
  questionStartedAt: 0,
  timing: undefined,
  allowReview: true,
};

let state: MockSessionState = EMPTY;
const listeners = new Set<() => void>();

function commit(next: MockSessionState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

export const mockSession = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getState(): MockSessionState {
    return state;
  },

  start(questions: DisplayQuestion[], config: MockTestConfig): void {
    const now = Date.now();
    commit({
      questions,
      answers: {},
      flagged: {},
      startedAt: now,
      durationMs: config.timeLimitMinutes * 60_000,
      submitted: false,
      index: 0,
      questionStartedAt: config.timing ? now : 0,
      timing: config.timing,
      allowReview: config.allowReview,
    });
  },

  answer(questionId: string, optionId: string): void {
    commit({ ...state, answers: { ...state.answers, [questionId]: optionId } });
  },

  /**
   * Move to a question and restart its clock.
   *
   * Backwards moves are refused outright where the exam forbids them, rather
   * than merely hidden in the UI: the auto-advance timer and the Next button
   * both come through here, and a one-way rule that only lives in a disabled
   * button is one refactor away from not existing.
   */
  goTo(index: number): void {
    if (index === state.index) return;
    if (!state.allowReview && index < state.index) return;
    const clamped = Math.max(0, Math.min(index, state.questions.length - 1));
    commit({
      ...state,
      index: clamped,
      questionStartedAt: state.timing ? Date.now() : 0,
    });
  },

  toggleFlag(questionId: string): void {
    commit({ ...state, flagged: { ...state.flagged, [questionId]: !state.flagged[questionId] } });
  },

  /** Guards against a double submit (timeout firing while the user taps Submit). */
  claimSubmit(): boolean {
    if (state.submitted) return false;
    commit({ ...state, submitted: true });
    return true;
  },

  /** Position of a question in the finished attempt, or -1 if unknown. */
  indexOf(questionId: string): number {
    return state.questions.findIndex((q) => q.id === questionId);
  },

  reset(): void {
    commit(EMPTY);
  },
};

/** Milliseconds left, clamped at zero. */
export function remainingMs(s: MockSessionState, now: number = Date.now()): number {
  if (!s.startedAt) return 0;
  return Math.max(0, s.startedAt + s.durationMs - now);
}

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/* -------------------------------------------------------------------------- */
/* Per-question clock                                                          */
/* -------------------------------------------------------------------------- */

export type QuestionPhase = 'reading' | 'answering' | 'expired';

export interface QuestionClock {
  phase: QuestionPhase;
  /** Seconds left in the current phase, rounded up so the last second shows as 1. */
  secondsLeft: number;
  /** Total seconds in the current phase, for a progress bar. */
  phaseSeconds: number;
}

/**
 * Where the current question stands against its own clock.
 *
 * Poland times each question rather than the paper: a basic question gives 20
 * seconds to read and 15 to answer, a specialist one 50 seconds outright.
 * Returns null for countries that only cap the whole paper, which is what makes
 * this safe to call unconditionally from the run screen.
 */
export function questionClock(s: MockSessionState, now: number = Date.now()): QuestionClock | null {
  if (!s.timing || !s.questionStartedAt) return null;
  const question = s.questions[s.index];
  if (!question) return null;

  const { readSeconds, answerSeconds } = s.timing[questionCategory(question)];
  const elapsed = (now - s.questionStartedAt) / 1000;

  if (elapsed < readSeconds) {
    return { phase: 'reading', secondsLeft: Math.ceil(readSeconds - elapsed), phaseSeconds: readSeconds };
  }
  const intoAnswer = elapsed - readSeconds;
  if (intoAnswer < answerSeconds) {
    return {
      phase: 'answering',
      secondsLeft: Math.ceil(answerSeconds - intoAnswer),
      phaseSeconds: answerSeconds,
    };
  }
  return { phase: 'expired', secondsLeft: 0, phaseSeconds: answerSeconds };
}

/* -------------------------------------------------------------------------- */
/* Scoring                                                                     */
/* -------------------------------------------------------------------------- */

/** Points on offer across the questions actually served. */
export function pointsServed(questions: Pick<DisplayQuestion, 'points'>[]): number {
  return questions.reduce((sum, q) => sum + questionPoints(q), 0);
}

/**
 * Pass mark for the points actually served.
 *
 * The country config is the source of truth, but a content bundle can hold fewer
 * questions than a full exam (the demo pack does). Scaling keeps the bar
 * proportional instead of unreachable.
 *
 * `served` is counted in points, matching what `scoreMockSession` returns: in
 * Poland a question is worth 1, 2 or 3, so 68 of 74 points is not 68 of 74
 * answers and the two must not be compared.
 */
export function requiredToPass(config: MockTestConfig, served: number): number {
  const full = config.maxPoints ?? config.questionCount;
  if (served >= full) return config.passMark;
  return Math.max(1, Math.ceil((config.passMark / full) * served));
}

export function scoreMockSession(s: MockSessionState, required: number): MockAttempt {
  const perTopic: Record<string, { correct: number; total: number }> = {};
  const wrongQuestionIds: string[] = [];
  let score = 0;
  let total = 0;

  for (const question of s.questions) {
    const chosen = s.answers[question.id];
    const correct = chosen === question.correctOptionId;
    const points = questionPoints(question);
    // perTopic stays a count of answers, not points: it drives "your weakest
    // topics", where three easy misses matter more than one hard one.
    const bucket = perTopic[question.topicId] ?? { correct: 0, total: 0 };
    bucket.total += 1;
    total += points;
    if (correct) {
      bucket.correct += 1;
      score += points;
    } else {
      wrongQuestionIds.push(question.id);
    }
    perTopic[question.topicId] = bucket;
  }

  return {
    finishedAt: new Date().toISOString(),
    score,
    total,
    passed: score >= required,
    perTopic,
    wrongQuestionIds,
  };
}
