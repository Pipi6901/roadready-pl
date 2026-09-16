import type { Href } from 'expo-router';

/**
 * Where the app goes once the funnel is done: home, unless the learner has
 * never said which licence they are going for — then that question first.
 * Also catches everyone who installed before the step existed.
 */
export function afterOnboarding(licenceChosen: boolean): Href {
  return (licenceChosen ? '/(tabs)' : '/choose-licence') as Href;
}
