import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Bottom tab bar — mockup component "TabBar" (375×64).
 * Four tabs: Home, Learn, Practice, Profile. Hidden during lessons and mock
 * tests, which live outside this group (ТЗ 10.1).
 */
export default function TabsLayout() {
  const t = useTheme();
  // A fixed tabBarStyle.height (needed for the mockup's 64pt bar) opts out
  // of React Navigation's own safe-area handling, so the home-indicator
  // inset has to be added back by hand — otherwise the bar sits flush
  // against the bottom edge and the labels end up crowded against (or
  // under) the gesture area on any iPhone without a physical home button.
  const insets = useSafeAreaInsets();

  // Declared here rather than read back from the navigator's own tint props:
  // those hand the colour over as a ColorValue, which Icon and Txt don't take.
  //
  // The blue is a primary button's (Continue on Home). blue800 — the deep navy
  // of headers and inverse blocks — used to be the selected tint, and it barely
  // separates from the bar in light mode while sinking into the surface in dark
  // mode, so the bar read as having nothing selected at all.
  const selected = t.colors.accent;
  const idle = t.colors.textMuted;

  // The label carries the mockup's weight difference on top of the colour
  // (600 selected / 400 idle) — selection must never be signalled by colour
  // alone (NFR-07).
  const tab = (name: string, icon: IconName) => ({
    title: name,
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <Icon name={icon} size={24} color={focused ? selected : idle} />
    ),
    tabBarLabel: ({ focused }: { focused: boolean }) => (
      <Txt size={11} weight={focused ? '600' : '400'} color={focused ? selected : idle}>
        {name}
      </Txt>
    ),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Still set even though icon and label paint themselves: the tints also
        // drive the press ripple and VoiceOver's selected state.
        tabBarActiveTintColor: selected,
        tabBarInactiveTintColor: idle,
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.border,
          height: 64 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'house')} />
      {/* 'route' instead of the generic 'book-open' — Learn's screen IS the
          winding road map, so the tab icon matches what's actually there. */}
      <Tabs.Screen name="learn" options={tab('Learn', 'route')} />
      {/* 'gauge' instead of 'timer' — a speedometer ties back to the
          driving theme and reads as more deliberate than a generic clock,
          which doesn't obviously mean "practice" at all. */}
      <Tabs.Screen name="practice" options={tab('Practice', 'gauge')} />
      <Tabs.Screen name="profile" options={tab('Profile', 'user')} />
    </Tabs>
  );
}
