import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { EVENTS, initAnalytics, setUserProperties, track } from '@/features/analytics/analytics';
import { ContentProvider } from '@/store/ContentProvider';
import { ProgressProvider } from '@/store/ProgressProvider';
import { SettingsProvider, useSettings } from '@/store/SettingsProvider';
import { SubscriptionProvider, useSubscription } from '@/store/SubscriptionProvider';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

/**
 * Attributes every event carries. Lives inside the providers because that is
 * where language and subscription tier are known; RootLayout below sits
 * outside them and cannot read either.
 */
function AnalyticsIdentity() {
  const { localeCode, countryCode } = useSettings();
  const { isPro, state } = useSubscription();

  React.useEffect(() => {
    setUserProperties({
      locale: localeCode ?? 'en',
      country: countryCode,
      is_pro: isPro,
      plan: state.plan ?? 'none',
      subscription_status: state.status,
    });
  }, [localeCode, countryCode, isPro, state.plan, state.status]);

  return null;
}

/**
 * ThemeProvider has to sit inside SettingsProvider to read the chosen scheme,
 * and everything visual sits inside it — so the providers between the two
 * (subscription, progress, content) are nested here rather than in
 * RootLayout, which cannot call useSettings.
 */
function ThemedApp() {
  const { themeMode } = useSettings();
  return (
    <ThemeProvider mode={themeMode}>
      <SubscriptionProvider>
        <ProgressProvider>
          <ContentProvider>
            <RootStack />
          </ContentProvider>
        </ProgressProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

function RootStack() {
  const t = useTheme();
  return (
    <>
      <AnalyticsIdentity />
      <StatusBar style={t.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="lesson/[topicId]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings" />
        {/* The whole modal group is presented at once, so the option lives here
            rather than in app/(modals)/_layout.tsx: a nested stack cannot
            animate its own root screen in. Plain `modal` (opaque) — every
            screen left in this group (change-country, change-language,
            trial-ended) paints its own solid background via <Screen> and
            needs a correctly computed top safe-area inset, which
            transparentModal was breaking (the close button rendered under
            the status bar clock instead of below it). fade_from_bottom
            (not the plainer slide_from_bottom) so the sheet eases in rather
            than snapping up. */}
        <Stack.Screen
          name="(modals)"
          options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
        />
        {/* Split out from (modals) because it is presented differently, not
            because it is see-through any more: the celebration now fills the
            screen through <Screen>, which applies its own insets. The
            transparent presentation is kept because an opaque child under it
            looks identical to a full-screen modal, and forcing the group
            above into this mode is what broke their safe area originally. */}
        <Stack.Screen
          name="achievement"
          options={{ presentation: 'transparentModal', animation: 'fade_from_bottom' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  // Once per app start, before anything can call track(): the device id lives
  // in AsyncStorage, so events fired earlier would have nothing to attribute
  // themselves to. track() queues them either way, initAnalytics flushes.
  React.useEffect(() => {
    void initAnalytics(Constants.expoConfig?.version ?? '0.0.0').then(() => {
      track(EVENTS.appOpened);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <ThemedApp />
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
