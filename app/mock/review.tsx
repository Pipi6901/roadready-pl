import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NavBar } from '@/components/practice/NavBar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { mockSession } from '@/features/practice/mockSession';
import { useSubmitMock } from '@/features/practice/useSubmitMock';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/features/i18n/useT';

type CellStatus = 'answered' | 'unanswered' | 'flagged';

const COLUMNS = 5;

/**
 * Review Before Submit.
 *
 * British-exam screen: it exists only where the paper can be revisited
 * before submitting. Poland forbids that, so the run screen never routes
 * here and the guard below scores the paper instead of showing a step the
 * real exam does not have. The screen stays in the repository because the
 * rule is a country's, not the product's (see MockTestConfig.allowReview).
 */
export default function MockReviewScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const submit = useSubmitMock();

  const session = React.useSyncExternalStore(mockSession.subscribe, mockSession.getState);
  const total = session.questions.length;

  React.useEffect(() => {
    if (!total) router.replace('/mock/setup');
  }, [total, router]);

  // Reached by a stale link or a back gesture in a one-way exam: submit
  // rather than offer a review the candidate is not entitled to.
  React.useEffect(() => {
    if (total && !session.allowReview) submit();
  }, [total, session.allowReview, submit]);

  if (total && !session.allowReview) return <Screen />;

  const skin: Record<CellStatus, { bg: string; border: string; width: number; fg: string; icon: IconName; word: string }> = {
    answered: {
      bg: t.colors.successBg,
      border: t.colors.success,
      width: 1.5,
      fg: t.colors.successText,
      icon: 'check',
      word: tr('mock.answered'),
    },
    unanswered: {
      bg: t.colors.sage50,
      border: t.colors.border,
      width: 1.5,
      fg: t.colors.textMuted,
      icon: 'x',
      word: tr('mock.notAnswered'),
    },
    flagged: {
      bg: t.colors.amber50,
      border: t.colors.amber,
      width: 2,
      fg: t.colors.amberDark,
      icon: 'flag',
      word: tr('mock.flagged'),
    },
  };

  const statusOf = (questionId: string): CellStatus => {
    if (session.flagged[questionId]) return 'flagged';
    return session.answers[questionId] ? 'answered' : 'unanswered';
  };

  const answered = session.questions.filter((q) => session.answers[q.id]).length;
  const legend: CellStatus[] = ['answered', 'unanswered', 'flagged'];

  return (
    <Screen>
      <NavBar title={tr('mock.reviewAnswers')} />

      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, gap: 14 }}
      >
        <Row style={{ gap: 14, flexWrap: 'wrap' }}>
          {legend.map((status) => (
            <Row key={status} style={{ gap: 5 }}>
              {/* A miniature of the grid cell, so the legend teaches both the
                  colour and the glyph that stands in for it. */}
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: skin[status].bg,
                  borderWidth: skin[status].width,
                  borderColor: skin[status].border,
                }}
              >
                <Icon name={skin[status].icon} size={9} color={skin[status].fg} />
              </View>
              <Txt size={11} color={t.colors.textSecondary}>
                {status === 'answered' ? 'Answered' : status === 'unanswered' ? 'Not answered' : 'Flagged'}
              </Txt>
            </Row>
          ))}
        </Row>

        <Txt size={13} color={t.colors.textSecondary}>
          {tr('mock.answeredOf', { answered, total })}
        </Txt>

        <View style={{ gap: 8 }}>
          {Array.from({ length: Math.ceil(total / COLUMNS) }, (_, rowIndex) => (
            <Row key={rowIndex} style={{ gap: 8 }}>
              {session.questions
                .slice(rowIndex * COLUMNS, rowIndex * COLUMNS + COLUMNS)
                .map((question, columnIndex) => {
                  const number = rowIndex * COLUMNS + columnIndex + 1;
                  const s = skin[statusOf(question.id)];
                  return (
                    <Pressable
                      key={question.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${tr('question.numberA11y', { index: number, total })}, ${s.word}`}
                      accessibilityHint={tr('mock.opensQuestion')}
                      onPress={() => router.push({ pathname: '/mock/run', params: { index: number - 1 } })}
                      style={{
                        flex: 1,
                        height: 44,
                        flexDirection: 'row',
                        gap: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        backgroundColor: s.bg,
                        borderWidth: s.width,
                        borderColor: s.border,
                      }}
                    >
                      {/* Icon carries the status too — colour alone is not a signal (NFR-07). */}
                      <Icon name={s.icon} size={11} color={s.fg} />
                      <Txt size={13} weight="700" color={s.fg}>
                        {number}
                      </Txt>
                    </Pressable>
                  );
                })}
              {/* Keeps a short last row's cells the same width as a full row. */}
              {Array.from(
                { length: COLUMNS - session.questions.slice(rowIndex * COLUMNS, rowIndex * COLUMNS + COLUMNS).length },
                (_, i) => <View key={`spacer-${i}`} style={{ flex: 1 }} />,
              )}
            </Row>
          ))}
        </View>
      </ScreenScroll>

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 20,
          borderTopWidth: StyleSheet.hairlineWidth * 2,
          borderTopColor: t.colors.border,
        }}
      >
        <Button label={tr('mock.submit')} onPress={submit} />
      </View>
    </Screen>
  );
}
