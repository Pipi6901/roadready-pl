import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/settings/Avatar';
import { useCardShadow } from '@/components/settings/SettingsSection';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { ACHIEVEMENT_META } from '@/constants/rules';
import { useDateLocale } from '@/features/i18n/useT';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Order of the achievement grid — mirrors the unlock order in ProgressProvider. */
const ACHIEVEMENT_IDS = [
  'first-lesson', 'streak-5', 'mock-passed', 'fifty-correct',
  'streak-14', 'topic-master', 'xp-500', 'mock-x3',
  'questions-100', 'road-ready',
] as const;

/**
 * Decorative confetti around the avatar — started as the mockup's perfectly
 * even 10-dot "Burst Dot 0..9" sunburst, which reads as generated (exact 36°
 * spacing, alternating size/colour like a clock face). Hand-placed offsets
 * per dot instead: irregular angles, radii and sizes, mixed colours — same
 * ingredients, no machine symmetry.
 */
const BURST_DOTS = [
  { angle: -8, radius: 60, size: 8, color: 'amber' },
  { angle: 34, radius: 48, size: 5, color: 'accent' },
  { angle: 72, radius: 58, size: 6, color: 'success' },
  { angle: 111, radius: 44, size: 9, color: 'accent' },
  { angle: 152, radius: 62, size: 5, color: 'amber' },
  { angle: 194, radius: 50, size: 7, color: 'success' },
  { angle: 233, radius: 60, size: 5, color: 'amber' },
  { angle: 268, radius: 46, size: 8, color: 'accent' },
  { angle: 307, radius: 58, size: 6, color: 'amber' },
] as const;
const BURST_BOX = 116;

function monthYear(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
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
  const dateLocale = useDateLocale();
  const { displayName, firstLaunchAt, daysUntilExam } = useSettings();
  const progress = useProgress();

  const stats: { icon: IconName; value: string; label: string; bg: string; edge: string; fg: string }[] = [
    {
      // Same icon FeedbackSheet already shows next to "+10 XP" during a
      // lesson — a star has no established tie to XP anywhere else in the
      // app, this does.
      icon: 'zap',
      value: progress.state.totalXp.toLocaleString(dateLocale),
      label: 'Total XP',
      bg: t.colors.amber50,
      edge: t.colors.amber,
      fg: t.colors.amberDark,
    },
    {
      // Fire for a streak is the one icon in this row I'm not swapping —
      // it's not a lazy default, it's the convention every habit-tracking
      // app uses because it's instantly legible; replacing it would cost
      // recognisability for no real gain.
      icon: 'flame',
      value: String(progress.streak),
      label: 'Day streak',
      bg: t.colors.amber50,
      edge: t.colors.amber,
      fg: t.colors.amberDark,
    },
    {
      // A bare checkmark doesn't say what got checked off. A book with a
      // check on it does — this stat is specifically "questions mastered".
      icon: 'book-open-check',
      value: String(progress.masteredCount),
      label: 'Mastered',
      bg: t.colors.successBg,
      edge: t.colors.success,
      fg: t.colors.successDark,
    },
    {
      // Compass instead of a bullseye — "on course" reads as precision too,
      // without doubling up on the target/bullseye glyph already used for
      // Weak Spots and the goal-progress rings elsewhere in the app.
      icon: 'compass',
      value: `${progress.accuracy}%`,
      label: 'Accuracy',
      bg: t.colors.sage100,
      edge: t.colors.onSurfaceAlt,
      fg: t.colors.onSurfaceAlt,
    },
  ];

  // Each earned badge gets its own colour in the mockup; locked ones are flat.
  // `fg` travels with the fill: textInverse flips to near-black in dark mode,
  // which is right on the bright amber/green/blue slabs and invisible on the
  // navy ones — those get onBlue, which stays white in both themes.
  const navy = { bg: t.colors.blue800, edge: t.colors.blue900, fg: t.colors.onBlue };
  const amber = { bg: t.colors.amber, edge: t.colors.amberDark, fg: t.colors.textInverse };
  const green = { bg: t.colors.success, edge: t.colors.successDark, fg: t.colors.textInverse };
  const blue = { bg: t.colors.accent, edge: t.colors.accentDark, fg: t.colors.textInverse };
  const badgePalette: Record<string, { bg: string; edge: string; fg: string }> = {
    'first-lesson': navy,
    'streak-5': amber,
    'questions-100': green,
    'mock-passed': blue,
    'streak-14': amber,
    'xp-500': navy,
    'topic-master': green,
    'road-ready': blue,
    'fifty-correct': navy,
    'mock-x3': green,
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
                {BURST_DOTS.map((dot, i) => {
                  const rad = (dot.angle * Math.PI) / 180;
                  const dotColor = { amber: t.colors.amber, accent: t.colors.accent, success: t.colors.success }[dot.color];
                  return (
                    <View
                      key={i}
                      style={{
                        position: 'absolute',
                        width: dot.size,
                        height: dot.size,
                        borderRadius: dot.size / 2,
                        backgroundColor: dotColor,
                        left: BURST_BOX / 2 + Math.cos(rad) * dot.radius - dot.size / 2,
                        top: BURST_BOX / 2 + Math.sin(rad) * dot.radius - dot.size / 2,
                      }}
                    />
                  );
                })}
                <Avatar name={displayName} size={80} radius={26} fontSize={26} edge={4} />
              </View>

              <Txt size={19} weight="700">
                {displayName}
              </Txt>
              <Txt size={12} color={t.colors.textSecondary}>
                Learning since {monthYear(firstLaunchAt, dateLocale)}
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
                  {/* Rounded-square slab with a bottom edge, not a plain
                      circle — matches the icon treatment used everywhere
                      else in the app (practice cards, topic nodes) instead
                      of inventing a one-off shape just for this row. */}
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: s.bg,
                      borderBottomWidth: 3,
                      borderBottomColor: s.edge,
                    }}
                  >
                    <Icon name={s.icon} size={17} color={s.fg} />
                  </View>
                  <Txt size={16} weight="700" numeric>
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
                          color={earned ? colors.fg : t.colors.textMuted}
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
