import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SoftButton } from '@/components/practice/SoftButton';
import { Icon } from '@/components/ui/Icon';
import { Button, ProgressBar, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { mockSession, requiredToPass } from '@/features/practice/mockSession';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Mock Test Results — mockup frame "Mock Test Results". */
export default function MockResultsScreen() {
  const t = useTheme();
  const router = useRouter();
  const { country, getTopic, getQuestion } = useContent();
  const progress = useProgress();
  const { achievement } = useLocalSearchParams<{ achievement?: string }>();

  const attempt = progress.state.mockAttempts[0];

  React.useEffect(() => {
    if (!attempt) router.replace('/mock/setup');
  }, [attempt, router]);

  // Surface the celebration once the results screen itself has landed,
  // rather than racing it during the replace() from useSubmitMock.
  React.useEffect(() => {
    if (achievement) router.push({ pathname: '/achievement', params: { ids: achievement } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievement]);

  if (!attempt) return <Screen />;

  const required = requiredToPass(country.mockTest, attempt.total);
  const verdictColor = attempt.passed ? t.colors.successText : t.colors.error;
  const verdictBg = attempt.passed ? t.colors.successBg : t.colors.errorBg;

  const topicRows = Object.entries(attempt.perTopic)
    .map(([topicId, stat]) => ({
      topicId,
      name: getTopic(topicId)?.name ?? topicId,
      pct: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
    }))
    .sort((a, b) => a.pct - b.pct);

  const mistakes = attempt.wrongQuestionIds.map((id) => {
    const question = getQuestion(id);
    const position = mockSession.indexOf(id);
    return {
      id,
      position,
      topicName: question ? (getTopic(question.topicId)?.name ?? question.topicId) : 'Question',
      subtopic: question?.subtopic ?? null,
    };
  });

  return (
    <Screen>
      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4, gap: 14 }}
      >
        <View style={{ alignItems: 'center', gap: 8, paddingTop: 2 }}>
          <ProgressRing
            value={attempt.total ? attempt.score / attempt.total : 0}
            current={attempt.score}
            max={attempt.total}
            size={120}
            thickness={12}
            labelSize={26}
            fillColor={verdictColor}
          />

          {/* Icon + word carry the verdict; the colour only reinforces it. */}
          <Row
            accessible
            accessibilityLabel={`${attempt.passed ? 'Passed' : 'Failed'}. Score ${attempt.score} out of ${attempt.total}`}
            style={{
              gap: 6,
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 16,
              backgroundColor: verdictBg,
            }}
          >
            <Icon name={attempt.passed ? 'circle-check' : 'circle-x'} size={16} color={verdictColor} />
            <Txt size={14} weight="700" color={verdictColor}>
              {attempt.passed ? 'Passed!' : 'Not passed'}
            </Txt>
          </Row>

          <Txt size={12} color={t.colors.textSecondary}>
            {required}/{attempt.total} needed to pass
          </Txt>
        </View>

        <View style={{ gap: 7 }}>
          <Txt size={15} weight="700">
            Accuracy by topic
          </Txt>

          {topicRows.map((row) => (
            <View
              key={row.topicId}
              accessible
              accessibilityLabel={`${row.name}, ${row.pct} percent correct`}
              style={{ gap: 4 }}
            >
              <Row style={{ justifyContent: 'space-between' }}>
                <Txt size={13}>{row.name}</Txt>
                <Txt size={13} weight="700">
                  {row.pct}%
                </Txt>
              </Row>
              <ProgressBar
                value={row.pct / 100}
                height={7}
                fillColor={row.pct >= 80 ? t.colors.success : t.colors.amber}
              />
            </View>
          ))}
        </View>

        {mistakes.length ? (
          <View style={{ gap: 10 }}>
            <Txt size={15} weight="700">
              Incorrect answers ({mistakes.length})
            </Txt>

            {mistakes.map((mistake) => (
              <Pressable
                key={mistake.id}
                accessibilityRole="button"
                accessibilityLabel={`Review ${mistake.topicName}${mistake.subtopic ? `, ${mistake.subtopic}` : ''}`}
                onPress={() => router.push({ pathname: '/weak-spots', params: { questionId: mistake.id } })}
                style={{
                  gap: 10,
                  padding: 14,
                  borderRadius: t.radius.md,
                  backgroundColor: t.colors.surface,
                  borderWidth: StyleSheet.hairlineWidth * 2,
                  borderColor: t.colors.border,
                }}
              >
                <Row style={{ gap: 10, alignItems: 'flex-start' }}>
                  {mistake.position >= 0 ? (
                    <Txt size={13} weight="700" color={t.colors.error}>
                      Q{mistake.position + 1}
                    </Txt>
                  ) : null}
                  <Txt size={13} style={{ flex: 1 }}>
                    {mistake.topicName}
                    {mistake.subtopic ? ` — ${mistake.subtopic}` : ''}
                  </Txt>
                </Row>
                <Row style={{ gap: 2, justifyContent: 'flex-end' }}>
                  <Txt size={12} weight="700" color={t.colors.onSurfaceAlt}>
                    Review
                  </Txt>
                  <Icon name="chevron-right" size={14} color={t.colors.onSurfaceAlt} />
                </Row>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScreenScroll>

      <View
        style={{
          gap: 8,
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 20,
          borderTopWidth: StyleSheet.hairlineWidth * 2,
          borderTopColor: t.colors.border,
        }}
      >
        <Button
          label="Review All Mistakes"
          disabled={!mistakes.length}
          onPress={() => router.replace('/weak-spots')}
        />
        <SoftButton label="Try Again" size={14} onPress={() => router.replace('/mock/setup')} />
        <Button label="Back to Practice" variant="ghost" onPress={() => router.replace('/practice')} />
      </View>
    </Screen>
  );
}
