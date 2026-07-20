import type { MockAttempt } from '@/store/ProgressProvider';
import type { DisplayQuestion, MockTestConfig } from '@/types/content';

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
  /** questionId -> flagged for review */
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
}

const EMPTY: MockSessionState = {
  questions: [],
  answers: {},
  flagged: {},
  startedAt: 0,
  durationMs: 0,
  submitted: false,
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

  start(questions: DisplayQuestion[], timeLimitMinutes: number): void {
    commit({
      questions,
      answers: {},
      flagged: {},
      startedAt: Date.now(),
      durationMs: timeLimitMinutes * 60_000,
      submitted: false,
    });
  },

  answer(questionId: string, optionId: string): void {
    commit({ ...state, answers: { ...state.answers, [questionId]: optionId } });
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

/**
 * Pass mark for the number of questions actually served.
 *
 * The country config is the source of truth, but a content bundle can hold fewer
 * questions than a full exam (the demo pack does). Scaling keeps the bar
 * proportional instead of unreachable.
 */
export function requiredToPass(config: MockTestConfig, served: number): number {
  if (served >= config.questionCount) return config.passMark;
  return Math.max(1, Math.ceil((config.passMark / config.questionCount) * served));
}

export function scoreMockSession(s: MockSessionState, required: number): MockAttempt {
  const perTopic: Record<string, { correct: number; total: number }> = {};
  const wrongQuestionIds: string[] = [];
  let score = 0;

  for (const question of s.questions) {
    const chosen = s.answers[question.id];
    const correct = chosen === question.correctOptionId;
    const bucket = perTopic[question.topicId] ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (correct) {
      bucket.correct += 1;
      score += 1;
    } else {
      wrongQuestionIds.push(question.id);
    }
    perTopic[question.topicId] = bucket;
  }

  return {
    finishedAt: new Date().toISOString(),
    score,
    total: s.questions.length,
    passed: score >= required,
    perTopic,
    wrongQuestionIds,
  };
}
