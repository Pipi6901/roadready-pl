import React from 'react';
import { Pressable, View } from 'react-native';

import { BilingualText } from '@/components/BilingualText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * `selected` is the mock-test state: the answer is recorded but correctness is
 * withheld until the paper is submitted, exactly like the real exam.
 */
export type AnswerOptionState = 'idle' | 'selected' | 'correct' | 'incorrect';

interface AnswerOptionProps {
  text: string;
  translation?: string | null;
  state: AnswerOptionState;
  onPress?: () => void;
  disabled?: boolean;
}

/** Mockup component "Answer Option" (id Dv0Gz). */
export function AnswerOption({ text, translation, state, onPress, disabled }: AnswerOptionProps) {
  const t = useTheme();

  const skin: Record<AnswerOptionState, {
    bg: string; border: string; width: number; icon: IconName | null; iconColor: string; status: string;
  }> = {
    idle: {
      bg: t.colors.surface,
      border: t.colors.border,
      width: 1.5,
      icon: null,
      iconColor: t.colors.textMuted,
      status: '',
    },
    selected: {
      bg: t.colors.sage50,
      border: t.colors.accent,
      width: 2,
      icon: 'check',
      iconColor: t.colors.accentDark,
      status: 'your answer',
    },
    correct: {
      bg: t.colors.successBg,
      border: t.colors.successDark,
      width: 2,
      icon: 'circle-check',
      iconColor: t.colors.successText,
      status: 'correct answer',
    },
    incorrect: {
      bg: t.colors.errorBg,
      border: t.colors.error,
      width: 2,
      icon: 'circle-x',
      iconColor: t.colors.error,
      status: 'incorrect answer',
    },
  };

  const s = skin[state];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: state !== 'idle', disabled: !!disabled }}
      // Status is spelled out, never left to the fill colour alone (NFR-07).
      accessibilityLabel={s.status ? `${text}, ${s.status}` : text}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 16,
        minHeight: 56,
        borderRadius: 16,
        backgroundColor: s.bg,
        borderWidth: s.width,
        borderColor: s.border,
        opacity: pressed && !disabled ? 0.85 : 1,
      })}
    >
      <View style={{ flex: 1 }}>
        <BilingualText
          english={text}
          translation={translation}
          size={15}
          weight="600"
          translationSize={12}
          gap={2}
        />
      </View>
      {s.icon ? <Icon name={s.icon} size={20} color={s.iconColor} /> : null}
    </Pressable>
  );
}
