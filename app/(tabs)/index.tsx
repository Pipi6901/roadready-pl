import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { cardShadow } from '@/components/practice/shadow';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Card, Pill, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { DAILY_GOAL_LESSONS } from '@/constants/rules';
import { useT } from '@/features/i18n/useT';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Home — mockup frame "Pulpit · GO".
 *
 * Four doors, two rows: learn by section and the exam on top, then the two
 * lists the learner builds for themselves — saved questions and wrong
 * answers. The old "Continue learning" card is gone: with nothing locked on
 * the Learn map any more (see TopicStats.started) there is no single next
 * lesson to push, and the section card carries the progress figure instead.
 * The daily goal and the countdown stay below the grid — they are what
 * brings the learner back tomorrow, and the mockup only folds them away.
 */
export default function HomeScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { daysUntilExam } = useSettings();
  const { topics } = useContent();
  const progress = useProgress();

  const sectionsDone = progress.allTopicStats().filter((s) => s.completed).length;
  const mockAttempts = progress.state.mockAttempts.length;
  const savedCount = progress.savedQuestionIds.length;
  const weakSpots = progress.reviewQueue.length;

  return (
    <Screen>
      <ScreenScroll contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 18 }}>
        {/* Title row */}
        <Row style={{ justifyContent: 'space-between', gap: 10, paddingVertical: 4 }}>
          <View style={{ gap: 1 }}>
            <Txt size={26} weight="800">
              {tr('home.title')}
            </Txt>
            <Txt size={14} color={t.colors.textSecondary}>
              {tr('home.category')}
            </Txt>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tr('settings.title')}
            onPress={() => router.push('/settings')}
            hitSlop={12}
            style={{ width: 44, height: 44, alignItems: 'flex-end', justifyContent: 'center' }}
          >
            <Icon name="settings" size={22} color={t.colors.textSecondary} />
          </Pressable>
        </Row>

        <Row style={{ gap: 12 }}>
          <Pill icon="flame" label={tr('home.streak', { days: progress.state.streakDays })} />
          <Pill icon="star" label={`${progress.state.totalXp.toLocaleString('en-GB')} XP`} />
        </Row>

        {/* NAUKA */}
        <View style={{ gap: 10 }}>
          <Txt size={11} weight="700" color={t.colors.textMuted}>
            {tr('home.sectionLearn')}
          </Txt>
          <Row style={{ gap: 12, alignItems: 'stretch' }}>
            <HomeCard
              icon="book-open"
              tint={t.colors.blue900}
              badgeBg={t.colors.sage50}
              badgeFg={t.colors.blue800}
              title={tr('home.card.topics')}
              subtitle={
                sectionsDone
                  ? tr('home.card.topicsProgress', { done: sectionsDone, total: topics.length })
                  : tr('home.card.topicsSub', { count: topics.length })
              }
              onPress={() => router.push('/(tabs)/learn')}
            />
            <HomeCard
              icon="clipboard-check"
              tint={t.colors.blue800}
              badgeBg={t.colors.sage50}
              badgeFg={t.colors.accentDark}
              title={tr('home.card.exam')}
              subtitle={
                mockAttempts
                  ? tr('home.card.examAttempts', { count: mockAttempts })
                  : tr('home.card.examSub')
              }
              onPress={() => router.push('/mock/setup')}
            />
          </Row>
        </View>

        {/* ĆWICZENIA */}
        <View style={{ gap: 10 }}>
          <Txt size={11} weight="700" color={t.colors.textMuted}>
            {tr('home.sectionPractice')}
          </Txt>
          <Row style={{ gap: 12, alignItems: 'stretch' }}>
            <HomeCard
              icon="bookmark"
              tint={t.colors.success}
              badgeBg={t.colors.successBg}
              badgeFg={t.colors.successDark}
              title={tr('home.card.saved')}
              subtitle={
                savedCount ? tr('home.card.savedCount', { count: savedCount }) : tr('home.card.savedSub')
              }
              onPress={() => router.push('/saved')}
            />
            <HomeCard
              icon="circle-x"
              tint={t.colors.accent}
              badgeBg={t.colors.sage50}
              badgeFg={t.colors.accentDark}
              title={tr('home.card.mistakes')}
              subtitle={
                weakSpots ? tr('home.card.mistakesCount', { count: weakSpots }) : tr('home.card.mistakesSub')
              }
              onPress={() => router.push('/weak-spots')}
            />
          </Row>
        </View>

        {/* Daily goal + countdown */}
        <View style={{ gap: 12 }}>
          <Txt size={16} weight="700">
            {tr('home.dailyGoal')}
          </Txt>

          <Card>
            <Row style={{ gap: 16 }}>
              <ProgressRing
                value={progress.lessonsToday / DAILY_GOAL_LESSONS}
                current={Math.min(progress.lessonsToday, DAILY_GOAL_LESSONS)}
                max={DAILY_GOAL_LESSONS}
              />
              <View style={{ flex: 1, gap: 4 }}>
                <Txt size={14} weight="600">
                  {tr('home.lessonsToday', {
                    done: Math.min(progress.lessonsToday, DAILY_GOAL_LESSONS),
                    goal: DAILY_GOAL_LESSONS,
                  })}
                </Txt>
                <Txt size={12} color={t.colors.textSecondary}>
                  {progress.goalMet ? tr('home.goalMet') : tr('home.goalHint', { goal: DAILY_GOAL_LESSONS })}
                </Txt>
              </View>
            </Row>
          </Card>

          {daysUntilExam !== null ? (
            <Card bg={t.colors.sage100} borderColor={t.colors.sage100}>
              <Row style={{ gap: 12 }}>
                <Icon name="target" size={24} color={t.colors.onSurfaceAlt} />
                <View style={{ gap: 2 }}>
                  <Txt size={14} weight="600">
                    {tr('home.examIn', { days: daysUntilExam })}
                  </Txt>
                  <Txt size={12} color={t.colors.textSecondary}>
                    {tr('home.readiness', { percent: progress.readiness })}
                  </Txt>
                </View>
              </Row>
            </Card>
          ) : null}
        </View>
      </ScreenScroll>
    </Screen>
  );
}

