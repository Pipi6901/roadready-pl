import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { ProLocked } from '@/components/ProLocked';
import { QuestionRunner } from '@/components/practice/QuestionRunner';
import { Icon } from '@/components/ui/Icon';
import { Button, Screen, Txt } from '@/components/ui/primitives';
import { QUICK_QUIZ_SIZE } from '@/constants/rules';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/features/i18n/useT';
import type { DisplayQuestion } from '@/types/content';

/** How many of the worst-performing questions to draw a random session from.
 *  Wide enough that a big backlog still rotates, narrow enough that a session
 *  never dilutes into questions that are barely wrong. */
const REVIEW_POOL_SIZE = 30;

function shuffledIds(ids: string[]): string[] {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Weak Spots — the card scenario over the review queue.
 *
 * With `?questionId=` it reviews that single question, which is how the
 * per-mistake "Review" links on the results screen land here.
 */
export default function WeakSpotsScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { questionId } = useLocalSearchParams<{ questionId?: string }>();
  const { getQuestion } = useContent();
  const progress = useProgress();
  const { can } = useSubscription();

  const backToPractice = () => router.replace('/practice');

  // Snapshot once progress has actually loaded — not on the very first
  // render, which can land before persisted state finishes reading from
  // storage (progress.ready still false, reviewQueue still empty). Freezing
  // on that premature value showed "no mistakes" forever for the rest of the
  // session, even once real data arrived a moment later. Recomputing when
  // `ready` flips to true fixes that, while still not reshuffling further
  // once the session is actually underway — answering rewrites reviewQueue,
  // and the list must not shift under the user mid-session.
  //
  // reviewQueue is sorted worst-first; always slicing the first 10 meant a
  // backlog bigger than that never got past its worst 10 — anything ranked
  // 11th or lower was practically stuck, since nothing before it ever fully
  // clears in one pass. Instead, draw a random 10 from the worst 30 each
  // time, so repeat visits surface different mistakes rather than the same
  // ones forever, while still staying weighted toward the genuinely weak end.
  const questions = React.useMemo<DisplayQuestion[]>(() => {
    const ids = questionId
      ? [questionId]
      : shuffledIds(progress.reviewQueue.slice(0, REVIEW_POOL_SIZE)).slice(0, QUICK_QUIZ_SIZE);
    return ids
      .map((id) => getQuestion(id))
      .filter((q): q is DisplayQuestion => !!q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, progress.ready]);

  if (!can('weak_spots')) {
    return (
      <ProLocked
        feature="weak_spots"
        icon="trending-down"
        title={tr('weak.proTitle')}
        body={tr('weak.proBody')}
      />
    );
  }

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
            {tr('weak.none')}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" style={{ maxWidth: 280 }}>
            {tr('weak.emptyBody')}
          </Txt>
          <Button label={tr('mock.backToPractice')} onPress={backToPractice} />
        </View>
      </Screen>
    );
  }

  return (
    <QuestionRunner
      questions={questions}
      summaryTitle={tr('weak.completeTitle')}
      summarySubtitle={tr('weak.completeSubtitle')}
      onExit={backToPractice}
      exitLabel={tr('mock.backToPractice')}
    />
  );
}
