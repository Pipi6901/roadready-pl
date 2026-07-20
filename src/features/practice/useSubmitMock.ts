import { useRouter } from 'expo-router';
import React from 'react';

import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { mockSession, requiredToPass, scoreMockSession } from './mockSession';

/**
 * Scores the current mock attempt, files it, and moves to the results screen.
 *
 * Shared by the Submit button and by the timeout auto-submit; `claimSubmit()`
 * makes sure the two cannot both land.
 */
export function useSubmitMock(): () => void {
  const router = useRouter();
  const progress = useProgress();
  const { country } = useContent();

  return React.useCallback(() => {
    const state = mockSession.getState();
    if (!state.questions.length) return;
    if (!mockSession.claimSubmit()) return;

    const attempt = scoreMockSession(
      state,
      requiredToPass(country.mockTest, state.questions.length),
    );

    // Answered questions feed the spaced-review system; skipped ones do not —
    // a blank is a missing answer, not a demonstrated misunderstanding.
    for (const question of state.questions) {
      const chosen = state.answers[question.id];
      if (chosen) progress.recordAnswer(question.id, chosen === question.correctOptionId);
    }

    progress.recordMockAttempt(attempt);
    router.replace('/mock/results');
  }, [country.mockTest, progress, router]);
}
