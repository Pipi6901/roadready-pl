import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { AnswerOption } from '@/components/practice/AnswerOption';
import { SoftButton } from '@/components/practice/SoftButton';
import { BilingualText } from '@/components/BilingualText';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { formatClock, mockSession, remainingMs } from '@/features/practice/mockSession';
import { useSubmitMock } from '@/features/practice/useSubmitMock';
import { useTheme } from '@/theme/ThemeProvider';

/** Mock Test Question — mockup frame "Mock Test Question". */
export default function MockRunScreen() {
  const t = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ index?: string }>();
  const submit = useSubmitMock();

  const session = React.useSyncExternalStore(mockSession.subscribe, mockSession.getState);
  const total = session.questions.length;

  const [index, setIndex] = React.useState(() => {
    const parsed = Number(params.index);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  });

  /**
   * The countdown is recomputed from the absolute start stamp on every tick, so
   * time spent with the app backgrounded is still time spent on the exam.
   */
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (session.submitted) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session.submitted]);

  const left = remainingMs(session, now);

  React.useEffect(() => {
    if (!total) return;
    if (left <= 0) submit();
  }, [left, total, submit]);

  // Nothing to run (fresh process, or the attempt was already filed).
  React.useEffect(() => {
    if (!total) router.replace('/mock/setup');
  }, [total, router]);

  const question = session.questions[Math.min(index, Math.max(0, total - 1))];
  if (!question) return <Screen />;

  const chosen = session.answers[question.id];
  const flagged = !!session.flagged[question.id];
  const isLast = index >= total - 1;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 }}>
        <Txt size={14} weight="700">
          Question {index + 1} of {total}
        </Txt>

        <Row
          accessible
          accessibilityLabel={`Time remaining ${formatClock(left)}`}
          style={{
            gap: 5,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 14,
            backgroundColor: t.colors.sage100,
          }}
        >
          <Icon name="timer" size={14} color={t.colors.onSurfaceAlt} />
          <Txt size={13} weight="700" color={t.colors.onSurfaceAlt}>
            {formatClock(left)}
          </Txt>
        </Row>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={flagged ? 'Unflag this question' : 'Flag this question for review'}
          accessibilityState={{ selected: flagged }}
          onPress={() => mockSession.toggleFlag(question.id)}
          hitSlop={12}
        >
          <Icon
            name="flag"
            size={20}
            color={flagged ? t.colors.amber : t.colors.textSecondary}
            fill={flagged ? t.colors.amber : 'none'}
          />
        </Pressable>
      </Row>

      <View style={{ height: 4, backgroundColor: t.colors.sage100 }}>
        <View style={{ height: 4, width: `${((index + 1) / total) * 100}%`, backgroundColor: t.colors.accent }} />
      </View>

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
        <BilingualText
          english={question.text}
          translation={question.translation?.text}
          size={19}
          weight="700"
          translationSize={13}
        />

        <View style={{ gap: 10 }} accessibilityRole="radiogroup">
          {question.options.map((option) => (
            <AnswerOption
              key={option.id}
              text={option.text}
              translation={question.translation?.options?.[option.id]}
              // Correctness stays hidden until submission — exam conditions.
              state={chosen === option.id ? 'selected' : 'idle'}
              onPress={() => mockSession.answer(question.id, option.id)}
            />
          ))}
        </View>
      </ScreenScroll>

      <View style={{ gap: 8, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
        <Row style={{ gap: 10 }}>
          <SoftButton
            label="Previous"
            disabled={index === 0}
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            style={{ flex: 1 }}
          />
          <Button
            label={isLast ? 'Finish Test' : 'Next'}
            fullWidth={false}
            onPress={() => (isLast ? router.push('/mock/review') : setIndex((i) => i + 1))}
            style={{ flex: 1 }}
          />
        </Row>

        {isLast ? null : (
          <Button label="Finish Test" variant="ghost" onPress={() => router.push('/mock/review')} />
        )}
      </View>
    </Screen>
  );
}
