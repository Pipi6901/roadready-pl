import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { adapty, AdaptyOnboardingView, type AdaptyOnboarding } from 'react-native-adapty';

import { Txt } from '@/components/ui/primitives';
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
  const [error, setError] = React.useState<string | null>(null);

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
      .catch((e: unknown) => {
        // TEMP DEBUG (see docs/08-risks-open-questions.md — remove once the
        // onboarding is confirmed working on a real TestFlight build):
        // surfaces the actual failure instead of silently falling through to
        // the paywall, since there is no other way to see what broke on a
        // release build without device logs. AdaptyError's `.message` is just
        // a generic wrapper ("An error was returned by the server...") — the
        // real cause is in `.detail` and `.adaptyCode`.
        if (cancelled) return;
        const err = e as { message?: string; detail?: string; adaptyCode?: unknown };
        const parts = [err?.message, err?.detail && `detail: ${err.detail}`, err?.adaptyCode != null && `code: ${err.adaptyCode}`]
          .filter(Boolean);
        setError(parts.length ? parts.join('\n') : JSON.stringify(e));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const goToPaywall = React.useCallback(() => {
    router.replace('/paywall');
  }, [router]);

  if (error) {
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