/* ------------------------------------------------------------- home card --- */

interface HomeCardProps {
  icon: IconName;
  /** The swoosh — the block of colour on the card's right edge. */
  tint: string;
  badgeBg: string;
  badgeFg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/** One of the four doors — mockup frames "Nauka według działów" and siblings:
 *  a white 152pt card, a small tinted badge top-left, the title and its line
 *  pinned to the bottom, and a coloured ellipse bleeding off the right edge. */
function HomeCard({ icon, tint, badgeBg, badgeFg, title, subtitle, onPress }: HomeCardProps) {
  const t = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          height: 152,
          padding: 14,
          borderRadius: 16,
          overflow: 'hidden',
          justifyContent: 'space-between',
          backgroundColor: t.colors.surface,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: t.colors.sage100,
          transform: [{ translateY: pressed ? 1 : 0 }],
        },
        cardShadow(t),
      ]}
    >
      {/* Kept to the top-right corner, clear of the text block: on a 160pt
          card the mockup's full-height ellipse would run under the title. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: -46,
          top: -58,
          width: 128,
          height: 128,
          borderRadius: 64,
          backgroundColor: tint,
        }}
      />

      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: badgeBg,
        }}
      >
        <Icon name={icon} size={20} color={badgeFg} />
      </View>

      <View style={{ gap: 6 }}>
        <Txt size={15} weight="800">
          {title}
        </Txt>
        <Txt size={12} color={t.colors.textSecondary}>
          {subtitle}
        </Txt>
      </View>
    </Pressable>
  );
}
