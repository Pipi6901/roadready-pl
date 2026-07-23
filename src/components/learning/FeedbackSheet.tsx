import React from 'react';
import { View } from 'react-native';

import { BilingualText } from '@/components/BilingualText';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface FeedbackSheetProps {
  correct: boolean;
  /** translateY (px) driven by the lesson screen's slide animation. */
  translateY: number;
  explanation: string;
  explanationTranslation?: string | null;
  /** Right answer, shown only after a wrong pick. */
  correctAnswer: string;
  correctAnswerTranslation?: string | null;
  xp: number;
  onContinue: () => void;
  /** Extra bottom padding for the home indicator. */
  bottomInset: number;
  onLayout?: (height: number) => void;
  /** Kept mounted while hidden so the slide-in has something to animate. */
  visible: boolean;
}

/**
 * Mockup frames "Correct Answer" / "Incorrect Answer" — the bottom sheet.
 * Slides in only; no shake or bounce on a wrong answer (ТЗ 10.6).
 */
export function FeedbackSheet({
  correct, translateY, explanation, explanationTranslation, correctAnswer,
  correctAnswerTranslation, xp, onContinue, bottomInset, onLayout, visible,
}: FeedbackSheetProps) {
  const t = useTheme();
  const tone = correct ? t.colors.successDark : t.colors.error;

  return (
    <View
      accessibilityViewIsModal={visible}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
      onLayout={(e) => onLayout?.(e.nativeEvent.layout.height)}
      style={{
        pointerEvents: visible ? 'auto' : 'none',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        gap: 12,
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20 + bottomInset,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        backgroundColor: t.colors.surface,
        shadowColor: t.colors.blue900,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 16,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          alignSelf: 'center',
          backgroundColor: t.colors.border,
        }}
      />

      <Row style={{ justifyContent: 'space-between' }}>
        <Row style={{ gap: 8, flex: 1 }}>
          <Icon name={correct ? 'circle-check' : 'circle-x'} size={26} color={tone} />
          <Txt size={19} weight="700" color={tone}>
            {correct ? 'Correct!' : 'Not quite'}
          </Txt>
        </Row>

        {correct && xp > 0 ? (
          <Row
            accessible
            accessibilityLabel={`Plus ${xp} experience points`}
            style={{
              gap: 4,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 14,
              backgroundColor: t.colors.amber50,
            }}
          >
            <Icon name="zap" size={14} color={t.colors.amber} />
            <Txt size={13} weight="700" color={t.colors.amberDark}>
              +{xp} XP
            </Txt>
          </Row>
        ) : null}
      </Row>

      {!correct ? (
        <View style={{ gap: 4 }}>
          <Txt size={12} weight="600" color={t.colors.textSecondary}>
            Correct answer
          </Txt>
          <BilingualText
            english={correctAnswer}
            translation={correctAnswerTranslation}
            size={14}
            weight="600"
            translationSize={12}
            gap={2}
            color={t.colors.successText}
          />
        </View>
      ) : null}

      <BilingualText
        english={explanation}
        translation={explanationTranslation}
        size={14}
        weight="400"
        translationSize={12}
        gap={4}
      />

      {!correct ? (
        <Row
          style={{
            gap: 6,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: t.colors.sage100,
          }}
        >
          <Icon name="rotate-ccw" size={14} color={t.colors.textMuted} />
          <Txt size={12} color={t.colors.textSecondary} style={{ flex: 1 }}>
            This question will appear again later
          </Txt>
        </Row>
      ) : null}

      <Button label={correct ? 'Continue' : 'Got it'} onPress={onContinue} />
    </View>
  );
}
