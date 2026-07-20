import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { FREE_QUESTIONS_PER_DAY } from '@/constants/rules';
import { KEYS, load, save } from './storage';

export type Plan = 'monthly' | 'yearly';
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired';

export interface SubscriptionState {
  status: SubscriptionStatus;
  plan: Plan | null;
  trialStartedAt: string | null;
  renewsAt: string | null;
  /** ISO date -> questions answered that day, for the free tier cap. */
  dailyQuestionCount: Record<string, number>;
}

const EMPTY: SubscriptionState = {
  status: 'none',
  plan: null,
  trialStartedAt: null,
  renewsAt: null,
  dailyQuestionCount: {},
};

export type Feature = 'translation' | 'mock_test' | 'weak_spots' | 'hazard' | 'offline';

interface SubscriptionContextValue {
  ready: boolean;
  state: SubscriptionState;
  isPro: boolean;
  questionsLeftToday: number;
  can: (feature: Feature) => boolean;
  /**
   * Placeholder for the billing layer (Adapty, ADR-005). Kept behind this
   * interface on purpose: swapping the vendor must cost a day, not a week.
   */
  startTrial: (plan: Plan) => Promise<void>;
  restore: () => Promise<boolean>;
  cancel: () => void;
  countQuestion: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

const TRIAL_DAYS = 3;
const dayKey = () => new Date().toISOString().slice(0, 10);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    load<SubscriptionState>(KEYS.subscription, EMPTY).then((s) => {
      const merged = { ...EMPTY, ...s };
      // Expire the trial locally; the real check happens in the billing SDK.
      if (merged.status === 'trial' && merged.trialStartedAt) {
        const elapsed = Date.now() - new Date(merged.trialStartedAt).getTime();
        if (elapsed > TRIAL_DAYS * 86_400_000) merged.status = 'expired';
      }
      setState(merged);
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: SubscriptionState) => {
    void save(KEYS.subscription, next);
    return next;
  }, []);

  const startTrial = useCallback(
    async (plan: Plan) => {
      setState((prev) =>
        persist({
          ...prev,
          status: 'trial',
          plan,
          trialStartedAt: new Date().toISOString(),
          renewsAt: new Date(Date.now() + TRIAL_DAYS * 86_400_000).toISOString(),
        }),
      );
    },
    [persist],
  );

  const restore = useCallback(async () => {
    // Real implementation asks the billing SDK; with no accounts this is the
    // only way a reinstalled app gets its subscription back (ADR-002).
    return false;
  }, []);

  const cancel = useCallback(() => {
    setState((prev) => persist({ ...prev, status: 'expired' }));
  }, [persist]);

  const countQuestion = useCallback(() => {
    setState((prev) => {
      const key = dayKey();
      return persist({
        ...prev,
        dailyQuestionCount: { ...prev.dailyQuestionCount, [key]: (prev.dailyQuestionCount[key] ?? 0) + 1 },
      });
    });
  }, [persist]);

  const value = useMemo<SubscriptionContextValue>(() => {
    const isPro = state.status === 'trial' || state.status === 'active';
    const usedToday = state.dailyQuestionCount[dayKey()] ?? 0;
    return {
      ready,
      state,
      isPro,
      questionsLeftToday: isPro ? Infinity : Math.max(0, FREE_QUESTIONS_PER_DAY - usedToday),
      can: (feature) => {
        if (isPro) return feature !== 'hazard' || HAZARD_ENABLED;
        return false;
      },
      startTrial,
      restore,
      cancel,
      countQuestion,
    };
  }, [state, ready, startTrial, restore, cancel, countQuestion]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

/**
 * Hazard Perception ships behind a flag (ADR-006): the clips are part of the
 * DVSA licence pack we do not have yet. Promising a paid feature that cannot be
 * used is a straight path to an App Review rejection.
 */
export const HAZARD_ENABLED = false;

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}
