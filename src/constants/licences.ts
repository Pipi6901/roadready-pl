import type { IconName } from '@/components/ui/Icon';

/**
 * Licence categories the Polish theory exam is sat for, in the order the
 * picker shows them. Codes are the ministry's, and the same ones the question
 * catalogue lists per question — the two must match byte for byte, because
 * `questionAppliesTo` compares them as strings.
 *
 * Grouping is by vehicle, not by the letter: a learner going for a lorry
 * licence looks for "trucks", not for the alphabet.
 *
 * The rare ones — B1, C1, D1, T and PT (the tram permit) — stay in the list
 * so a question's `licences` tags resolve and a learner who somehow has one
 * saved keeps a working app, but `hidden` keeps them off the picker: a dozen
 * rows for seven real choices buries the one nearly everyone wants.
 */
export type LicenceGroup = 'moto' | 'car' | 'truck' | 'bus' | 'other';

export interface LicenceCategory {
  code: string;
  group: LicenceGroup;
  icon: IconName;
  /** Minimum age, for the picker's one-line description. */
  minAge: number;
  /** Not offered on the picker; still a valid saved value. */
  hidden?: boolean;
}

export const LICENCE_CATEGORIES: LicenceCategory[] = [
  { code: 'AM', group: 'moto', icon: 'bike', minAge: 14 },
  { code: 'A1', group: 'moto', icon: 'bike', minAge: 16 },
  { code: 'A2', group: 'moto', icon: 'bike', minAge: 18 },
  { code: 'A', group: 'moto', icon: 'bike', minAge: 24 },
  { code: 'B1', group: 'car', icon: 'car-front', minAge: 16, hidden: true },
  { code: 'B', group: 'car', icon: 'car-front', minAge: 18 },
  { code: 'C1', group: 'truck', icon: 'truck', minAge: 18, hidden: true },
  { code: 'C', group: 'truck', icon: 'truck', minAge: 21 },
  { code: 'D1', group: 'bus', icon: 'bus', minAge: 21, hidden: true },
  { code: 'D', group: 'bus', icon: 'bus', minAge: 24 },
  { code: 'T', group: 'other', icon: 'tractor', minAge: 16, hidden: true },
  { code: 'PT', group: 'other', icon: 'tram-front', minAge: 21, hidden: true },
];

export const LICENCE_GROUPS: LicenceGroup[] = ['car', 'moto', 'truck', 'bus', 'other'];

/** What the picker offers, in group order. A saved hidden code is shown too, so it can be seen and changed. */
export function pickableLicences(current: string): LicenceCategory[] {
  return LICENCE_CATEGORIES.filter((l) => !l.hidden || l.code === current);
}

export const DEFAULT_LICENCE = 'B';

export function findLicence(code: string): LicenceCategory {
  return LICENCE_CATEGORIES.find((l) => l.code === code) ?? LICENCE_CATEGORIES.find((l) => l.code === DEFAULT_LICENCE)!;
}
