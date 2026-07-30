import * as Notifications from 'expo-notifications';

/**
 * Local daily lesson reminder. No backend involved — this is a device-local
 * scheduled notification, not a push notification (nothing is sent from a
 * server). See docs/02-architecture.md's planned `services/notifications.ts`.
 */

const REMINDER_ID = 'daily-lesson-reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/** Prompts the OS permission dialog only if not already decided. */
export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

/** `time` is `"HH:MM"`. Replaces any previously scheduled reminder. */
export async function scheduleDailyReminder(time: string): Promise<void> {
  const [hour, minute] = time.split(':').map(Number);
  await cancelDailyReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: 'Time to practise',
      body: 'A few minutes today keeps your streak alive.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});
}
