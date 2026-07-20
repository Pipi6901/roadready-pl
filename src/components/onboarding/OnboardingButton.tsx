import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';

import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface OnboardingButtonProps {
  label: string;
  onPress: () => void;
  /** "accent" = lime slab with the 3px Duolingo edge, "soft" = flat sage fill. */
  variant?: 'accent' | 'soft';
  fontSize?: number;
  paddingVertical?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Onboarding CTA. The shared Button primitive is fixed at 14pt padding / 15pt
 * label; the onboarding mockup varies both per screen, so this variant takes
 * them as props instead of forking the primitive.
 */
export function OnboardingButton({
  label, onPress, variant = 'accent', fontSize = 15, paddingVertical = 15, disabled, style,
}: OnboardingButtonProps) {
  const t = useTheme();

  const palette =
    variant === 'accent'
      ? { bg: t.colors.accent, edge: t.colors.accentDark, fg: t.colors.textInverse, edgeWidth: 3 }
      : { bg: t.colors.sage100, edge: t.colors.sage100, fg: t.colors.onSurfaceAlt, edgeWidth: 0 };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: palette.bg,
          borderRadius: t.radius.button,
          borderBottomWidth: palette.edgeWidth,
          borderBottomColor: palette.edge,
          paddingVertical,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: 44,
          opacity: disabled ? 0.45 : 1,
          transform: [{ translateY: pressed && !disabled ? 2 : 0 }],
        },
        style,
      ]}
    >
      <Txt size={fontSize} weight="700" color={palette.fg}>
        {label}
      </Txt>
    </Pressable>
  );
}

interface LinkButtonProps {
  label: string;
  onPress: () => void;
  fontSize?: number;
  color?: string;
}

/** Text link under the primary CTA ("Restore purchase", "Restore Purchase"). */
export function LinkButton({ label, onPress, fontSize = 14, color }: LinkButtonProps) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center', width: '100%' }}
    >
      <Txt size={fontSize} weight="600" color={color ?? t.colors.blue800}>
        {label}
      </Txt>
    </Pressable>
  );
}
