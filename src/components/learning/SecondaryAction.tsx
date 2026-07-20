import React from 'react';
import { Pressable } from 'react-native';

import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface SecondaryActionProps {
  label: string;
  onPress: () => void;
}

/**
 * The sage "Review mistakes" slab from the Topic Detail and Lesson Complete
 * frames. The shared `Button` secondary variant renders a surface card with a
 * textPrimary label, which is a different control — hence this one.
 */
export function SecondaryAction({ label, onPress }: SecondaryActionProps) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 15,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.button,
        backgroundColor: t.colors.sage100,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Txt size={15} weight="700" color={t.colors.accentDark}>
        {label}
      </Txt>
    </Pressable>
  );
}
