import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BilingualText } from '@/components/BilingualText';
import { QuestionMedia } from '@/components/QuestionMedia';
import { SaveButton } from '@/components/SaveButton';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { QUESTION_SPEECH_LANGUAGE } from '@/constants/rules';
import { prefetchQuestionMedia } from '@/features/media/mediaCache';
import { useHaptics } from '@/hooks/useHaptics';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { questionCategory, type DisplayQuestion } from '@/types/content';
import { AnswerOption, type AnswerOptionState } from '@/components/AnswerOption';
import { cardShadow } from './shadow';

interface QuestionRunnerProps {
  questions: DisplayQuestion[];
  /** Shown on the summary card, e.g. "Quick Quiz complete!". */
  summaryTitle: string;
  summarySubtitle: string;
  onExit: () => void;
  /** Omit to hide the "play again" action (single-question review has no replay). */
  onRestart?: () => void;
  restartLabel?: string;
  exitLabel?: string;
}

/**
 * The shared card scenario: one question at a time, immediate feedback, then a
 * summary. Used by Quick Quiz and Weak Spots — the mock test deliberately does
 * NOT use it, because it must withhold correctness until submission.
 */
export function QuestionRunner({
  questions, summaryTitle, summarySubtitle, onExit, onRestart,
  restartLabel = 'Play Again', exitLabel = 'Back to Practice',
}: QuestionRunnerProps) {
  const t = useTheme();
  const router = useRouter();
  const progress = useProgress();
  const { autoReadQuestions, voiceSpeed } = useSettings();
  const haptics = useHaptics();

  const [index, setIndex] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [done, setDone] = React.useState(false);
  // XP for the answer currently on screen, and the running total for the
  // session — both come from recordAnswer's return value, since XP is a
  // one-time-ever reward per question (see xpAwarded in ProgressProvider).
  // Replaying a quiz or weak-spots session over already-mastered questions
  // must not keep paying out, so neither figure can be derived from
  // `correctCount * XP_PER_CORRECT` — that would silently let XP be farmed.
  const [xpEarned, setXpEarned] = React.useState(0);
  const [sessionXp, setSessionXp] = React.useState(0);
  // Achievements unlocked during this session. Quick Quiz and Weak Spots
  // never go through completeLesson/recordMockAttempt (the only two places
  // that used to check achievements), so without collecting these here and
  // surfacing them ourselves below, hitting e.g. "500 XP Club" purely by
  // quizzing would never show a celebration — the condition would just sit
  // true, undetected, until some unrelated future lesson happened to
  // re-check it.
  const achievementsRef = React.useRef<string[]>([]);

  const question = questions[index];

  React.useEffect(() => {
    prefetchQuestionMedia(questions);
  }, [questions]);
  const revealed = selectedId !== null;
  const answeredCorrectly = revealed && selectedId === question?.correctOptionId;

  const speak = React.useCallback(
    (text: string) => {
      void Speech.stop();
      Speech.speak(text, { language: QUESTION_SPEECH_LANGUAGE, rate: voiceSpeed });
    },
    [voiceSpeed],
  );

  React.useEffect(() => {
    if (autoReadQuestions && question && !done) speak(question.text);
    return () => {
      void Speech.stop();
    };
  }, [autoReadQuestions, question, done, speak]);

  const choose = (optionId: string) => {
    if (revealed || !question) return;
    setSelectedId(optionId);
    const correct = optionId === question.correctOptionId;
    if (correct) {
      setCorrectCount((n) => n + 1);
      haptics.correct();
    }
    const { xp: earned, newAchievements } = progress.recordAnswer(question.id, correct);
    setXpEarned(earned);
    setSessionXp((s) => s + earned);
    if (newAchievements.length) achievementsRef.current.push(...newAchievements);
  };

  const advance = () => {
    setSelectedId(null);
    if (index + 1 >= questions.length) setDone(true);
    else setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setSelectedId(null);
    setCorrectCount(0);
    setSessionXp(0);
    setDone(false);
    achievementsRef.current = [];
    onRestart?.();
  };

  // Surfaced once the session lands on its summary, the same "arrive, then
  // celebrate" pattern lesson/complete.tsx and mock/results.tsx use.
  React.useEffect(() => {
    if (!done) return;
    // A finished round is a day of practice for the streak, the same as a
    // completed lesson — it can unlock streak-5 / streak-14 on its own.
    const { newAchievements } = progress.recordPracticeSession();
    const ids = [...achievementsRef.current, ...newAchievements];
    if (ids.length) {
      router.push({ pathname: '/achievement', params: { ids: ids.join(',') } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (done || !question) {
    return (
      <SummaryView
        title={summaryTitle}
        subtitle={summarySubtitle}
        answered={questions.length}
        correct={correctCount}
        xpEarned={sessionXp}
        onRestart={onRestart ? restart : undefined}
        restartLabel={restartLabel}
        onExit={onExit}
        exitLabel={exitLabel}
      />
    );
  }

  const optionState = (optionId: string): AnswerOptionState => {
    if (!revealed) return 'idle';
    if (optionId === question.correctOptionId) return 'correct';
    return optionId === selectedId ? 'incorrect' : 'idle';
  };

  return (
    <Screen>
      {/* Top bar — mockup frame "Top Bar" of "Question Card" */}
      <Row style={{ justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close practice"
          onPress={onExit}
          hitSlop={11}
        >
          <Icon name="x" size={22} color={t.colors.textSecondary} />
        </Pressable>

        <Row style={{ gap: 6 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {questions.map((q, i) => (
            <View
              key={q.id}
              style={{
                width: i === index ? 10 : 8,
                height: i === index ? 10 : 8,
                borderRadius: 5,
                backgroundColor: i <= index ? t.colors.accent : t.colors.sage100,
              }}
            />
          ))}
        </Row>

        <Row style={{ gap: 2 }}>
          <Txt size={13} weight="600" color={t.colors.textSecondary}>
            {index + 1} / {questions.length}
          </Txt>
          <SaveButton questionId={question.id} style={{ width: 36, alignItems: 'flex-end' }} />
        </Row>
      </Row>

      <View style={{ height: 4, backgroundColor: t.colors.sage100 }}>
        <View
          style={{
            height: 4,
            width: `${((index + (revealed ? 1 : 0)) / questions.length) * 100}%`,
            backgroundColor: t.colors.success,
          }}
        />
      </View>

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
        <QuestionMedia media={question.media} sourceMedia={question.sourceMedia} />

        <Row style={{ gap: 10, alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <BilingualText
              original={question.text}
              translation={question.translation?.text}
              size={20}
              weight="700"
              translationSize={14}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Read the question aloud"
            onPress={() => speak(question.text)}
            hitSlop={4}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
            }}
          >
            <Icon name="volume-2" size={18} color={t.colors.onSurfaceAlt} />
          </Pressable>
        </Row>

        <Row style={{ gap: 6 }}>
          <Icon name="info" size={15} color={t.colors.textMuted} />
          <Txt size={12} color={t.colors.textMuted}>
            Tap the correct answer
          </Txt>
        </Row>

        <View style={{ gap: 10 }} accessibilityRole="radiogroup">
          {question.options.map((option) => (
            <AnswerOption
              key={option.id}
              letter={questionCategory(question) === 'specialist' ? option.id : undefined}
              text={option.text}
              translation={question.translation?.options?.[option.id]}
              state={optionState(option.id)}
              disabled={revealed}
              onPress={() => choose(option.id)}
            />
          ))}
        </View>
      </ScreenScroll>

      {revealed ? (
        <FeedbackSheet
          correct={!!answeredCorrectly}
          xp={xpEarned}
          explanation={question.explanation}
          explanationTranslation={question.translation?.explanation}
          onContinue={advance}
        />
      ) : null}
    </Screen>
  );
}

/* ------------------------------------------------------------- feedback --- */

interface FeedbackSheetProps {
  correct: boolean;
  /** XP actually paid for this answer — 0 if the question had already earned
   *  its one-time reward before (see xpAwarded in ProgressProvider). */
  xp: number;
  explanation: string;
  explanationTranslation?: string | null;
  onContinue: () => void;
}

/** Mockup frames "Feedback Sheet" from Correct Answer / Incorrect Answer. */
function FeedbackSheet({ correct, xp, explanation, explanationTranslation, onContinue }: FeedbackSheetProps) {
  const t = useTheme();

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        {
          gap: 12,
          paddingTop: 10,
          paddingHorizontal: 20,
          paddingBottom: 28,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: t.colors.surface,
        },
        cardShadow(t, 20, -4, 0.1),
      ]}
    >
      <View
        style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: t.colors.border,
          alignSelf: 'center',
        }}
      />

      <Row style={{ justifyContent: 'space-between' }}>
        <Row style={{ gap: 8 }}>
          <Icon
            name={correct ? 'circle-check' : 'circle-x'}
            size={26}
            color={correct ? t.colors.successText : t.colors.error}
          />
          <Txt size={19} weight="700" color={correct ? t.colors.successText : t.colors.error}>
            {correct ? 'Correct!' : 'Not quite'}
          </Txt>
        </Row>

        {correct && xp > 0 ? (
          <Row
            style={{
              gap: 4,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 14,
              backgroundColor: t.colors.amber50,
            }}
          >
            <Icon name="zap" size={14} color={t.colors.amber} />
            <Txt size={13} weight="700" color={t.colors.amberDark}>
              +{xp} XP
            </Txt>
          </Row>
        ) : null}
      </Row>

      {/* The official catalogue ships no explanations, so this is often
          empty: the highlighted option above is then the whole feedback. */}
      {explanation.trim() ? (
        <BilingualText
          original={explanation}
          translation={explanationTranslation}
          size={14}
          weight="400"
          translationSize={12}
          gap={4}
        />
      ) : null}

      {correct ? null : (
        <Row style={{ gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: t.colors.sage100 }}>
          <Icon name="rotate-ccw" size={14} color={t.colors.textMuted} />
          <Txt size={12} color={t.colors.textSecondary}>
            This question will appear again later
          </Txt>
        </Row>
      )}

      <Button label={correct ? 'Continue' : 'Got it'} onPress={onContinue} />
    </View>
  );
}

/* -------------------------------------------------------------- summary --- */

interface SummaryViewProps {
  title: string;
  subtitle: string;
  answered: number;
  correct: number;
  /** Actual XP paid out this session — see xpEarned/sessionXp above. */
  xpEarned: number;
  onRestart?: () => void;
  restartLabel: string;
  onExit: () => void;
  exitLabel: string;
}

/** Reuses the "Lesson Complete" layout: hero badge, stat chips, actions. */
function SummaryView({
  title, subtitle, answered, correct, xpEarned, onRestart, restartLabel, onExit, exitLabel,
}: SummaryViewProps) {
  const t = useTheme();
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;

  const chips: { icon: IconName; iconColor: string; bg: string; edge: string; value: string; label: string }[] = [
    {
      icon: 'check',
      iconColor: t.colors.successText,
      bg: t.colors.successBg,
      edge: t.colors.success,
      value: `${correct}`,
      label: 'Correct',
    },
    {
      icon: 'zap',
      iconColor: t.colors.amber,
      bg: t.colors.amber50,
      edge: t.colors.amber,
      value: `${xpEarned}`,
      label: 'XP earned',
    },
    {
      icon: 'target',
      iconColor: t.colors.onSurfaceAlt,
      bg: t.colors.sage100,
      edge: t.colors.onSurfaceAlt,
      value: `${accuracy}%`,
      label: 'Accuracy',
    },
  ];

  return (
    <Screen>
      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, gap: 20, alignItems: 'center' }}
      >
        <View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
              borderWidth: 4,
              borderColor: t.colors.accent,
            },
            cardShadow(t, 12, 4, 0.15),
          ]}
        >
          <Icon name="trophy" size={60} color={t.colors.onSurfaceAlt} />
        </View>

        <View style={{ gap: 8, alignItems: 'center' }}>
          <Txt size={24} weight="700" align="center">
            {title}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" style={{ maxWidth: 280 }}>
            {subtitle}
          </Txt>
        </View>

        <Row style={{ gap: 10, alignSelf: 'stretch' }}>
          {chips.map((chip) => (
            <View
              key={chip.label}
              accessible
              accessibilityLabel={`${chip.value} ${chip.label}`}
              style={[
                {
                  flex: 1,
                  gap: 4,
                  padding: 12,
                  alignItems: 'center',
                  borderRadius: t.radius.md,
                  backgroundColor: t.colors.surface,
                  borderWidth: StyleSheet.hairlineWidth * 2,
                  borderColor: t.colors.sage100,
                },
                cardShadow(t, 10, 3, 0.07),
              ]}
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
                <Icon name={chip.icon} size={14} color={chip.iconColor} />
              </View>
              <Txt size={17} weight="700" numeric>
                {chip.value}
              </Txt>
              <Txt size={11} color={t.colors.textSecondary}>
                {chip.label}
              </Txt>
            </View>
          ))}
        </Row>
      </ScreenScroll>

      <View style={{ gap: 10, paddingHorizontal: 24, paddingTop: 14, paddingBottom: 24 }}>
        {onRestart ? <Button label={restartLabel} onPress={onRestart} /> : null}
        <Button label={exitLabel} variant={onRestart ? 'ghost' : 'primary'} onPress={onExit} />
      </View>
    </Screen>
  );
}
