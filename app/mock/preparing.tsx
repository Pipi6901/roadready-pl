import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { RoadLoader } from '@/components/practice/RoadLoader';
import { Button, ProgressBar, Screen, Txt } from '@/components/ui/primitives';
import { EVENTS, track } from '@/features/analytics/analytics';
import { preloadQuestionMedia, type PreloadProgress } from '@/features/media/mediaCache';
import { mockSession } from '@/features/practice/mockSession';
import { useContent } from '@/store/ContentProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/features/i18n/useT';

/** Even when everything is already on disk the screen holds for this long — a flash of a loader is worse than a short one. */
const MIN_VISIBLE_MS = 1200;

/**
 * Between "Start" on the setup screen and the first question: draws the paper,
 * downloads every picture and clip in it, and only then starts the session.
 *
 * The exam clock and the per-question timer start in mockSession.start(), so
 * that call has to wait until the media is local — otherwise a 4 MB clip
 * would load while the 20-second reading window is already running, which is
 * exactly the failure the real exam never has. A file that fails to download
 * does not block the start: the question streams it when reached, as before.
 */
export default function MockPreparingScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { country, mockQuestions } = useContent();
  const [progress, setProgress] = React.useState<PreloadProgress>({ total: 0, done: 0, failed: 0 });
  // Drawn once, on mount. Kept in a ref so a re-render (every progress tick)
  // does not shuffle a new paper.
  const questionsRef = React.useRef<ReturnType<typeof mockQuestions> | null>(null);
  if (questionsRef.current === null) questionsRef.current = mockQuestions();
  const cancelled = React.useRef(false);

  React.useEffect(() => {
    const questions = questionsRef.current ?? [];
    const startedAt = Date.now();

    void preloadQuestionMedia(questions, setProgress).then((result) => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      setTimeout(() => {
        if (cancelled.current) return;
        mockSession.start(questions, country.mockTest);
        track(EVENTS.mockTestStarted, {
          time_limit_minutes: country.mockTest.timeLimitMinutes,
          media_preloaded: result.total - result.failed,
          media_failed: result.failed,
        });
        // replace(): the running exam must not be escapable with a back swipe,
        // and this screen must not be in the stack behind it either.
        router.replace('/mock/run');
      }, wait);
    });

    return () => {
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per mount, by design
  }, []);

  const ratio = progress.total ? progress.done / progress.total : 1;
  const status =
    progress.total === 0
      ? 'Everything is already on this phone'
      : `Loading pictures and clips — ${Math.min(progress.done, progress.total)} of ${progress.total}`;

  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 28 }}>
        <RoadLoader />

        <View style={{ alignItems: 'center', gap: 8 }}>
          <Txt size={22} weight="700" align="center">
            {tr('mock.preparing')}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" lineHeight={20}>
            Every picture and clip is downloaded before the clock starts, so nothing has to load while you are answering.
          </Txt>
        </View>

        <View style={{ alignSelf: 'stretch', gap: 8 }}>
          <ProgressBar value={ratio} fillColor={t.colors.accent} trackColor={t.isDark ? t.colors.sage200 : undefined} />
          <Txt size={12} color={t.colors.textMuted} align="center" numeric>
            {status}
          </Txt>
        </View>

        <Button
          label={tr('common.cancel')}
          variant="ghost"
          fullWidth={false}
          onPress={() => {
            cancelled.current = true;
            router.back();
          }}
        />
      </View>
    </Screen>
  );
}
