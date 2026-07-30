import { Platform } from 'react-native';
import type { Purchase } from 'react-native-iap';

import { ENTITLEMENT_ID, REVENUECAT_API_KEY, REVENUECAT_RECEIPTS_URL, REVENUECAT_SUBSCRIBER_URL } from '@/constants/billing';

/**
 * RevenueCat "SDK-less" REST integration (ADR-012). We drive the actual
 * purchase with react-native-iap, then hand the resulting token to RevenueCat
 * here for validation and entitlement tracking — react-native-purchases
 * itself never loads, so its New Architecture bug (docs/00-decisions.md) is
 * moot.
 */

interface RevenueCatSubscriber {
  entitlements: Record<string, { expires_date: string | null; product_identifier: string }>;
}

interface RevenueCatResponse {
  subscriber: RevenueCatSubscriber;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${REVENUECAT_API_KEY}`,
    'Content-Type': 'application/json',
    'X-Platform': Platform.OS === 'android' ? 'android' : 'ios',
  };
}

/** True when the `pro` entitlement (ENTITLEMENT_ID) exists and has not expired. */
export function isEntitlementActive(subscriber: RevenueCatSubscriber): boolean {
  const ent = subscriber.entitlements[ENTITLEMENT_ID];
  if (!ent) return false;
  return ent.expires_date === null || new Date(ent.expires_date).getTime() > Date.now();
}

/**
 * Submit a store purchase to RevenueCat for validation. Returns the parsed
 * subscriber record so the caller can read back entitlement status.
 */
export async function submitPurchase(appUserId: string, purchase: Purchase): Promise<RevenueCatSubscriber> {
  const fetchToken = purchase.purchaseToken;
  if (!fetchToken) throw new Error('Purchase is missing a token — cannot validate with RevenueCat');

  const res = await fetch(REVENUECAT_RECEIPTS_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      app_user_id: appUserId,
      fetch_token: fetchToken,
      product_id: purchase.productId,
    }),
  });
  if (!res.ok) throw new Error(`RevenueCat receipt validation failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as RevenueCatResponse;
  return json.subscriber;
}

export async function fetchSubscriber(appUserId: string): Promise<RevenueCatSubscriber> {
  const res = await fetch(`${REVENUECAT_SUBSCRIBER_URL}/${encodeURIComponent(appUserId)}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`RevenueCat subscriber lookup failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as RevenueCatResponse;
  return json.subscriber;
}
