import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Row } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface LessonTopBarProps {
  total: number;
  /** 0-based index of the question on screen. */
  index: number;
  /** Drives the thin progress line under the bar. */
  answered: number;
  onClose: () => void;
  onFlag: () => void;
  flagged: boolean;
}

/** Mockup "Top Bar" + "Progress Line" shared by the three question frames. */
export function LessonTopBar({ total, index, answered, onClose, onFlag, flagged }: LessonTopBarProps) {
  const t = useTheme();

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
          accessibilityLabel="Close lesson"
          onPress={onClose}
          hitSlop={12}
          style={{ width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' }}
        >
          <Icon name="x" size={22} color={t.colors.textSecondary} />
        </Pressable>

        <Row
          accessible
          accessibilityLabel={`Question ${index + 1} of ${total}`}
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

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={flagged ? 'Remove flag from this question' : 'Flag this question'}
          accessibilityState={{ selected: flagged }}
          onPress={onFlag}
          hitSlop={12}
          style={{ width: 44, height: 44, alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <Icon
            name="flag"
            size={20}
            color={flagged ? t.colors.amber : t.colors.textSecondary}
            fill={flagged ? t.colors.amber : 'none'}
          />
        </Pressable>
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
