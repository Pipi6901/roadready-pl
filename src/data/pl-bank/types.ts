/**
 * One question's translation, in the short form the bank files are written in.
 *
 * `t` is the question text, `e` the explanation. `o` holds the three lettered
 * options of a specialist question; basic questions omit it, because TAK/NIE
 * translate the same way for every question in a language (see YES_NO in
 * index.ts) and writing "Yes"/"No" a hundred times over would only invite a typo.
 */
export interface BankTranslation {
  t: string;
  e: string;
  o?: [string, string, string];
}
