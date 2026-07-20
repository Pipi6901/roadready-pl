import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface NavBarProps {
  title: string;
  /** "back" on pushed screens, "close" on modals. */
  action?: 'back' | 'close';
  onAction?: () => void;
}

/** Nav bar from the mockup: 36pt round button + 17pt bold title. */
export function NavBar({ title, action = 'back', onAction }: NavBarProps) {
  const t = useTheme();
  const router = useRouter();

  const icon: IconName = action === 'close' ? 'x' : 'chevron-left';
  const label = action === 'close' ? 'Close' : 'Back';

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
        onPress={onAction ?? (() => router.back())}
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={6}
        style={({ pressed }) => ({
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.surface,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: t.colors.border,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Icon name={icon} size={20} color={t.colors.textPrimary} />
      </Pressable>

      <Txt size={17} weight="700" accessibilityRole="header">
        {title}
      </Txt>
    </View>
  );
}
