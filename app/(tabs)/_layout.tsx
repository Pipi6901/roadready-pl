import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/Icon';
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

  const tab = (name: string, icon: IconName) => ({
    title: name,
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <Icon name={icon} size={24} color={focused ? t.colors.blue800 : t.colors.textMuted} />
    ),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.blue800,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.border,
          height: 64 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
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
