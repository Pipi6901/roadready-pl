import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NavBar } from '@/components/practice/NavBar';
import { ScoreHistoryChart } from '@/components/practice/ScoreHistoryChart';
import { cardShadow } from '@/components/practice/shadow';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { mockSession } from '@/features/practice/mockSession';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { EVENTS, track } from '@/features/analytics/analytics';

/** Mock Test Setup — mockup frame "Mock Test Setup". */
export default function MockSetupScreen() {
  const t = useTheme();
  const router = useRouter();
  const { country, mockQuestions } = useContent();
  const progress = useProgress();
  const { localeName, translationEnabled } = useSettings();

  const { questionCount, timeLimitMinutes, passMark, maxPoints, timing } = country.mockTest;
  // Poland scores in points, not answers, so the pass mark reads 68 / 74
  // rather than 68 / 32. Falls back to the question count where every
  // question is worth one.
  const scoreMax = maxPoints ?? questionCount;

  const rows: { icon: IconName; iconBg: string; iconColor: string; label: string; value: string }[] = [
    {
      icon: 'list-checks',
      iconBg: t.colors.sage100,
      iconColor: t.colors.onSurfaceAlt,
      label: 'Questions',
      value: `${questionCount}`,
    },
    {
      icon: 'timer',
      iconBg: t.colors.amber50,
      iconColor: t.colors.amberDark,
      label: 'Time limit',
      value: `${timeLimitMinutes} min`,
    },
    {
      icon: 'flag',
      iconBg: t.colors.successBg,
      iconColor: t.colors.successText,
      label: 'Pass mark',
      value: `${passMark} / ${scoreMax} pts`,
    },
    ...(timing
      ? [
          {
            icon: 'hourglass' as IconName,
            iconBg: t.colors.errorBg,
            iconColor: t.colors.error,
            label: 'Per question',
            value: `${timing.basic.readSeconds + timing.basic.answerSeconds} s / ${timing.specialist.readSeconds + timing.specialist.answerSeconds} s`,
          },
        ]
      : []),
  ];

  const start = () => {
    mockSession.start(mockQuestions(), country.mockTest);
    track(EVENTS.mockTestStarted, { time_limit_minutes: timeLimitMinutes });
    // replace(): the running exam must not be escapable with a back swipe.
    router.replace('/mock/run');
  };

  return (
    <Screen>
      <NavBar title="Mock Test" />

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 16, gap: 24 }}>
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 26,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: t.colors.blue800,
                borderBottomWidth: 4,
                borderBottomColor: t.colors.blue900,
              },
              cardShadow(t, 12, 4, 0.2),
            ]}
          >
            <Icon name="clipboard-check" size={38} color={t.colors.onBlue} />
          </View>
        </View>

        <Row
          style={[
            {
              gap: 10,
              padding: 14,
              borderRadius: t.radius.md,
              backgroundColor: t.colors.sage50,
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: t.colors.sage100,
            },
            cardShadow(t, 14, 3, 0.07),
          ]}
        >
          <Icon name="info" size={18} color={t.colors.onSurfaceAlt} />
          <Txt size={13} weight="600" style={{ flex: 1 }}>
            This simulates the real theory test
          </Txt>
        </Row>

        <View
          style={[
            {
              borderRadius: t.radius.lg,
              backgroundColor: t.colors.surface,
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: t.colors.border,
              overflow: 'hidden',
            },
            cardShadow(t, 16),
          ]}
        >
          {rows.map((row, i) => (
            <Row
              key={row.label}
              accessible
              accessibilityLabel={`${row.label}: ${row.value}`}
              style={{
                gap: 12,
                padding: 16,
                borderBottomWidth: i < rows.length - 1 ? StyleSheet.hairlineWidth * 2 : 0,
                borderBottomColor: t.colors.border,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: row.iconBg,
                }}
              >
                <Icon name={row.icon} size={16} color={row.iconColor} />
              </View>
              <Txt size={14} style={{ flex: 1 }}>
                {row.label}
              </Txt>
              <Txt size={14} weight="700">
                {row.value}
              </Txt>
            </Row>
          ))}
        </View>

        <ScoreHistoryChart
          attempts={progress.state.mockAttempts}
          passMark={passMark}
          scoreMax={scoreMax}
        />

        <Row style={{ gap: 6 }}>
          <Icon name="languages" size={14} color={t.colors.textMuted} />
          <Txt size={12} color={t.colors.textMuted} style={{ flex: 1 }}>
            {translationEnabled
              ? `Questions shown in Polish + ${localeName}`
              : 'Questions shown in Polish only'}
          </Txt>
        </Row>
      </ScreenScroll>

      <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
        <Button label="Start Test" onPress={start} />
      </View>
    </Screen>
  );
}
