import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Button, Card, Pill, ProgressBar, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { DAILY_GOAL_LESSONS } from '@/constants/rules';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Dashboard — mockup frame "Dashboard". */
export default function DashboardScreen() {
  const t = useTheme();
  const router = useRouter();
  const { displayName, daysUntilExam } = useSettings();
  const { topics, getTopic } = useContent();
  const progress = useProgress();

  const nextTopicId = progress.nextTopicId ?? topics[0]?.id;
  const topic = nextTopicId ? getTopic(nextTopicId) : undefined;
  const stats = nextTopicId ? progress.topicStats(nextTopicId) : null;

  // Which of the last 7 days had the goal met — drives the streak calendar.
  const streakDays = React.useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return DAY_LABELS.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const entry = progress.state.daily[key];
      return { label, done: (entry?.lessons ?? 0) >= DAILY_GOAL_LESSONS };
    });
  }, [progress.state.daily]);

  return (
    <Screen>
      <ScreenScroll>
        {/* Header panel — sage50, rounded bottom corners, soft shadow */}
        <View
          style={{
            backgroundColor: t.colors.sage50,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            paddingHorizontal: 20,
            paddingBottom: 22,
            gap: 16,
          }}
        >
          <Txt size={22} weight="700">
            {greeting()}, {displayName}
          </Txt>

          <Row style={{ gap: 12 }}>
            <Pill icon="flame" label={`${progress.state.streakDays} day streak`} />
            <Pill icon="star" label={`${progress.state.totalXp.toLocaleString('en-GB')} XP`} />
          </Row>

          <Row style={{ justifyContent: 'space-between' }}>
            {streakDays.map((day, i) => (
              <View
                key={`${day.label}-${i}`}
                accessible
                accessibilityLabel={`${day.label}, ${day.done ? 'goal met' : 'goal not met'}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: day.done ? t.colors.amber : t.colors.surface,
                  borderBottomWidth: day.done ? 3 : 2,
                  borderBottomColor: day.done ? t.colors.amberDark : t.colors.border,
                }}
              >
                <Txt size={11} weight="600" color={day.done ? '#FFFFFF' : t.colors.textMuted}>
                  {day.label}
                </Txt>
              </View>
            ))}
          </Row>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 24 }}>
          <View style={{ gap: 12 }}>
            <Txt size={16} weight="700">
              Continue Learning
            </Txt>

            <Card gap={12}>
              <Row style={{ gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: t.radius.sm,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: t.colors.sage100,
                    borderBottomWidth: 3,
                    borderBottomColor: t.colors.sage200,
                  }}
                >
                  <Icon name={topic?.icon ?? 'signpost'} size={22} color={t.colors.onSurfaceAlt} />
                </View>
                <Txt size={16} weight="600">
                  {topic?.name ?? 'Road Signs'}
                </Txt>
              </Row>

              <ProgressBar value={stats && stats.totalLessons ? stats.completedLessons / stats.totalLessons : 0} />

              <Txt size={13} color={t.colors.textSecondary}>
                {stats ? `${stats.completedLessons}/${stats.totalLessons} lessons complete` : 'Not started'}
              </Txt>

              <Button
                label="Continue"
                onPress={() => nextTopicId && router.push(`/lesson/${nextTopicId}`)}
              />
            </Card>
          </View>

          <View style={{ gap: 12 }}>
            <Txt size={16} weight="700">
              Daily Goal
            </Txt>

            <Card>
              <Row style={{ gap: 16 }}>
                <ProgressRing
                  value={progress.lessonsToday / DAILY_GOAL_LESSONS}
                  label={`${progress.lessonsToday}/${DAILY_GOAL_LESSONS}`}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Txt size={14} weight="600">
                    {progress.lessonsToday}/{DAILY_GOAL_LESSONS} lessons done today
                  </Txt>
                  <Txt size={12} color={t.colors.textSecondary}>
                    {progress.goalMet
                      ? 'Goal complete — your streak is safe'
                      : `Complete ${DAILY_GOAL_LESSONS} lessons today to keep your streak`}
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
                      Your test is in {daysUntilExam} days
                    </Txt>
                    <Txt size={12} color={t.colors.textSecondary}>
                      You&apos;re {progress.readiness}% ready
                    </Txt>
                  </View>
                </Row>
              </Card>
            ) : null}
          </View>
        </View>
      </ScreenScroll>
    </Screen>
  );
}
