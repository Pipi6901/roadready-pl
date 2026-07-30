import type { Plan, SubscriptionState } from '@/store/SubscriptionProvider';

/**
 * Display prices. The store is the source of truth at runtime — react-native-iap's
 * `fetchProducts` returns localised, tax-adjusted strings (ADR-012) — so these are
 * the fallback shown before the product list resolves, not the prices we charge.
 * TODO: replace with the localised price once real product IDs exist.
 */
export const PLAN_PRICE: Record<Plan, string> = {
  monthly: '£4.99',
  yearly: '£39.99',
};

export const PLAN_PERIOD: Record<Plan, string> = {
  monthly: 'per month',
  yearly: 'per year',
};

/** "Pro Monthly · £4.99", "Free trial", "Free" — the Current plan row value. */
export function planLabel(state: SubscriptionState): string {
  switch (state.status) {
    case 'trial':
      return 'Free trial';
    case 'active':
      return state.plan
        ? `Pro ${state.plan === 'monthly' ? 'Monthly' : 'Yearly'} · ${PLAN_PRICE[state.plan]}`
        : 'Pro';
    case 'expired':
      return 'Free (expired)';
    default:
      return 'Free';
  }
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
