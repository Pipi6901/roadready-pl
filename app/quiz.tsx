import { useRouter } from 'expo-router';
import React from 'react';

import { QuestionRunner } from '@/components/practice/QuestionRunner';
import { QUICK_QUIZ_SIZE } from '@/constants/rules';
import { useContent } from '@/store/ContentProvider';

/** Quick Quiz — the card scenario over a random draw. */
export default function QuizScreen() {
  const router = useRouter();
  const { randomQuestions } = useContent();

  // Drawn once per round; "Play Again" bumps the seed to redraw.
  const [round, setRound] = React.useState(0);
  const questions = React.useMemo(
    () => randomQuestions(QUICK_QUIZ_SIZE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [randomQuestions, round],
  );

  const backToPractice = () => router.replace('/practice');

  return (
    <QuestionRunner
      questions={questions}
      summaryTitle="Quiz complete!"
      summarySubtitle="Every round you play makes the next test easier."
      onExit={backToPractice}
      onRestart={() => setRound((n) => n + 1)}
      restartLabel="Play Again"
    />
  );
}
