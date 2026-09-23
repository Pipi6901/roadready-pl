import React from 'react';
import { Pressable, View } from 'react-native';

import { SaveButton } from '@/components/SaveButton';
import { Icon } from '@/components/ui/Icon';
import { Row } from '@/components/ui/primitives';
import { useT } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';

interface LessonTopBarProps {
  total: number;
  /** 0-based index of the question on screen. */
  index: number;
  /** Drives the thin progress line under the bar. */
  answered: number;
  onClose: () => void;
  /** The question on screen, for the bookmark in the right-hand slot. */
  questionId: string;
}

/**
 * Mockup "Top Bar" + "Progress Line" shared by the three question frames.
 *
 * The right-hand slot used to hold a flag that lived only for the lesson and
 * led nowhere. It is the bookmark now: the same mark the quiz, weak spots and
 * the mock test carry, and it lands the question on the Saved screen.
 */
export function LessonTopBar({ total, index, answered, onClose, questionId }: LessonTopBarProps) {
  const t = useTheme();
  const tr = useT();

  return (
    <View>
      <Row
        style={{
          justifyContent: 'space-between',
          paddingTop: 16,
          paddingBottom: 10,
          paddingHorizontal: 20,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={tr('question.closeLesson')}
          onPress={onClose}
          hitSlop={12}
          style={{ width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' }}
        >
          <Icon name="x" size={22} color={t.colors.textSecondary} />
        </Pressable>

        <Row
          accessible
          accessibilityLabel={tr('question.numberA11y', { index: index + 1, total })}
          style={{ gap: 6, flex: 1, justifyContent: 'center' }}
        >
          {Array.from({ length: total }, (_, i) => {
            const isCurrent = i === index;
            const done = i < index;
            const dot = isCurrent ? 10 : 8;
            return (
              <View
                key={i}
                style={{
                  width: dot,
                  height: dot,
                  borderRadius: dot / 2,
                  backgroundColor: done || isCurrent ? t.colors.accent : t.colors.sage100,
                }}
              />
            );
          })}
        </Row>

        <SaveButton questionId={questionId} style={{ alignItems: 'flex-end' }} />
      </Row>

      <View style={{ height: 4, backgroundColor: t.colors.sage100 }}>
        <View
          style={{
            height: 4,
            width: `${total ? (answered / total) * 100 : 0}%`,
            backgroundColor: t.colors.success,
          }}
        />
      </View>
    </View>
  );
}
