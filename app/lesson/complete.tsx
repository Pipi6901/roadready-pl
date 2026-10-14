import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { SecondaryAction } from '@/components/learning/SecondaryAction';
import { CountUpText } from '@/components/ui/CountUpText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button, ProgressBar, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { DAILY_GOAL_LESSONS } from '@/constants/rules';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/features/i18n/useT';

const HERO = 140;
const BADGE = 120;
const BURST_DOTS = 12;

/** Confetti positions from the mockup's "Confetti Layer", as ratios of the layer box. */
const CONFETTI = [
  { size: 10, xr: 0.08, yr: 0.10, tone: 'warning' },
  { size: 8, xr: 0.80, yr: 0.20, tone: 'sage100' },
  { size: 7, xr: 0.16, yr: 0.55, tone: 'accent' },
  { size: 6, xr: 0.67, yr: 0.08, tone: 'error' },
  { size: 9, xr: 0.88, yr: 0.60, tone: 'warning' },
  { size: 8, xr: 0.04, yr: 0.85, tone: 'sage100' },
  { size: 6, xr: 0.91, yr: 0.95, tone: 'accent' },
  { size: 6, xr: 0.53, yr: 0.03, tone: 'sage100' },
  { size: 7, xr: 0.27, yr: 1.0, tone: 'warning' },
] as const;

