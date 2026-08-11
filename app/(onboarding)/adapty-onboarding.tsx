import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AdaptyOnboardingView, type AdaptyOnboarding } from 'react-native-adapty';

import { Txt } from '@/components/ui/primitives';
import { loadOnboarding, OnboardingLoadError } from '@/features/onboarding/loadOnboarding';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Presents the onboarding funnel built in the Adapty dashboard (Welcome →
 * Language → Exam Date → Building Plan → Everything You Get). This is the
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
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    loadOnboarding()
      .then((result) => {
        if (!cancelled) setOnboarding(result);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const stage = e instanceof OnboardingLoadError ? e.stage : 'unknown';
        const detail = e instanceof OnboardingLoadError ? e.detail : String(e);
        setError(`[${stage}]\n${detail}`);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const goToPaywall = React.useCallback(() => {
    router.replace('/paywall');
  }, [router]);

  if (error) {
    // TEMP DEBUG (docs/08-risks-open-questions.md): a release build gives no
    // other way to see why the funnel failed on a tester's device. Replace with
    // a silent hand-off to the paywall once the funnel has been confirmed
    // working in TestFlight — a user must never see this.
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, backgroundColor: t.colors.bg }}>
        <Txt size={14} weight="700" align="center">
          Adapty onboarding failed to load
        </Txt>
        <Txt size={12} color={t.colors.textSecondary} align="center">
          {error}
        </Txt>
        <Pressable
          onPress={goToPaywall}
          style={{ paddingVertical: 12, paddingHorizontal: 20, backgroundColor: t.colors.blue800, borderRadius: t.radius.md }}
        >
          <Txt size={14} weight="700" color={t.colors.onBlue}>
            Continue to paywall
          </Txt>
        </Pressable>
      </View>
    );
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
