import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { QuestionRunner } from '@/components/practice/QuestionRunner';
import { Icon } from '@/components/ui/Icon';
import { Button, Screen, Txt } from '@/components/ui/primitives';
import { QUICK_QUIZ_SIZE } from '@/constants/rules';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import type { DisplayQuestion } from '@/types/content';

/**
 * Weak Spots — the card scenario over the review queue.
 *
 * With `?questionId=` it reviews that single question, which is how the
 * per-mistake "Review" links on the results screen land here.
 */
export default function WeakSpotsScreen() {
  const t = useTheme();
  const router = useRouter();
  const { questionId } = useLocalSearchParams<{ questionId?: string }>();
  const { getQuestion } = useContent();
  const progress = useProgress();

  const backToPractice = () => router.replace('/practice');

  // Snapshot on mount: answering rewrites reviewQueue, and the list must not
  // reshuffle under the user mid-session.
  const questions = React.useMemo<DisplayQuestion[]>(() => {
    const ids = questionId ? [questionId] : progress.reviewQueue.slice(0, QUICK_QUIZ_SIZE);
    return ids
      .map((id) => getQuestion(id))
      .filter((q): q is DisplayQuestion => !!q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  if (!questions.length) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.successBg,
            }}
          >
            <Icon name="target" size={44} color={t.colors.successText} />
          </View>
          <Txt size={20} weight="700" align="center">
            No mistakes to review — nice work
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" style={{ maxWidth: 280 }}>
            Questions you get wrong land here automatically, ready for a second look.
          </Txt>
          <Button label="Back to Practice" onPress={backToPractice} />
        </View>
      </Screen>
    );
  }

  return (
    <QuestionRunner
      questions={questions}
      summaryTitle="Review complete!"
      summarySubtitle="Answer a question correctly twice in a row and it leaves your weak spots."
      onExit={backToPractice}
      exitLabel="Back to Practice"
    />
  );
}
