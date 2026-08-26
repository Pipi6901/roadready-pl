import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';

import { ENTITLEMENT_ID } from '@/constants/billing';
import { EVENTS, track } from '@/features/analytics/analytics';
import { useSettings } from '@/store/SettingsProvider';

/**
 * Paywall — mockup frame "Paywall". Last step of onboarding.
 *
 * Renders the paywall configured in the RevenueCat dashboard (design, copy,
 * plans) instead of a hardcoded screen — ADR-012 addendum: this is what
 * actually needs `react-native-purchases-ui`, so unlike the receipt-only
 * purchase flow, the paywall's visuals can be changed from the RevenueCat
 * dashboard without an app release.
 */
export default function PaywallScreen() {
  const router = useRouter();
  const { update } = useSettings();
  // Четыре точки входа на пейвол: онбординг, упёрся в дневной лимит, конец
  // триала, настройки. Без разделения их конверсии усредняются в одно число,
  // по которому нельзя понять ничего.
  const { source = 'onboarding' } = useLocalSearchParams<{ source?: string }>();

  const finishOnboarding = React.useCallback(() => {
    update({ onboarded: true });
    router.replace('/(tabs)');
  }, [update, router]);

  // `source` distinguishes the onboarding paywall from the one reached later
  // from a hit daily limit — without it the conversion rates of two very
  // different moments end up averaged into one meaningless number.
  React.useEffect(() => {
    track(EVENTS.paywallShown, { source });
  }, [source]);

  return (
    <RevenueCatUI.Paywall
      style={{ flex: 1 }}
      onPurchaseCompleted={() => {
        track(EVENTS.purchaseCompleted, { source });
        finishOnboarding();
      }}
      onRestoreCompleted={({ customerInfo }) => {
        const restored = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
        track(EVENTS.purchaseRestored, { restored });
        Alert.alert(
          restored ? 'Purchase restored' : 'Nothing to restore',
          restored
            ? 'Your subscription is active again.'
            : 'We found no previous purchase for this store account.',
        );
        if (restored) finishOnboarding();
      }}
      onDismiss={() => {
        track(EVENTS.paywallDismissed, { source });
        finishOnboarding();
      }}
    />
  );
}
