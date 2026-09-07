/**
 * Content model. Mirrors the Firestore schema in docs/02-architecture.md so the
 * demo bundle can be swapped for the licensed DVSA pack without code changes.
 *
 * Everything exam-specific (question count, time limit, pass mark, topics) is
 * DATA, never a constant — otherwise a second country cannot be added.
 */

export type CountryStatus = 'active' | 'coming_soon' | 'archived';
export type QuestionType = 'single_choice' | 'case_study' | 'hazard_video';

/**
 * Polish exam question classes. The British exam has one class, so a bundle
 * that omits this everywhere behaves exactly as before (see QUESTION_DEFAULTS).
 *
 * `basic` — 20 of the 32 questions, answered TAK/NIE.
 * `specialist` — the other 12, three lettered options.
 */
export type QuestionCategory = 'basic' | 'specialist';

/** Per-question clock, in seconds. */
export interface QuestionTiming {
  /** Reading time before answering opens. 0 = answering is open immediately. */
  readSeconds: number;
  /** Answering time once reading ends. */
  answerSeconds: number;
}

export interface MockTestConfig {
  questionCount: number;
  timeLimitMinutes: number;
  /**
   * The bar to clear, in the same unit as a scored attempt: points where the
   * country weights its questions, plain correct answers where it does not.
   * UK 43 of 50 answers; Poland 68 of 74 points.
   */
  passMark: number;
  /**
   * Total points on offer. Absent where every question is worth one, in which
   * case the maximum is just the number of questions.
   */
  maxPoints?: number;
  /**
   * Per-question time limits by class. Absent = the country only caps the
   * whole paper (UK), which is what `timeLimitMinutes` already does.
   */
  timing?: Record<QuestionCategory, QuestionTiming>;
  /**
   * How many questions of each class make up a paper — Poland fixes 20 basic
   * and 12 specialist. Absent = one class, sample the bank freely.
   */
  composition?: Record<QuestionCategory, number>;
  /**
   * How many questions of each weight go into each class of the paper, keyed by
   * points as a string. Poland fixes both grids by regulation:
   *
   *   basic       10 x 3pt + 6 x 2pt + 4 x 1pt = 46
   *   specialist   6 x 3pt + 4 x 2pt + 2 x 1pt = 28   -> 74 in total
   *
   * Without this a paper sampled at random would not add up to `maxPoints`, and
   * a pass mark expressed in points would mean nothing. Absent = weights are not
   * fixed, sample the class freely.
   */
  weights?: Record<QuestionCategory, Record<string, number>>;
  /**
   * Whether answered questions can be revisited before submitting. Poland
   * forbids it, which removes the review screen and the Previous button —
   * not as a design preference but because the exam has no such step.
   */
  allowReview: boolean;
}

export interface Country {
  code: string;
  name: string;
  flagEmoji: string;
  authority: string;
  legalNotice: string;
  status: CountryStatus;
  questionCount: number;
  mockTest: MockTestConfig;
  currency: string;
}

export interface Locale {
  code: string;
  nameNative: string;
  nameEnglish: string;
  direction: 'ltr' | 'rtl';
  flagEmoji: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  questionCount: number;
  /**
   * Which class of question this topic holds.
   *
   * Poland splits its bank into 16 basic sections and 6 specialist ones, and the
   * two are not interchangeable: a basic topic is answered TAK/NIE and carries
   * general road-safety knowledge, a specialist one has three lettered options
   * and covers what is specific to the licence category. Listing all 22 as one
   * flat menu hides the thing the candidate most needs to know — which half of
   * the paper they are weak in.
   *
   * Optional so a single-class bank (the British one) stays valid.
   */
  category?: QuestionCategory;
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topicId: string;
  type: QuestionType;
  text: string;
  options: AnswerOption[];
  correctOptionId: string;
  explanation: string;
  mediaId: string | null;
  subtopic: string | null;
  sourceRef: string;
  /**
   * Polish exam class. Optional so a single-class bank (the UK one, and the
   * demo bundle) stays valid without stamping a made-up value onto every
   * question. Read it through `questionCategory`, never directly.
   */
  category?: QuestionCategory;
  /**
   * What the question is worth: 1, 2 or 3 in Poland, 1 everywhere else.
   * Optional for the same reason as `category`; read it through
   * `questionPoints`.
   */
  points?: number;
}

/** Fallbacks for bundles from countries that do not classify or weight questions. */
export function questionCategory(question: Pick<Question, 'category'>): QuestionCategory {
  return question.category ?? 'basic';
}

export function questionPoints(question: Pick<Question, 'points'>): number {
  return question.points ?? 1;
}

/** A media asset referenced by a question's mediaId, keyed by id in ContentBundle.media. */
export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  width: number | null;
  height: number | null;
  durationMs: number | null;
}

export interface QuestionTranslation {
  text: string;
  options: Record<string, string>;
  explanation: string;
}

/** locale code -> question id -> translation */
export type TranslationBundle = Record<string, Record<string, QuestionTranslation>>;

export interface ContentBundle {
  country: Country;
  topics: Topic[];
  questions: Question[];
  translations: TranslationBundle;
  /** mediaId -> asset, only for media actually referenced by a published question. */
  media: Record<string, MediaAsset>;
  versionHash: string;
}

/** A question resolved for display: English plus optional translation and media. */
export interface DisplayQuestion extends Question {
  translation: QuestionTranslation | null;
  media: MediaAsset | null;
}
