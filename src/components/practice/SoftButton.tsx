import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';

import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface SoftButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: number;
  style?: ViewStyle;
}

/**
 * The mockup's quiet action: sage-100 slab with deep-blue label ("Previous",
 * "Try Again"). The shared Button primitive has no foreground override, and
 * this pairing appears on three screens.
 */
export function SoftButton({ label, onPress, disabled, size = 15, style }: SoftButtonProps) {
  const t = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: t.radius.button,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.sage100,
          opacity: disabled ? 0.45 : 1,
          transform: [{ translateY: pressed && !disabled ? 2 : 0 }],
        },
        style,
      ]}
    >
      <Txt size={size} weight="700" color={t.colors.onSurfaceAlt}>
        {label}
      </Txt>
    </Pressable>
  );
}
