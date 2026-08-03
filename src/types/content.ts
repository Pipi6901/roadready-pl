/**
 * Content model. Mirrors the Firestore schema in docs/02-architecture.md so the
 * demo bundle can be swapped for the licensed DVSA pack without code changes.
 *
 * Everything exam-specific (question count, time limit, pass mark, topics) is
 * DATA, never a constant — otherwise a second country cannot be added.
 */

export type CountryStatus = 'active' | 'coming_soon' | 'archived';
export type QuestionType = 'single_choice' | 'case_study' | 'hazard_video';

export interface MockTestConfig {
  questionCount: number;
  timeLimitMinutes: number;
  passMark: number;
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
