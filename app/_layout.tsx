import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ContentProvider } from '@/store/ContentProvider';
import { ProgressProvider } from '@/store/ProgressProvider';
import { SettingsProvider } from '@/store/SettingsProvider';
import { SubscriptionProvider } from '@/store/SubscriptionProvider';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

function RootStack() {
  const t = useTheme();
  return (
    <>
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
        {/* Split out from (modals): this is the one screen that actually
            needs a see-through scrim over whatever awarded the achievement,
            so only it gets transparentModal — forcing that on the group
            above is what broke their safe area in the first place. */}
        <Stack.Screen
          name="achievement"
          options={{ presentation: 'transparentModal', animation: 'fade_from_bottom' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SettingsProvider>
            <SubscriptionProvider>
              <ProgressProvider>
                <ContentProvider>
                  <RootStack />
                </ContentProvider>
              </ProgressProvider>
            </SubscriptionProvider>
          </SettingsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
