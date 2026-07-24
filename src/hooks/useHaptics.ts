import * as Haptics from 'expo-haptics';

import { useSettings } from '@/store/SettingsProvider';

/**
 * Every haptic in the app must go through here, never call `expo-haptics`
 * directly — this is the one place that respects the Settings > Feedback >
 * Vibration toggle. Calling the library straight from a screen would ignore
 * that toggle and buzz the phone even when the learner turned it off.
 */
export function useHaptics() {
  const { hapticsEnabled } = useSettings();

  return {
    correct: () => {
      if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    incorrect: () => {
      if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  };
}
