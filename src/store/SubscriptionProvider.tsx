import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Purchases, { type CustomerInfo, type CustomerInfoUpdateListener } from 'react-native-purchases';

import { ENTITLEMENT_ID, PRODUCT_IDS, REVENUECAT_API_KEY } from '@/constants/billing';
import { HAZARD_ENABLED as HAZARD_FLAG, PAYWALL_ENABLED } from '@/constants/flags';
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
  /** Re-checks the store for existing purchases (ADR-002: no accounts, this
   *  is the only recovery path after a reinstall). */
  restore: () => Promise<boolean>;
  countQuestion: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

const skuToPlan = (sku: string): Plan | null =>
  sku === PRODUCT_IDS.monthly ? 'monthly' : sku === PRODUCT_IDS.yearly ? 'yearly' : null;

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(EMPTY);
  const [ready, setReady] = useState(false);

  const persist = useCallback((next: SubscriptionState) => {
    void save(KEYS.subscription, next);
    return next;
  }, []);

  /** Derives our local state from RevenueCat's CustomerInfo. Returns whether
   *  the `pro` entitlement is currently active. */
  const applyCustomerInfo = useCallback(
    (info: CustomerInfo) => {
      const ent = info.entitlements.active[ENTITLEMENT_ID];
      setState((prev) =>
        persist(
          ent
            ? {
                ...prev,
                status: ent.periodType === 'TRIAL' ? 'trial' : 'active',
                plan: skuToPlan(ent.productIdentifier) ?? prev.plan,
                renewsAt: ent.expirationDate,
              }
            : { ...prev, status: prev.status === 'none' ? 'none' : 'expired' },
        ),
      );
      return !!ent;
    },
    [persist],
  );

  useEffect(() => {
    let cancelled = false;

    load<SubscriptionState>(KEYS.subscription, EMPTY).then((s) => {
      if (!cancelled) setState({ ...EMPTY, ...s });
    });

    // Safe to call from every screen that mounts this provider — the SDK
    // no-ops on a repeat configure() with the same key.
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });

    const listener: CustomerInfoUpdateListener = (info) => applyCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(listener);

    Purchases.getCustomerInfo()
      .then(applyCustomerInfo)
      .catch(() => {
        // Offline on first launch, or the store account isn't signed in — keep
        // whatever was cached locally.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [applyCustomerInfo]);

  const restore = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      return applyCustomerInfo(info);
    } catch {
      return false;
    }
  }, [applyCustomerInfo]);

  const countQuestion = useCallback(() => {
    const dayKey = new Date().toISOString().slice(0, 10);
    setState((prev) =>
      persist({
        ...prev,
        dailyQuestionCount: { ...prev.dailyQuestionCount, [dayKey]: (prev.dailyQuestionCount[dayKey] ?? 0) + 1 },
      }),
    );
  }, [persist]);

  const value = useMemo<SubscriptionContextValue>(() => {
    const isPro = state.status === 'trial' || state.status === 'active';
    const dayKey = new Date().toISOString().slice(0, 10);
    const usedToday = state.dailyQuestionCount[dayKey] ?? 0;

    // With the paywall switched off there is no way to buy anything, so gating
    // features would just break the app. Everything is unlocked until the
    // RevenueCat project and store products exist — see src/constants/flags.ts.
    const unlocked = !PAYWALL_ENABLED || isPro;

    return {
      ready,
      state,
      isPro,
      questionsLeftToday: unlocked ? Infinity : Math.max(0, FREE_QUESTIONS_PER_DAY - usedToday),
      can: (feature) => {
        if (unlocked) return feature !== 'hazard' || HAZARD_ENABLED;
        return false;
      },
      restore,
      countQuestion,
    };
  }, [state, ready, restore, countQuestion]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

/**
 * Hazard Perception ships behind a flag (ADR-006): the clips are part of the
 * DVSA licence pack we do not have yet. Promising a paid feature that cannot be
 * used is a straight path to an App Review rejection.
 *
 * Re-exported from the flag module so existing imports keep working.
 */
export const HAZARD_ENABLED = HAZARD_FLAG;

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}
