import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import { Alert, Animated, Easing, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BilingualText } from '@/components/BilingualText';
import { AnswerOptionCard, type AnswerOptionState } from '@/components/learning/AnswerOptionCard';
import { FeedbackSheet } from '@/components/learning/FeedbackSheet';
import { LessonTopBar } from '@/components/learning/LessonTopBar';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Screen, Txt } from '@/components/ui/primitives';
import { XP_PER_CORRECT } from '@/constants/rules';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
/** Off-screen resting position of the feedback sheet. */
const SHEET_HIDDEN = 520;

/** Lesson card flow — mockup frames "Question Card" / "Correct Answer" / "Incorrect Answer". */
export default function LessonScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const content = useContent();
  const progress = useProgress();
  const subscription = useSubscription();
  const { voiceSpeed, autoReadQuestions } = useSettings();

  // Frozen at mount: completeLesson() bumps completedLessons and would otherwise
  // swap the question set out from under the learner on the last card.
  const [lessonIndex] = React.useState(() => progress.topicStats(topicId).completedLessons);
  const questions = React.useMemo(
    () => content.lessonQuestions(topicId, lessonIndex),
    [content, topicId, lessonIndex],
  );

  const [index, setIndex] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [answered, setAnswered] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [flagged, setFlagged] = React.useState<Record<string, boolean>>({});
  const [sheetHeight, setSheetHeight] = React.useState(0);

  const sheetY = React.useRef(new Animated.Value(SHEET_HIDDEN)).current;

  const question = questions[index];
  const isCorrect = !!question && selectedId === question.correctOptionId;
  // Gate only between cards: answering the last free question must still show
  // its feedback rather than swapping the screen out mid-sentence.
  const limitReached = !subscription.isPro && subscription.questionsLeftToday <= 0 && !answered;

  const speak = React.useCallback(
    (text: string) => {
      Speech.stop();
      Speech.speak(text, { language: 'en-GB', rate: voiceSpeed });
    },
    [voiceSpeed],
  );

  // Stop any narration when the screen goes away.
  React.useEffect(
    () => () => {
      void Speech.stop();
    },
    [],
  );

  React.useEffect(() => {
    if (autoReadQuestions && question && !answered) speak(question.text);
    // Only when the card changes, not on every answer state flip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  const handleSelect = (optionId: string) => {
    if (answered || !question) return;
    const correct = optionId === question.correctOptionId;

    setSelectedId(optionId);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);

    progress.recordAnswer(question.id, correct);
    subscription.countQuestion();
    void Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    );

    Animated.timing(sheetY, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleContinue = () => {
    const isLast = index >= questions.length - 1;

    if (isLast) {
      const { xp } = progress.completeLesson(topicId, correctCount);
      router.replace({
        pathname: '/lesson/complete',
        params: {
          topicId,
          total: String(questions.length),
          correct: String(correctCount),
          xp: String(xp),
        },
      });
      return;
    }

    Animated.timing(sheetY, {
      toValue: SHEET_HIDDEN,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIndex((i) => i + 1);
      setSelectedId(null);
      setAnswered(false);
    });
  };

  const handleExit = () => {
    const started = index > 0 || answered;
    if (!started) {
      router.back();
      return;
    }
    Alert.alert(
      'Leave this lesson?',
      'Answers you have already given are saved, but the lesson will not count as complete.',
      [
        { text: 'Keep learning', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ],
    );
  };

  /* ------------------------------------------------------------- gates --- */

  if (limitReached) {
    return (
      <Screen>
        <Row style={{ paddingTop: 16, paddingHorizontal: 20 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => router.back()}
            hitSlop={12}
            style={{ width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' }}
          >
            <Icon name="x" size={22} color={t.colors.textSecondary} />
          </Pressable>
        </Row>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
              borderBottomWidth: 4,
              borderBottomColor: t.colors.sage200,
            }}
          >
            <Icon name="alarm-clock" size={42} color={t.colors.onSurfaceAlt} />
          </View>

          <Txt size={24} weight="700" align="center">
            Daily limit reached
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center">
            You have used all of today&apos;s free questions. Come back tomorrow, or go unlimited with Pro.
          </Txt>

          <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 8 }}>
            <Button label="See Pro plans" onPress={() => router.push('/paywall')} />
            <Button label="Back to topics" variant="ghost" onPress={() => router.back()} />
          </View>
        </View>
      </Screen>
    );
  }

  if (!question) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
          <Icon name="book-open-check" size={40} color={t.colors.textMuted} />
          <Txt size={16} weight="600" align="center">
            No lessons left in this topic
          </Txt>
          <Button label="Back to topics" variant="secondary" fullWidth={false} onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  /* ------------------------------------------------------------ lesson --- */

  const optionState = (optionId: string): AnswerOptionState => {
    if (!answered) return 'idle';
    if (optionId === selectedId) return isCorrect ? 'selected-correct' : 'selected-incorrect';
    if (optionId === question.correctOptionId) return 'revealed-correct';
    return 'idle';
  };

  const correctOption = question.options.find((o) => o.id === question.correctOptionId);

  return (
    <Screen>
      <LessonTopBar
        total={questions.length}
        index={index}
        answered={answered ? index + 1 : index}
        onClose={handleExit}
        onFlag={() => setFlagged((f) => ({ ...f, [question.id]: !f[question.id] }))}
        flagged={!!flagged[question.id]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          gap: 16,
          paddingBottom: (answered ? sheetHeight : 0) + 32,
        }}
      >
        {/* Question + speech */}
        <Row style={{ gap: 10, alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <BilingualText
              english={question.text}
              translation={question.translation?.text}
              size={17}
              weight="600"
              translationSize={14}
              gap={6}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Read the question aloud"
            onPress={() => speak(question.text)}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Icon name="volume-2" size={18} color={t.colors.onSurfaceAlt} />
          </Pressable>
        </Row>

        {!answered ? (
          <Row style={{ gap: 6 }}>
            <Icon name="info" size={15} color={t.colors.textMuted} />
            <Txt size={12} color={t.colors.textMuted}>
              Tap the correct answer
            </Txt>
          </Row>
        ) : null}

        <View style={{ gap: 10 }}>
          {question.options.map((option, i) => (
            <AnswerOptionCard
              key={option.id}
              letter={LETTERS[i] ?? option.id}
              text={option.text}
              translation={question.translation?.options[option.id]}
              state={optionState(option.id)}
              disabled={answered}
              onPress={() => handleSelect(option.id)}
            />
          ))}
        </View>
      </ScrollView>

      <FeedbackSheet
        correct={isCorrect}
        translateY={sheetY}
        explanation={question.explanation}
        explanationTranslation={question.translation?.explanation}
        correctAnswer={correctOption?.text ?? ''}
        correctAnswerTranslation={
          correctOption ? question.translation?.options[correctOption.id] : null
        }
        xp={XP_PER_CORRECT}
        onContinue={handleContinue}
        bottomInset={insets.bottom}
        onLayout={setSheetHeight}
        visible={answered}
      />
    </Screen>
  );
}
