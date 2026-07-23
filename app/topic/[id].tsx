import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { SecondaryAction } from '@/components/learning/SecondaryAction';
import { Icon } from '@/components/ui/Icon';
import { Button, Card, ProgressBar, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';

type LessonState = 'completed' | 'current' | 'locked';

/** Topic Detail — mockup frame "Topic Detail". */
export default function TopicDetailScreen() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTopic } = useContent();
  const progress = useProgress();

  const topic = getTopic(id);
  const stats = progress.topicStats(id);
  const hasReview = progress.reviewQueue.length > 0;

  if (!topic) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 }}>
          <Txt size={16} weight="600">
            Topic not found
          </Txt>
          <Button label="Back to topics" variant="secondary" fullWidth={false} onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  const lessons = Array.from({ length: stats.totalLessons }, (_, i): { index: number; state: LessonState } => ({
    index: i,
    state: i < stats.completedLessons ? 'completed' : i === stats.completedLessons ? 'current' : 'locked',
  }));

  const statusText: Record<LessonState, string> = {
    completed: 'Completed',
    current: stats.completedLessons > 0 ? 'In progress' : 'Not started',
    locked: 'Not started',
  };

  return (
    <Screen>
      {/* Nav bar */}
      <Row style={{ height: 52, paddingHorizontal: 20 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          hitSlop={8}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.surface,
              borderWidth: 1,
              borderColor: t.colors.border,
            }}
          >
            <Icon name="chevron-left" size={20} color={t.colors.textPrimary} />
          </View>
        </Pressable>
      </Row>

      <ScreenScroll contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, gap: 24 }}>
        {/* Hero */}
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.blue800,
              borderBottomWidth: 4,
              borderBottomColor: t.colors.blue900,
              shadowColor: t.colors.blue900,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Icon name={topic.icon} size={42} color={t.colors.textInverse} />
          </View>

          <Txt size={24} weight="700">
            {topic.name}
          </Txt>

          <View style={{ width: 220, alignItems: 'center', gap: 6 }}>
            <ProgressBar value={stats.total ? stats.mastered / stats.total : 0} />
            <Txt size={12} color={t.colors.textSecondary}>
              {stats.mastered}/{stats.total} questions mastered
            </Txt>
          </View>
        </View>

        {/* Stats */}
        <Row style={{ gap: 12, alignItems: 'stretch' }}>
          <Card radius={t.radius.md} padding={14} gap={6} style={{ flex: 1 }}>
            <Row style={{ gap: 6 }}>
              <Icon name="target" size={16} color={t.colors.onSurfaceAlt} />
              <Txt size={12} color={t.colors.textSecondary}>
                Accuracy
              </Txt>
            </Row>
            <Txt size={20} weight="700">
              {stats.accuracy}%
            </Txt>
          </Card>

          <Card radius={t.radius.md} padding={14} gap={6} style={{ flex: 1 }}>
            <Row style={{ gap: 6 }}>
              <Icon name="trending-down" size={16} color={t.colors.error} />
              <Txt size={12} color={t.colors.textSecondary}>
                Weakest topic
              </Txt>
            </Row>
            <Txt size={16} weight="700">
              {stats.weakestSubtopic ?? 'None yet'}
            </Txt>
          </Card>
        </Row>

        {/* Lessons */}
        <View style={{ gap: 12 }}>
          <Txt size={16} weight="700">
            Lessons
          </Txt>

          <View style={{ gap: 10 }}>
            {lessons.map(({ index, state }) => {
              const actionable = state === 'current';
              const badge = {
                completed: { bg: t.colors.blue800, edge: t.colors.blue900, edgeWidth: 3, fg: t.colors.onBlue },
                current: { bg: t.colors.sage100, edge: t.colors.accent, edgeWidth: 2, fg: t.colors.accentDark },
                locked: { bg: t.colors.sage50, edge: t.colors.border, edgeWidth: 2, fg: t.colors.textMuted },
              }[state];

              return (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityLabel={`Lesson ${index + 1}, ${statusText[state]}`}
                  accessibilityState={{ disabled: !actionable }}
                  disabled={!actionable}
                  onPress={() => router.push(`/lesson/${topic.id}`)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    minHeight: 60,
                    borderRadius: t.radius.md,
                    backgroundColor: t.colors.sage50,
                    borderWidth: 1,
                    borderColor: t.colors.sage100,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: badge.bg,
                      borderBottomWidth: badge.edgeWidth,
                      borderBottomColor: badge.edge,
                    }}
                  >
                    {state === 'completed' ? (
                      <Icon name="check" size={16} color={badge.fg} />
                    ) : (
                      <Txt size={13} weight="700" color={badge.fg}>
                        {index + 1}
                      </Txt>
                    )}
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Txt size={14} weight="600">
                      Lesson {index + 1}
                    </Txt>
                    <Txt size={12} color={t.colors.textSecondary}>
                      {statusText[state]}
                    </Txt>
                  </View>

                  {actionable ? <Icon name="chevron-right" size={18} color={t.colors.textMuted} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScreenScroll>

      {/* Actions */}
      <View
        style={{
          gap: 10,
          paddingTop: 14,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: t.colors.bg,
          borderTopWidth: 1,
          borderTopColor: t.colors.border,
        }}
      >
        <Button
          label={stats.completed ? 'Practise again' : 'Start next lesson'}
          onPress={() =>
            router.push(
              stats.completed
                ? { pathname: '/lesson/[topicId]', params: { topicId: topic.id, lessonIndex: '0' } }
                : `/lesson/${topic.id}`,
            )
          }
        />
        {hasReview ? (
          <SecondaryAction label="Review mistakes" onPress={() => router.push('/weak-spots')} />
        ) : null}
      </View>
    </Screen>
  );
}
