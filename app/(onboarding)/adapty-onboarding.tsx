import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { adapty, AdaptyOnboardingView, type AdaptyOnboarding } from 'react-native-adapty';

import { ADAPTY_PUBLIC_KEY, ONBOARDING_PLACEMENT_ID } from '@/constants/adapty';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Presents the onboarding funnel built in the Adapty dashboard (Splash →
 * Welcome → Language → Goal → Building Plan → Trial → Paywall). This is the
 * app's only onboarding entry point — see app/index.tsx.
 *
 * This screen only presents the informational onboarding content. The actual
 * purchase still happens on the existing paywall.tsx (RevenueCatUI.Paywall) —
 * the last screen of the Adapty funnel is configured with a "Close onboarding"
 * action (not "Open paywall"), so `onClose` below is what hands off to it.
 */
export default function AdaptyOnboardingScreen() {
  const t = useTheme();
  const router = useRouter();
  const [onboarding, setOnboarding] = React.useState<AdaptyOnboarding | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    // Safe to call from every screen that mounts this — same idempotent
    // pattern SubscriptionProvider uses for Purchases.configure().
    adapty
      .activate(ADAPTY_PUBLIC_KEY)
      .then(() => adapty.getOnboarding(ONBOARDING_PLACEMENT_ID))
      .then((result) => {
        if (!cancelled) setOnboarding(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const goToPaywall = React.useCallback(() => {
    router.replace('/paywall');
  }, [router]);

  // Network hiccup or misconfigured placement: don't strand the learner on a
  // blank screen, fall through to the paywall same as a normal finish.
  if (error) {
    goToPaywall();
    return null;
  }

  if (!onboarding) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.bg }}>
        <ActivityIndicator color={t.colors.accent} />
      </View>
    );
  }

  return (
    <AdaptyOnboardingView
      onboarding={onboarding}
      style={{ flex: 1 }}
      onClose={goToPaywall}
      onError={() => goToPaywall()}
    />
  );
}
