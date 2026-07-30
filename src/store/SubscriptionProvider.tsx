import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  endConnection,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  type Purchase,
} from 'react-native-iap';

import { HAZARD_ENABLED as HAZARD_FLAG, PAYWALL_ENABLED } from '@/constants/flags';
import { FREE_QUESTIONS_PER_DAY } from '@/constants/rules';
import { ENTITLEMENT_ID, PRODUCT_IDS } from '@/constants/billing';
import { fetchSubscriber, isEntitlementActive, submitPurchase } from '@/data/revenuecat';
import { uuidv4 } from '@/utils/uuid';
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
   * Buys `plan` through the store (react-native-iap) and validates the result
   * with RevenueCat over REST (ADR-012). Resolves once the purchase clears;
   * rejects on error or user cancellation.
   */
  startTrial: (plan: Plan) => Promise<void>;
  restore: () => Promise<boolean>;
  cancel: () => void;
  countQuestion: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

const skuToPlan = (sku: string): Plan | null =>
  sku === PRODUCT_IDS.monthly ? 'monthly' : sku === PRODUCT_IDS.yearly ? 'yearly' : null;

async function getAppUserId(): Promise<string> {
  const existing = await load<string | null>(KEYS.revenuecatUserId, null);
  if (existing) return existing;
  const id = uuidv4();
  await save(KEYS.revenuecatUserId, id);
  return id;
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(EMPTY);
  const [ready, setReady] = useState(false);
  const appUserId = useRef<string | null>(null);
  const pendingPurchase = useRef<{ sku: string; resolve: () => void; reject: (e: Error) => void } | null>(null);

  const persist = useCallback((next: SubscriptionState) => {
    void save(KEYS.subscription, next);
    return next;
  }, []);

  const applySubscriber = useCallback(
    (subscriber: Parameters<typeof isEntitlementActive>[0], plan: Plan | null) => {
      const ent = subscriber.entitlements[ENTITLEMENT_ID];
      if (ent && isEntitlementActive(subscriber)) {
        setState((prev) =>
          persist({
            ...prev,
            status: 'active',
            plan: plan ?? prev.plan,
            renewsAt: ent.expires_date,
          }),
        );
        return true;
      }
      return false;
    },
    [persist],
  );

  // Local settings load + store connection, in parallel: neither depends on the other.
  useEffect(() => {
    let cancelled = false;

    load<SubscriptionState>(KEYS.subscription, EMPTY).then((s) => {
      if (!cancelled) setState({ ...EMPTY, ...s });
    });

    (async () => {
      appUserId.current = await getAppUserId();
      try {
        await initConnection();
        // Reconcile silently: a previous purchase may not have been recorded
        // locally yet (reinstall, or the RevenueCat call failed last time).
        const owned = await getAvailablePurchases();
        for (const purchase of owned) {
          const plan = skuToPlan(purchase.productId);
          if (!plan || !appUserId.current) continue;
          try {
            const subscriber = await submitPurchase(appUserId.current, purchase);
            applySubscriber(subscriber, plan);
          } catch {
            // RevenueCat not configured yet, or offline — keep whatever we had cached.
          }
        }
      } catch {
        // No store connection (simulator without a signed-in account, etc.).
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    const updatedSub = purchaseUpdatedListener(async (purchase: Purchase) => {
      const plan = skuToPlan(purchase.productId);
      const pending = pendingPurchase.current;
      try {
        if (!appUserId.current) throw new Error('No app user id yet');
        const subscriber = await submitPurchase(appUserId.current, purchase);
        await finishTransaction({ purchase, isConsumable: false });
        const active = applySubscriber(subscriber, plan);
        if (pending && pending.sku === purchase.productId) {
          pendingPurchase.current = null;
          if (active) pending.resolve();
          else pending.reject(new Error('Purchase did not grant the pro entitlement'));
        }
      } catch (e) {
        if (pending && pending.sku === purchase.productId) {
          pendingPurchase.current = null;
          pending.reject(e instanceof Error ? e : new Error('Purchase validation failed'));
        }
      }
    });

    const errorSub = purchaseErrorListener((error) => {
      const pending = pendingPurchase.current;
      if (pending) {
        pendingPurchase.current = null;
        pending.reject(new Error(error.message || 'Purchase failed'));
      }
    });

    return () => {
      cancelled = true;
      updatedSub.remove();
      errorSub.remove();
      void endConnection();
    };
  }, [applySubscriber]);

  const startTrial = useCallback(async (plan: Plan) => {
    const sku = PRODUCT_IDS[plan];
    return new Promise<void>((resolve, reject) => {
      pendingPurchase.current = { sku, resolve, reject };
      requestPurchase({
        request: { apple: { sku }, google: { skus: [sku] } },
        type: 'subs',
      }).catch((e: Error) => {
        pendingPurchase.current = null;
        reject(e);
      });
    });
  }, []);

  const restore = useCallback(async () => {
    if (!appUserId.current) return false;
    try {
      const owned = await getAvailablePurchases();
      let restored = false;
      for (const purchase of owned) {
        const plan = skuToPlan(purchase.productId);
        if (!plan) continue;
        const subscriber = await submitPurchase(appUserId.current, purchase);
        if (applySubscriber(subscriber, plan)) restored = true;
      }
      if (!restored) {
        // Nothing pending locally — ask RevenueCat directly in case this is a
        // reinstall on the same store account with no local purchase queue entry.
        const subscriber = await fetchSubscriber(appUserId.current);
        restored = applySubscriber(subscriber, null);
      }
      return restored;
    } catch {
      return false;
    }
  }, [applySubscriber]);

  const cancel = useCallback(() => {
    // Dev/test-only local override. Real cancellation always happens in the
    // store's own subscription management UI (app/settings/subscription.tsx).
    setState((prev) => persist({ ...prev, status: 'expired' }));
  }, [persist]);

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
 *
 * Re-exported from the flag module so existing imports keep working.
 */
export const HAZARD_ENABLED = HAZARD_FLAG;

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}
