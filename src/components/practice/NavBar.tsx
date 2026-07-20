import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface NavBarProps {
  title: string;
  onBack?: () => void;
  /** Optional right-hand slot, e.g. a clip counter. */
  trailing?: React.ReactNode;
}

/** Mockup frame "Nav Bar" — round back button plus a 17/700 title. */
export function NavBar({ title, onBack, trailing }: NavBarProps) {
  const t = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 20,
        height: 52,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack ?? (() => router.back())}
        hitSlop={8}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.surface,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: t.colors.border,
        }}
      >
        <Icon name="chevron-left" size={20} color={t.colors.textPrimary} />
      </Pressable>

      <Txt size={17} weight="700" style={{ flex: 1 }}>
        {title}
      </Txt>

      {trailing}
    </View>
  );
}
