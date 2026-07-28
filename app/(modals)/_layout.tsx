import { Stack } from 'expo-router';
import React from 'react';

/**
 * Service modals — change country, change language, trial ended (ТЗ 8.1–8.6).
 *
 * `presentation: 'modal'` applies to anything pushed *inside* the group; the
 * group itself is presented by the root stack (app/_layout.tsx), which is the
 * only place that can animate this stack's first screen in.
 *
 * The achievement card used to live in this group too, which forced the
 * whole group into `transparentModal` so it could dim the screen underneath
 * — but that broke top safe-area insets for these three, which all paint an
 * opaque background of their own via <Screen> and don't want a scrim. It now
 * lives at app/achievement.tsx with its own presentation instead.
 */
export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
}
