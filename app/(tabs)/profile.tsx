import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/settings/Avatar';
import { useCardShadow } from '@/components/settings/SettingsSection';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { ACHIEVEMENT_META } from '@/constants/rules';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Order of the achievement grid — mirrors the unlock order in ProgressProvider. */
const ACHIEVEMENT_IDS = [
  'first-lesson', 'streak-5', 'mock-passed', 'fifty-correct',
  'streak-14', 'topic-master', 'xp-500', 'mock-x3',
  'questions-100', 'road-ready',
] as const;

/** Decorative sunburst around the avatar — mockup "Burst Dot 0..9". */
const BURST_DOTS = Array.from({ length: 10 }, (_, i) => ({
  angle: (i * 36 * Math.PI) / 180,
  size: i % 2 === 0 ? 7 : 5,
}));
const BURST_RADIUS = 56;
const BURST_BOX = 116;

function monthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/**
 * Profile — mockup frame "Profile".
 *
 * No email and no account controls: there are no user accounts at all
 * (ADR-002), so the name comes from local settings and "Learning since" is
 * measured from the first launch instead of a signup date.
 */
export default function ProfileScreen() {
  const t = useTheme();
  const router = useRouter();
  const shadow = useCardShadow();
  const { displayName, firstLaunchAt, daysUntilExam } = useSettings();
  const progress = useProgress();

  const stats: { icon: IconName; value: string; label: string; bg: string; edge: string; fg: string }[] = [
    {
      icon: 'star',
      value: progress.state.totalXp.toLocaleString('en-GB'),
      label: 'Total XP',
      bg: t.colors.amber50,
      edge: t.colors.amber,
      fg: t.colors.amberDark,
    },
    {
      icon: 'flame',
      value: String(progress.state.streakDays),
      label: 'Day streak',
      bg: t.colors.amber50,
      edge: t.colors.amber,
      fg: t.colors.amberDark,
    },
    {
      icon: 'check',
      value: String(progress.masteredCount),
      label: 'Mastered',
      bg: t.colors.successBg,
      edge: t.colors.success,
      fg: t.colors.successDark,
    },
    {
      icon: 'target',
      value: `${progress.accuracy}%`,
      label: 'Accuracy',
      bg: t.colors.sage100,
      edge: t.colors.onSurfaceAlt,
      fg: t.colors.onSurfaceAlt,
    },
  ];

  // Each earned badge gets its own colour in the mockup; locked ones are flat.
  const badgePalette: Record<string, { bg: string; edge: string }> = {
    'first-lesson': { bg: t.colors.blue800, edge: t.colors.blue900 },
    'streak-5': { bg: t.colors.amber, edge: t.colors.amberDark },
    'questions-100': { bg: t.colors.success, edge: t.colors.successDark },
    'mock-passed': { bg: t.colors.accent, edge: t.colors.accentDark },
    'streak-14': { bg: t.colors.amber, edge: t.colors.amberDark },
    'xp-500': { bg: t.colors.blue800, edge: t.colors.blue900 },
    'topic-master': { bg: t.colors.success, edge: t.colors.successDark },
    'road-ready': { bg: t.colors.accent, edge: t.colors.accentDark },
    'fifty-correct': { bg: t.colors.blue800, edge: t.colors.blue900 },
    'mock-x3': { bg: t.colors.success, edge: t.colors.successDark },
  };

  const earnedCount = ACHIEVEMENT_IDS.filter((id) => progress.state.achievements.includes(id)).length;

  return (
    <Screen>
      <ScreenScroll>
        {/* Top bar */}
        <Row style={{ justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
          <Txt size={26} weight="700">
            Profile
          </Txt>
          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={6}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 19,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Icon name="settings" size={19} color={t.colors.onSurfaceAlt} />
          </Pressable>
        </Row>

        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 22 }}>
          {/* Hero panel */}
          <View
            style={[
              {
                backgroundColor: t.colors.sage50,
                borderRadius: t.radius.lg,
                padding: 20,
                gap: 20,
              },
              shadow,
            ]}
          >
            <View style={{ alignItems: 'center', gap: 8 }}>
              <View style={{ width: BURST_BOX, height: BURST_BOX, alignItems: 'center', justifyContent: 'center' }}>
                {BURST_DOTS.map((dot, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      width: dot.size,
                      height: dot.size,
                      borderRadius: dot.size / 2,
                      backgroundColor: i % 2 === 0 ? t.colors.amber : t.colors.accent,
                      left: BURST_BOX / 2 + Math.cos(dot.angle) * BURST_RADIUS - dot.size / 2,
                      top: BURST_BOX / 2 + Math.sin(dot.angle) * BURST_RADIUS - dot.size / 2,
                    }}
                  />
                ))}
                <Avatar name={displayName} size={80} radius={26} fontSize={26} edge={4} />
              </View>

              <Txt size={19} weight="700">
                {displayName}
              </Txt>
              <Txt size={12} color={t.colors.textSecondary}>
                Learning since {monthYear(firstLaunchAt)}
              </Txt>
            </View>

            {/* Stats grid */}
            <Row style={{ gap: 10, alignItems: 'stretch' }}>
              {stats.map((s) => (
                <View
                  key={s.label}
                  accessible
                  accessibilityLabel={`${s.label}: ${s.value}`}
                  style={[
                    {
                      flex: 1,
                      alignItems: 'center',
                      gap: 6,
                      padding: 12,
                      borderRadius: t.radius.md,
                      backgroundColor: t.colors.surface,
                      borderWidth: StyleSheet.hairlineWidth * 2,
                      borderColor: t.colors.border,
                    },
                    shadow,
                  ]}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: s.bg,
                      borderBottomWidth: 2,
                      borderBottomColor: s.edge,
                    }}
                  >
                    <Icon name={s.icon} size={15} color={s.fg} />
                  </View>
                  <Txt size={15} weight="700">
                    {s.value}
                  </Txt>
                  <Txt size={10} color={t.colors.textSecondary} align="center">
                    {s.label}
                  </Txt>
                </View>
              ))}
            </Row>
          </View>

          {/* Countdown — only once a test date exists */}
          {daysUntilExam !== null ? (
            <Row
              style={[
                {
                  gap: 12,
                  padding: 16,
                  borderRadius: t.radius.lg,
                  backgroundColor: t.colors.surface,
                  borderWidth: StyleSheet.hairlineWidth * 2,
                  borderColor: t.colors.sage100,
                },
                shadow,
              ]}
            >
              <ProgressRing
                value={progress.readiness / 100}
                size={44}
                thickness={6}
                fillColor={t.colors.accent}
                label={`${progress.readiness}%`}
                labelSize={10}
              />
              <View style={{ gap: 2, flex: 1 }}>
                <Txt size={14} weight="600">
                  Your test is in {daysUntilExam} {daysUntilExam === 1 ? 'day' : 'days'}
                </Txt>
                <Txt size={12} color={t.colors.textSecondary}>
                  You&apos;re {progress.readiness}% ready
                </Txt>
              </View>
            </Row>
          ) : null}

          {/* Achievements */}
          <View style={{ gap: 12 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt size={16} weight="700">
                Achievements
              </Txt>
              <View
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: t.colors.amber50,
                }}
              >
                <Txt size={11} weight="700" color={t.colors.amberDark}>
                  {earnedCount} / {ACHIEVEMENT_IDS.length} earned
                </Txt>
              </View>
            </Row>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, columnGap: 12 }}>
              {ACHIEVEMENT_IDS.map((id) => {
                const meta = ACHIEVEMENT_META[id];
                const earned = progress.state.achievements.includes(id);
                const colors = badgePalette[id];

                return (
                  <View
                    key={id}
                    accessible
                    accessibilityLabel={
                      earned
                        ? `${meta.title}, earned. ${meta.description}`
                        : `${meta.title}, locked. ${meta.description}`
                    }
                    style={{ width: '22%', alignItems: 'center', gap: 6 }}
                  >
                    <View style={{ width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}>
                      <View
                        style={[
                          {
                            width: 60,
                            height: 60,
                            borderRadius: 22,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: earned ? colors.bg : t.colors.sage50,
                            borderBottomWidth: earned ? 4 : 0,
                            borderBottomColor: colors.edge,
                            borderWidth: earned ? 0 : 2,
                            borderColor: t.colors.border,
                          },
                          earned ? shadow : null,
                        ]}
                      >
                        <Icon
                          name={earned ? meta.icon : 'lock'}
                          size={earned ? 26 : 22}
                          color={earned ? t.colors.textInverse : t.colors.textMuted}
                        />
                      </View>

                      {earned ? (
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: t.colors.surface,
                            borderWidth: 2,
                            borderColor: colors.bg,
                          }}
                        >
                          <Icon name="check" size={11} color={colors.bg} />
                        </View>
                      ) : null}
                    </View>

                    <Txt
                      size={10}
                      align="center"
                      color={earned ? t.colors.textPrimary : t.colors.textMuted}
                    >
                      {meta.title}
                    </Txt>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScreenScroll>
    </Screen>
  );
}
