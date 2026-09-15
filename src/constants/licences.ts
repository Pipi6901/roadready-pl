import type { IconName } from '@/components/ui/Icon';

/**
 * Licence categories the Polish theory exam is sat for, in the order the
 * picker shows them. Codes are the ministry's, and the same ones the question
 * catalogue lists per question — the two must match byte for byte, because
 * `questionAppliesTo` compares them as strings.
 *
 * Grouping is by vehicle, not by the letter: a learner going for a lorry
 * licence looks for "trucks", not for the alphabet. PT is the tram permit —
 * not a driving licence category strictly speaking, but the exam draws on the
 * same catalogue and 438 questions in it exist for nothing else.
 */
export type LicenceGroup = 'moto' | 'car' | 'truck' | 'bus' | 'other';

export interface LicenceCategory {
  code: string;
  group: LicenceGroup;
  icon: IconName;
  /** Minimum age, for the picker's one-line description. */
  minAge: number;
}

export const LICENCE_CATEGORIES: LicenceCategory[] = [
  { code: 'AM', group: 'moto', icon: 'bike', minAge: 14 },
  { code: 'A1', group: 'moto', icon: 'bike', minAge: 16 },
  { code: 'A2', group: 'moto', icon: 'bike', minAge: 18 },
  { code: 'A', group: 'moto', icon: 'bike', minAge: 24 },
  { code: 'B1', group: 'car', icon: 'car-front', minAge: 16 },
  { code: 'B', group: 'car', icon: 'car-front', minAge: 18 },
  { code: 'C1', group: 'truck', icon: 'truck', minAge: 18 },
  { code: 'C', group: 'truck', icon: 'truck', minAge: 21 },
  { code: 'D1', group: 'bus', icon: 'bus', minAge: 21 },
  { code: 'D', group: 'bus', icon: 'bus', minAge: 24 },
  { code: 'T', group: 'other', icon: 'tractor', minAge: 16 },
  { code: 'PT', group: 'other', icon: 'tram-front', minAge: 21 },
];

export const LICENCE_GROUPS: LicenceGroup[] = ['car', 'moto', 'truck', 'bus', 'other'];

export const DEFAULT_LICENCE = 'B';

export function findLicence(code: string): LicenceCategory {
  return LICENCE_CATEGORIES.find((l) => l.code === code) ?? LICENCE_CATEGORIES.find((l) => l.code === DEFAULT_LICENCE)!;
}
