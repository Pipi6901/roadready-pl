import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AdaptyOnboardingView, type AdaptyOnboarding } from 'react-native-adapty';

import { Txt } from '@/components/ui/primitives';
import { EVENTS, track } from '@/features/analytics/analytics';
import { loadOnboarding, OnboardingLoadError } from '@/features/onboarding/loadOnboarding';
import { useSettings } from '@/store/SettingsProvider';
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
  const { update } = useSettings();
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
    router.replace('/paywall?source=onboarding');
  }, [router]);

  // Пара к onboarding_completed: разница между ними и есть доля тех, кто
  // отвалился внутри воронки Adapty, — иначе её не видно ниоткуда.
  React.useEffect(() => {
    track(EVENTS.onboardingStarted);
  }, []);

  /**
   * Escape hatch for a first-ever launch with no network. Adapty cannot
   * activate, the paywall cannot fetch its offerings either, and `onboarded`
   * is only ever set on the paywall — so without this the app is a dead end
   * on the one screen it can't get past, while the entire question bank sits
   * ready inside the binary. Onboarding is a shop window; it must never be
   * what keeps someone out of the app.
   */
  const skipToApp = React.useCallback(() => {
    track(EVENTS.onboardingCompleted, { reason: 'skipped_offline' });
    update({ onboarded: true });
    router.replace('/(tabs)');
  }, [update, router]);

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
          accessibilityRole="button"
          style={{ paddingVertical: 12, paddingHorizontal: 20, backgroundColor: t.colors.blue800, borderRadius: t.radius.md }}
        >
          <Txt size={14} weight="700" color={t.colors.onBlue}>
            Continue to paywall
          </Txt>
        </Pressable>
        <Pressable
          onPress={skipToApp}
          accessibilityRole="button"
          accessibilityHint="Skips the intro and opens the app"
          style={{ paddingVertical: 12, paddingHorizontal: 20 }}
        >
          <Txt size={14} weight="600" color={t.colors.textSecondary}>
            Skip and start learning
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
      onClose={() => {
        track(EVENTS.onboardingCompleted, { reason: 'closed' });
        goToPaywall();
      }}
      onError={() => {
        track(EVENTS.onboardingCompleted, { reason: 'error' });
        goToPaywall();
      }}
    />
  );
}
