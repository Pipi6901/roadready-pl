import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin persistence layer.
 *
 * Progress currently lives in AsyncStorage as JSON. The repository interface is
 * deliberately narrow so it can be swapped for expo-sqlite (see
 * docs/02-architecture.md §4) without touching a single screen.
 *
 * IMPORTANT: this data must stay inside the backed-up directory — with no
 * accounts (ADR-002) an iCloud/Android backup is the only way a user keeps
 * their progress when changing device. The 400 MB content pack is the opposite
 * case and gets excluded from backup.
 */

const PREFIX = 'roadready:';

export async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function save<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage failures must never crash a lesson in progress.
  }
}

export async function wipe(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(keys.filter((k) => k.startsWith(PREFIX)));
}

export const KEYS = {
  settings: 'settings',
  progress: 'progress',
  subscription: 'subscription',
  remoteContent: 'remote-content',
  revenuecatUserId: 'revenuecat-user-id',
  analyticsDeviceId: 'analytics-device-id',
} as const;
