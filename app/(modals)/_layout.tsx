import { Stack } from 'expo-router';
import React from 'react';

/**
 * Service modals — ТЗ 8.1–8.6.
 *
 * `presentation: 'modal'` applies to anything pushed *inside* the group; the
 * group itself is presented by the root stack (app/_layout.tsx), which is the
 * only place that can animate this stack's first screen in.
 *
 * The background is left transparent — not a palette colour, the absence of one
 * — so the achievement card can dim the screen underneath. Every other modal
 * paints its own themed background through <Screen>.
 */
export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    />
  );
}
