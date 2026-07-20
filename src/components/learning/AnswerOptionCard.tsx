import React from 'react';
import { Pressable, View } from 'react-native';

import { BilingualText } from '@/components/BilingualText';
import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * `revealed-correct` is the right answer highlighted after the learner picked
 * something else — it is never the tapped option.
 */
export type AnswerOptionState = 'idle' | 'selected-correct' | 'selected-incorrect' | 'revealed-correct';

interface AnswerOptionCardProps {
  letter: string;
  text: string;
  translation?: string | null;
  state: AnswerOptionState;
  disabled: boolean;
  onPress: () => void;
}

/** Mockup component "Answer Option" (radius 16, 1.5px border, 16px padding). */
export function AnswerOptionCard({
  letter, text, translation, state, disabled, onPress,
}: AnswerOptionCardProps) {
  const t = useTheme();

  const skin = {
    idle: {
      bg: t.colors.surface,
      border: t.colors.border,
      borderWidth: 1.5,
      badgeBg: t.colors.sage100,
      badgeFg: t.colors.onSurfaceAlt,
      icon: null as string | null,
      iconColor: t.colors.textMuted,
      /** Read out by VoiceOver so state is never colour-only. */
      a11y: '',
    },
    'selected-correct': {
      bg: t.colors.successBg,
      border: t.colors.successDark,
      borderWidth: 2,
      badgeBg: t.colors.success,
      badgeFg: t.colors.textInverse,
      icon: 'circle-check',
      iconColor: t.colors.successDark,
      a11y: ', correct',
    },
    'selected-incorrect': {
      bg: t.colors.errorBg,
      border: t.colors.error,
      borderWidth: 2,
      badgeBg: t.colors.error,
      badgeFg: t.colors.textInverse,
      icon: 'circle-x',
      iconColor: t.colors.error,
      a11y: ', incorrect',
    },
    'revealed-correct': {
      bg: t.colors.successBg,
      border: t.colors.successDark,
      borderWidth: 2,
      badgeBg: t.colors.success,
      badgeFg: t.colors.textInverse,
      icon: 'circle-check',
      iconColor: t.colors.successDark,
      a11y: ', this was the correct answer',
    },
  }[state];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${letter}. ${text}${skin.a11y}`}
      accessibilityState={{ disabled, selected: state === 'selected-correct' || state === 'selected-incorrect' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        minHeight: 60,
        borderRadius: t.radius.md,
        backgroundColor: skin.bg,
        borderWidth: skin.borderWidth,
        borderColor: skin.border,
        opacity: pressed && !disabled ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: skin.badgeBg,
        }}
      >
        <Txt size={13} weight="700" color={skin.badgeFg}>
          {letter}
        </Txt>
      </View>

      <View style={{ flex: 1 }}>
        <BilingualText english={text} translation={translation} size={15} weight="600" translationSize={12} gap={2} />
      </View>

      {skin.icon ? <Icon name={skin.icon} size={20} color={skin.iconColor} /> : null}
    </Pressable>
  );
}
