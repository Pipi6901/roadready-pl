import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ProLocked } from '@/components/ProLocked';
import { NavBar } from '@/components/practice/NavBar';
import { ScoreHistoryChart } from '@/components/practice/ScoreHistoryChart';
import { cardShadow } from '@/components/practice/shadow';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/features/i18n/useT';

/** Mock Test Setup — mockup frame "Mock Test Setup". */
export default function MockSetupScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { country } = useContent();
  const progress = useProgress();
  const { localeName, questionLocaleName, translationEnabled } = useSettings();
  const { can } = useSubscription();

  const { questionCount, timeLimitMinutes, passMark, maxPoints, timing } = country.mockTest;
  // Poland scores in points, not answers, so the pass mark reads 68 / 74
  // rather than 68 / 32. Falls back to the question count where every
  // question is worth one.
  const scoreMax = maxPoints ?? questionCount;
  const passValue = maxPoints
    ? `${passMark} / ${scoreMax} ${tr('mock.pointsUnit')}`
    : `${passMark} / ${scoreMax}`;

  const rows: { icon: IconName; iconBg: string; iconColor: string; label: string; value: string }[] = [
    {
      icon: 'list-checks',
      iconBg: t.colors.sage100,
      iconColor: t.colors.onSurfaceAlt,
      label: tr('mock.setup.questions'),
      value: `${questionCount}`,
    },
    {
      icon: 'timer',
      iconBg: t.colors.amber50,
      iconColor: t.colors.amberDark,
      label: tr('mock.setup.timeLimit'),
      value: tr('mock.setup.minutes', { count: timeLimitMinutes }),
    },
    {
      icon: 'flag',
      iconBg: t.colors.successBg,
      iconColor: t.colors.successText,
      label: tr('mock.setup.passMark'),
      value: passValue,
    },
    ...(timing
      ? [
          {
            icon: 'hourglass' as IconName,
            iconBg: t.colors.errorBg,
            iconColor: t.colors.error,
            label: tr('mock.setup.perQuestion'),
            value: tr('mock.setup.seconds', {
              basic: timing.basic.readSeconds + timing.basic.answerSeconds,
              specialist: timing.specialist.readSeconds + timing.specialist.answerSeconds,
            }),
          },
        ]
      : []),
  ];

  // The paper is drawn and its media preloaded on the preparing screen; the
  // session (and its clock) starts there, once everything is local. push()
  // rather than replace() so that Cancel returns here.
  const start = () => router.push('/mock/preparing');

  if (!can('mock_test')) {
    return (
      <ProLocked
        feature="mock_test"
        icon="clipboard-check"
        title={tr('mock.proTitle')}
        body={tr('mock.proBody', { count: questionCount })}
      />
    );
  }

  return (
    <Screen>
      <NavBar title={tr('practice.mock')} />

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
            {tr('mock.simulates')}
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
              ? tr('mock.shownInPlus', { lang: questionLocaleName, second: localeName })
              : tr('mock.shownIn', { lang: questionLocaleName })}
          </Txt>
        </Row>
      </ScreenScroll>

      <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
        <Button label={tr('mock.start')} onPress={start} />
      </View>
    </Screen>
  );
}
