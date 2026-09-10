import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { AnswerOption } from '@/components/AnswerOption';
import { SoftButton } from '@/components/practice/SoftButton';
import { BilingualText } from '@/components/BilingualText';
import { QuestionMedia } from '@/components/QuestionMedia';
import { SaveButton } from '@/components/SaveButton';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import {
  formatClock,
  mockSession,
  questionClock,
  remainingMs,
} from '@/features/practice/mockSession';
import { useSubmitMock } from '@/features/practice/useSubmitMock';
import { useTheme } from '@/theme/ThemeProvider';
import { questionCategory } from '@/types/content';

/** Mock Test Question — mockup frame "Pytanie podstawowe (TAK/NIE)". */
export default function MockRunScreen() {
  const t = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ index?: string }>();
  const submit = useSubmitMock();

  const session = React.useSyncExternalStore(mockSession.subscribe, mockSession.getState);
  const total = session.questions.length;
  const index = session.index;

  // Review hands back a question index; a one-way exam never does.
  React.useEffect(() => {
    const parsed = Number(params.index);
    if (Number.isFinite(parsed)) mockSession.goTo(Math.max(0, parsed));
    // Only on mount: after that the session owns the position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * The countdown is recomputed from the absolute start stamp on every tick, so
   * time spent with the app backgrounded is still time spent on the exam. The
   * per-question clock ticks four times a second instead of once: it runs out in
   * 15 seconds, and a whole second of lag at that length is visible.
   */
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (session.submitted) return;
    const id = setInterval(() => setNow(Date.now()), session.timing ? 250 : 1000);
    return () => clearInterval(id);
  }, [session.submitted, session.timing]);

  const left = remainingMs(session, now);
  const clock = questionClock(session, now);
  const isLast = index >= total - 1;

  React.useEffect(() => {
    if (!total) return;
    if (left <= 0) submit();
  }, [left, total, submit]);

  /**
   * Out of time on this question: move on, or finish if it was the last one.
   * The answer already chosen (or the absence of one) stands — that is what
   * running out of time means.
   */
  React.useEffect(() => {
    if (!total || session.submitted) return;
    if (clock?.phase !== 'expired') return;
    if (isLast) submit();
    else mockSession.goTo(index + 1);
  }, [clock?.phase, index, isLast, session.submitted, submit, total]);

  // Nothing to run (fresh process, or the attempt was already filed).
  React.useEffect(() => {
    if (!total) router.replace('/mock/setup');
  }, [total, router]);

  const question = session.questions[Math.min(index, Math.max(0, total - 1))];
  if (!question) return <Screen />;

  const chosen = session.answers[question.id];
  const flagged = !!session.flagged[question.id];
  const canGoBack = session.allowReview;
  // Reading time is part of the exam: the options are on screen but inert until
  // it is up, which is the thing the app is meant to rehearse.
  const locked = clock?.phase === 'reading';
  const specialist = questionCategory(question) === 'specialist';

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', gap: 8, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Txt size={14} weight="700">
            Question {index + 1} of {total}
          </Txt>
          {clock ? (
            <Txt size={11} color={t.colors.textSecondary}>
              {specialist ? 'Specialist · A / B / C' : 'Basic · TAK / NIE'}
            </Txt>
          ) : null}
        </View>

        {/* Per-question countdown where the exam has one, whole-paper clock
            where it does not. Showing both would put two numbers racing each
            other next to the question that matters. */}
        <Row
          accessible
          accessibilityLabel={
            clock
              ? `${clock.phase === 'reading' ? 'Reading time' : 'Answer time'}, ${clock.secondsLeft} seconds left`
              : `Time remaining ${formatClock(left)}`
          }
          style={{
            gap: 5,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 14,
            backgroundColor: clock && clock.secondsLeft <= 5 ? t.colors.errorBg : t.colors.sage100,
          }}
        >
          <Icon
            name={clock?.phase === 'reading' ? 'book-open' : 'timer'}
            size={14}
            color={clock && clock.secondsLeft <= 5 ? t.colors.error : t.colors.onSurfaceAlt}
          />
          <Txt
            size={13}
            weight="700"
            color={clock && clock.secondsLeft <= 5 ? t.colors.error : t.colors.onSurfaceAlt}
          >
            {clock ? `${clock.secondsLeft} s` : formatClock(left)}
          </Txt>
        </Row>

        {/* The bookmark is allowed here even though going back is not: it
            changes nothing on the paper, it only marks the question for the
            Saved screen once the paper is done. */}
        <SaveButton questionId={question.id} style={{ width: 32 }} />

        {canGoBack ? (
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
        ) : null}
      </Row>

      <View style={{ height: 4, backgroundColor: t.colors.sage100 }}>
        <View style={{ height: 4, width: `${((index + 1) / total) * 100}%`, backgroundColor: t.colors.accent }} />
      </View>

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
        <QuestionMedia media={question.media} />

        <BilingualText
          original={question.text}
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
              // Letters on specialist questions only, because that is how the
              // options are labelled on the paper the candidate will sit.
              letter={specialist ? option.id : undefined}
              disabled={locked}
              // Correctness stays hidden until submission — exam conditions.
              state={chosen === option.id ? 'selected' : 'idle'}
              onPress={() => mockSession.answer(question.id, option.id)}
            />
          ))}
        </View>

        {locked ? (
          <Txt size={12} color={t.colors.textSecondary} align="center">
            Reading time — answering opens in {clock?.secondsLeft} s
          </Txt>
        ) : null}

        {canGoBack ? null : (
          <Txt size={12} color={t.colors.textSecondary} align="center">
            You cannot return to a question once you move on, the same as on the
            day.
          </Txt>
        )}
      </ScreenScroll>

      <View style={{ gap: 8, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
        <Row style={{ gap: 10 }}>
          {canGoBack ? (
            <SoftButton
              label="Previous"
              disabled={index === 0}
              onPress={() => mockSession.goTo(index - 1)}
              style={{ flex: 1 }}
            />
          ) : null}
          <Button
            label={isLast ? 'Finish Test' : 'Next'}
            fullWidth={false}
            onPress={() => {
              if (!isLast) return mockSession.goTo(index + 1);
              // Without a review step there is nothing between Finish and the
              // score, so Finish scores the paper itself.
              return canGoBack ? router.push('/mock/review') : submit();
            }}
            style={{ flex: 1 }}
          />
        </Row>

        {isLast || !canGoBack ? null : (
          <Button label="Finish Test" variant="ghost" onPress={() => router.push('/mock/review')} />
        )}
      </View>
    </Screen>
  );
}
