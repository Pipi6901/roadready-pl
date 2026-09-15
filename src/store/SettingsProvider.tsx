import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { LOCALES } from '@/data/demo-bundle';
import { deviceUiLocale, findUiLocale } from '@/features/i18n/locales';
import { cancelDailyReminder, hasNotificationPermission, scheduleDailyReminder } from '@/features/notifications/reminders';
import { KEYS, load, save } from './storage';

export interface Settings {
  onboarded: boolean;
  countryCode: string;
  /** null = "Polish only (no translation)" */
  localeCode: string | null;
  /**
   * The licence the learner is going for — 'B' for a car, 'A' for a
   * motorcycle, 'C' for a lorry… The exam paper has the same shape for every
   * category; what changes is which questions are in the hat, and this is
   * what picks them (see ContentProvider). Same codes as the catalogue.
   */
  licenceCategory: string;
  /**
   * Language of the app's own interface, which is a separate choice from the
   * translation shown under a question: someone sitting the exam in Polish may
   * still want the app in Ukrainian.
   *
   * null = follow the device. Stored as null rather than as the resolved code
   * so that changing the phone's language keeps working afterwards.
   */
  uiLocale: string | null;
  examDate: string | null;
  displayName: string;
  firstLaunchAt: string;
  dailyReminder: boolean;
  reminderTime: string;
  questionOfTheDay: boolean;
  autoReadQuestions: boolean;
  voiceSpeed: number;
  hapticsEnabled: boolean;
  /** Whether the "Tap anywhere to continue" splash has ever been dismissed.
   *  It's the app's routing gate (app/index.tsx also decides onboarding vs
   *  tabs there), so it can't just be skipped outright — but the tap
   *  itself should only be asked for once, on the very first launch. */
  hasSeenSplash: boolean;
}

const DEFAULTS: Settings = {
  onboarded: false,
  countryCode: 'PL',
  localeCode: null,
  licenceCategory: 'B',
  uiLocale: null,
  examDate: null,
  displayName: 'Learner',
  firstLaunchAt: new Date().toISOString(),
  // Defaults off, not on: nothing ever requests the OS notification
  // permission at first launch, so an "on" default here would show the
  // toggle as enabled while no reminder is actually scheduled until the user
  // visits Settings and flips it themselves (see onToggleDailyReminder,
  // which is the only place permission is requested).
  dailyReminder: false,
  reminderTime: '20:00',
  questionOfTheDay: true,
  autoReadQuestions: false,
  voiceSpeed: 1,
  hapticsEnabled: true,
  hasSeenSplash: false,
};

interface SettingsContextValue extends Settings {
  ready: boolean;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
  /** Convenience: is a translation language selected AND allowed. */
  translationEnabled: boolean;
  localeDirection: 'ltr' | 'rtl';
  localeName: string;
  /** Interface language actually in force, with the device fallback resolved. */
  uiLocaleCode: string;
  uiLocaleName: string;
  daysUntilExam: number | null;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);
  // Patches made before storage has been read. Persisting one of those
  // straight away would write DEFAULTS-plus-patch over whatever is stored:
  // a cold start that lands on the paywall and calls update({ onboarded })
  // used to erase the chosen translation language that way. They are held
  // here and folded into the loaded settings instead.
  const readyRef = useRef(false);
  const pendingRef = useRef<Partial<Settings>>({});

  useEffect(() => {
    load<Settings>(KEYS.settings, DEFAULTS).then((s) => {
      const next = { ...DEFAULTS, ...s, ...pendingRef.current };
      if (Object.keys(pendingRef.current).length) void save(KEYS.settings, next);
      pendingRef.current = {};
      readyRef.current = true;
      setSettings(next);
      setReady(true);
    });
  }, []);

  // Keeps the OS-scheduled notification in sync with the stored intent —
  // reruns on every relevant change, and once more on cold start in case the
  // schedule was lost (reinstall, OS notification-store reset). Only checks
  // the existing permission; never prompts here (see settings/index.tsx's
  // switch handler for the actual permission request).
  useEffect(() => {
    if (!ready) return;
    (async () => {
      if (!settings.dailyReminder) {
        await cancelDailyReminder();
        return;
      }
      if (await hasNotificationPermission()) {
        await scheduleDailyReminder(settings.reminderTime);
      }
    })();
  }, [ready, settings.dailyReminder, settings.reminderTime]);

  const update = useCallback((patch: Partial<Settings>) => {
    if (!readyRef.current) {
      pendingRef.current = { ...pendingRef.current, ...patch };
      setSettings((prev) => ({ ...prev, ...patch }));
      return;
    }
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void save(KEYS.settings, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = { ...DEFAULTS, firstLaunchAt: new Date().toISOString() };
    setSettings(fresh);
    void save(KEYS.settings, fresh);
  }, []);

  const value = useMemo<SettingsContextValue>(() => {
    const locale = LOCALES.find((l) => l.code === settings.localeCode) ?? null;
    const uiLocaleCode = settings.uiLocale ?? deviceUiLocale();
    let daysUntilExam: number | null = null;
    if (settings.examDate) {
      const diff = new Date(settings.examDate).getTime() - Date.now();
      daysUntilExam = Math.max(0, Math.ceil(diff / 86_400_000));
    }
    return {
      ...settings,
      ready,
      update,
      reset,
      translationEnabled: !!locale,
      localeDirection: locale?.direction ?? 'ltr',
      localeName: locale?.nameNative ?? 'Polish only',
      uiLocaleCode,
      uiLocaleName: findUiLocale(uiLocaleCode)?.nameNative ?? uiLocaleCode,
      daysUntilExam,
    };
  }, [settings, ready, update, reset]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
