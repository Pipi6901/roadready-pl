import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { LOCALES } from '@/data/demo-bundle';
import { KEYS, load, save } from './storage';

export interface Settings {
  onboarded: boolean;
  countryCode: string;
  /** null = "English only (no translation)" */
  localeCode: string | null;
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
  countryCode: 'GB',
  localeCode: null,
  examDate: null,
  displayName: 'Learner',
  firstLaunchAt: new Date().toISOString(),
  dailyReminder: true,
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
  daysUntilExam: number | null;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    load<Settings>(KEYS.settings, DEFAULTS).then((s) => {
      setSettings({ ...DEFAULTS, ...s });
      setReady(true);
    });
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
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
      localeName: locale?.nameNative ?? 'English only',
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
