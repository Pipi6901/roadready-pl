import React from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useT } from '@/features/i18n/useT';
import { useHaptics } from '@/hooks/useHaptics';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';

interface SaveButtonProps {
  questionId: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * The bookmark on a question card. Same control on every surface — lesson,
 * quiz, weak spots, mock test — so the learner meets one gesture, not four.
 *
 * It is on the mock test on purpose. Saving reveals nothing and moves nothing:
 * the paper still cannot be revisited, the clock keeps running. What it gives
 * is the one thing the exam format takes away — a way to come back to the
 * question that felt wrong, once the paper is done.
 */
export function SaveButton({ questionId, size = 20, style }: SaveButtonProps) {
  const t = useTheme();
  const tr = useT();
  const haptics = useHaptics();
  const { isSaved, toggleSaved } = useProgress();
  const saved = isSaved(questionId);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? tr('saved.remove') : tr('saved.add')}
      accessibilityState={{ selected: saved }}
      onPress={() => {
        toggleSaved(questionId);
        haptics.tap();
      }}
      hitSlop={12}
      style={[{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Icon
        name="bookmark"
        size={size}
        color={saved ? t.colors.accentDark : t.colors.textSecondary}
        fill={saved ? t.colors.accent : 'none'}
      />
    </Pressable>
  );
}
