import React from 'react';
import { Pressable, View } from 'react-native';

import { BilingualText } from '@/components/BilingualText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Mockup component "Answer Option" (Dv0Gz): radius 16, 1.5px border, 16px
 * padding, text column plus a 20px status icon.
 *
 * One component serves both scenarios, which differ only in which states they
 * use:
 *
 * - Mock test  — `idle` / `selected`. Correctness stays hidden until the paper
 *   is submitted, so `selected` must never look like a verdict.
 * - Lesson, quiz, weak spots — `idle` / `correct` / `incorrect` /
 *   `revealed-correct`, shown after the answer is revealed.
 *
 * `revealed-correct` is the right answer highlighted after the learner picked
 * something else — it is never the tapped option.
 *
 * The A–D badge is opt-in: the lesson card shows letters, the mock test and the
 * quiz runner do not.
 */
export type AnswerOptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'revealed-correct';

interface AnswerOptionProps {
  text: string;
  translation?: string | null;
  state: AnswerOptionState;
  /** Renders the A–D circle when provided. */
  letter?: string;
  disabled?: boolean;
  onPress: () => void;
}

export function AnswerOption({
  text, translation, state, letter, disabled = false, onPress,
}: AnswerOptionProps) {
  const t = useTheme();

  const skin: Record<
    AnswerOptionState,
    {
      bg: string;
      border: string;
      borderWidth: number;
      badgeBg: string;
      badgeFg: string;
      icon: IconName | null;
      iconColor: string;
      /** Spoken by VoiceOver / TalkBack so state is never colour-only (NFR-07). */
      a11y: string;
    }
  > = {
    idle: {
      bg: t.colors.surface,
      border: t.colors.border,
      borderWidth: 1.5,
      badgeBg: t.colors.sage100,
      badgeFg: t.colors.onSurfaceAlt,
      icon: null,
      iconColor: t.colors.textMuted,
      a11y: '',
    },
    selected: {
      // Neutral on purpose: a green tick here would leak the verdict mid-exam.
      bg: t.colors.sage50,
      border: t.colors.accent,
      borderWidth: 2,
      badgeBg: t.colors.accent,
      badgeFg: t.colors.textInverse,
      icon: 'check',
      iconColor: t.colors.accentDark,
      a11y: ', your answer',
    },
    correct: {
      bg: t.colors.successBg,
      border: t.colors.successDark,
      borderWidth: 2,
      badgeBg: t.colors.success,
      badgeFg: t.colors.textInverse,
      icon: 'circle-check',
      iconColor: t.colors.successText,
      a11y: ', correct',
    },
    incorrect: {
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
      iconColor: t.colors.successText,
      a11y: ', this was the correct answer',
    },
  };

  const s = skin[state];
  const label = `${letter ? `${letter}. ` : ''}${text}${s.a11y}`;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: state !== 'idle', disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 16,
        minHeight: 60,
        borderRadius: t.radius.md,
        backgroundColor: s.bg,
        borderWidth: s.borderWidth,
        borderColor: s.border,
        opacity: pressed && !disabled ? 0.85 : 1,
      })}
    >
      {letter ? (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: s.badgeBg,
          }}
        >
          <Txt size={13} weight="700" color={s.badgeFg}>
            {letter}
          </Txt>
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        <BilingualText
          original={text}
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
