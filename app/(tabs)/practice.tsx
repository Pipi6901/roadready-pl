import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { PracticeCard, type PracticeCardBadge } from '@/components/practice/PracticeCard';
import { Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { QUICK_QUIZ_SIZE } from '@/constants/rules';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { HAZARD_ENABLED, useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Practice Hub — mockup frame "Practice Hub". */
export default function PracticeScreen() {
  const t = useTheme();
  const router = useRouter();
  const { country } = useContent();
  const progress = useProgress();
  const { can } = useSubscription();

  const { questionCount, timeLimitMinutes } = country.mockTest;
  const mockAttempts = progress.state.mockAttempts.length;
  const weakSpots = progress.reviewQueue.length;

  const proBadge: PracticeCardBadge = {
    icon: 'crown',
    label: 'Pro',
    bg: t.colors.amber50,
    fg: t.colors.amberDark,
  };

  const mockBadges: PracticeCardBadge[] = [
    {
      icon: 'check',
      label: `${mockAttempts} completed`,
      bg: t.colors.sage100,
      fg: t.colors.onSurfaceAlt,
    },
  ];
  if (!can('mock_test')) mockBadges.push(proBadge);

  const weakBadges: PracticeCardBadge[] = [
    {
      icon: 'target',
      label: weakSpots ? `${weakSpots} questions` : 'No mistakes yet',
      bg: t.colors.successBg,
      fg: t.colors.successText,
    },
  ];
  if (weakSpots && !can('weak_spots')) weakBadges.push(proBadge);

  return (
    <Screen>
      <ScreenScroll contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 20 }}>
        <Txt size={26} weight="700">
          Practice
        </Txt>

        <View style={{ gap: 14 }}>
          <PracticeCard
            icon="clipboard-check"
            iconBg={t.colors.blue800}
            iconEdge={t.colors.blue900}
            title="Mock Test"
            subtitle={`Simulate the real exam — ${questionCount} questions, ${timeLimitMinutes} minutes`}
            badges={mockBadges}
            onPress={() => router.push('/mock/setup')}
          />

          <PracticeCard
            icon="zap"
            iconBg={t.colors.amber}
            iconEdge={t.colors.amberDark}
            title="Quick Quiz"
            subtitle={`${QUICK_QUIZ_SIZE} random questions — fast practice`}
            onPress={() => router.push('/quiz')}
          />

          {/*
           * Hazard Perception is built but dark in the MVP (ADR-006): the clip
           * pack is not licensed yet, and advertising a feature that cannot run
           * is an App Review rejection waiting to happen.
           */}
          <PracticeCard
            icon="video"
            iconBg={t.colors.terracotta}
            iconEdge={t.colors.terracottaDark}
            title="Hazard Perception"
            subtitle="Practice spotting hazards in video clips"
            badges={[
              {
                icon: 'calendar-clock',
                label: 'Coming soon',
                bg: t.colors.terracotta50,
                fg: t.colors.terracottaDark,
              },
            ]}
            disabled={!HAZARD_ENABLED}
            onPress={() => router.push('/hazard/1')}
          />

          <PracticeCard
            icon="target"
            iconBg={t.colors.success}
            iconEdge={t.colors.successDark}
            title="Your Weak Spots"
            subtitle="Questions you got wrong — adaptive review"
            badges={weakBadges}
            disabled={weakSpots === 0}
            onPress={() => router.push('/weak-spots')}
          />
        </View>
      </ScreenScroll>
    </Screen>
  );
}