export default function LessonCompleteScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const progress = useProgress();
  const params = useLocalSearchParams<{
    topicId?: string; total?: string; correct?: string; xp?: string; achievement?: string;
  }>();

  const total = Number(params.total ?? 0);
  const correct = Number(params.correct ?? 0);
  const xp = Number(params.xp ?? 0);
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const perfect = total > 0 && correct === total;
  const hasReview = progress.reviewQueue.length > 0;

  // Where "next" leads. The topic just played may have lessons left; if it
  // does not, the next unfinished topic on the map does — and when nothing is
  // left anywhere, the button has no destination and is not shown. Sending
  // the learner back into the finished topic used to land on the lesson
  // screen's "No lessons left" dead end, which is not what "next" means.
  const stats = params.topicId ? progress.topicStats(params.topicId) : null;
  const nextTopicId = stats && !stats.completed ? params.topicId : progress.nextTopicId;

  // Surface the celebration once this screen itself has landed, rather than
  // racing it during the replace() that brought the learner here.
  React.useEffect(() => {
    if (params.achievement) {
      router.push({ pathname: '/achievement', params: { ids: params.achievement } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.achievement]);

  const confettiTone: Record<string, string> = {
    warning: t.colors.warning,
    sage100: t.colors.sage100,
    accent: t.colors.accent,
    error: t.colors.error,
  };

  const chips: {
    icon: IconName; value: number; suffix?: string; celebrate?: boolean; label: string;
    bg: string; edge: string; fg: string;
  }[] = [
    {
      icon: 'check',
      value: total,
      label: tr('summary.exercises'),
      bg: t.colors.successBg,
      edge: t.colors.success,
      fg: t.colors.successDark,
    },
    {
      icon: 'zap',
      value: xp,
      celebrate: perfect,
      label: tr('summary.xpEarned'),
      bg: t.colors.amber50,
      edge: t.colors.amber,
      fg: t.colors.amber,
    },
    {
      icon: 'target',
      value: accuracy,
      suffix: '%',
      celebrate: accuracy === 100,
      label: tr('summary.accuracy'),
      bg: t.colors.sage100,
      edge: t.colors.onSurfaceAlt,
      fg: t.colors.onSurfaceAlt,
    },
  ];

  return (
    <Screen>
      {/* Confetti sits behind the hero */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ pointerEvents: 'none', position: 'absolute', left: 0, right: 0, top: 0, height: 200, overflow: 'hidden' }}
      >
        {CONFETTI.map((c, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: `${c.xr * 100}%`,
              top: `${c.yr * 100}%`,
              width: c.size,
              height: c.size,
              borderRadius: c.size / 2,
              backgroundColor: confettiTone[c.tone],
            }}
          />
        ))}
      </View>

      <ScreenScroll contentContainerStyle={{ paddingHorizontal: 24, gap: 20, alignItems: 'center' }}>
        {/* Hero: sunburst + trophy badge + sparkles */}
        <View style={{ width: HERO, height: HERO, marginTop: 8 }}>
          {Array.from({ length: BURST_DOTS }, (_, i) => {
            const angle = (i / BURST_DOTS) * Math.PI * 2;
            const size = i % 2 === 0 ? 7 : 5;
            const r = HERO / 2 - size / 2;
            return (
              <View
                key={i}
                style={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  left: HERO / 2 + r * Math.cos(angle) - size / 2,
                  top: HERO / 2 + r * Math.sin(angle) - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: i % 2 === 0 ? t.colors.amber : t.colors.accent,
                }}
              />
            );
          })}

          <View
            style={{
              position: 'absolute',
              left: (HERO - BADGE) / 2,
              top: (HERO - BADGE) / 2,
              width: BADGE,
              height: BADGE,
              borderRadius: BADGE / 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
              borderWidth: 4,
              borderColor: t.colors.accent,
              shadowColor: t.colors.blue900,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Icon name="trophy" size={60} color={t.colors.onSurfaceAlt} />
          </View>

          <View style={{ position: 'absolute', left: 0, top: 0 }}>
            <Icon name="sparkles" size={22} color={t.colors.amber} />
          </View>
          <View style={{ position: 'absolute', left: HERO - 28, top: 14 }}>
            <Icon name="sparkles" size={18} color={t.colors.accent} />
          </View>
        </View>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <Txt size={24} weight="700" align="center">
            {tr('lesson.completeTitle')}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" style={{ maxWidth: 260 }}>
            {tr('lesson.completeSubtitle')}
          </Txt>
        </View>

        {/* Achievement pills */}
        <Row style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {perfect ? (
            <Row
              accessible
              accessibilityLabel={tr('lesson.perfect')}
              style={{
                gap: 6,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: t.colors.amber50,
              }}
            >
              <Icon name="star" size={15} color={t.colors.amber} />
              <Txt size={13} weight="700" color={t.colors.amberDark}>
                {tr('lesson.perfect')}
              </Txt>
            </Row>
          ) : null}

          <Row
            accessible
            accessibilityLabel={`${progress.streak} day streak`}
            style={{
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              backgroundColor: t.colors.amber50,
            }}
          >
            <Icon name="flame" size={15} color={t.colors.amberDark} />
            <Txt size={13} weight="700" color={t.colors.amberDark}>
              {tr(progress.streak === 1 ? 'home.streak.one' : 'home.streak', { days: progress.streak })}
            </Txt>
          </Row>
        </Row>

        {/* Stats */}
        <Row style={{ gap: 10, alignSelf: 'stretch', alignItems: 'stretch' }}>
          {chips.map((chip) => (
            <View
              key={chip.label}
              accessible
              accessibilityLabel={`${chip.label}: ${chip.value}${chip.suffix ?? ''}`}
              style={{
                flex: 1,
                gap: 4,
                padding: 12,
                alignItems: 'center',
                borderRadius: t.radius.md,
                backgroundColor: t.colors.surface,
                borderWidth: 1,
                borderColor: t.colors.sage100,
                shadowColor: t.colors.blue900,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.07,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: chip.bg,
                  borderBottomWidth: 2,
                  borderBottomColor: chip.edge,
                }}
              >
                <Icon name={chip.icon} size={14} color={chip.fg} />
              </View>
              <CountUpText value={chip.value} suffix={chip.suffix} celebrate={chip.celebrate} size={17} />
              <Txt size={11} color={t.colors.textSecondary}>
                {chip.label}
              </Txt>
            </View>
          ))}
        </Row>

        {/* Daily goal */}
        <View style={{ alignSelf: 'stretch', gap: 8 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt size={12} weight="600" color={t.colors.textSecondary}>
              {tr('home.dailyGoal')}
            </Txt>
            <Txt size={12} weight="600" color={t.colors.textSecondary}>
              {tr('lesson.goalProgress', {
                done: Math.min(progress.lessonsToday, DAILY_GOAL_LESSONS),
                goal: DAILY_GOAL_LESSONS,
              })}
            </Txt>
          </Row>
          <ProgressBar value={progress.lessonsToday / DAILY_GOAL_LESSONS} />
        </View>
      </ScreenScroll>

      {/* Actions */}
      <View style={{ gap: 10, paddingTop: 14, paddingHorizontal: 24, paddingBottom: 24 }}>
        {nextTopicId ? (
          <Button
            label={tr(nextTopicId === params.topicId ? 'lesson.continueNext' : 'lesson.nextSection')}
            onPress={() => router.replace(`/lesson/${nextTopicId}`)}
          />
        ) : null}
        {hasReview ? (
          <SecondaryAction label={tr('lesson.reviewMistakes')} onPress={() => router.replace('/weak-spots')} />
        ) : null}
        <Button label={tr('lesson.backToTopics')} variant="ghost" onPress={() => router.replace('/(tabs)/learn')} />
      </View>
    </Screen>
  );
}
