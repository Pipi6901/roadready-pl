import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { DecoLayer, type DecoItem } from '@/components/onboarding/Decor';
import { GradientScreen } from '@/components/onboarding/GradientScreen';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { Icon } from '@/components/ui/Icon';
import { Row, Txt } from '@/components/ui/primitives';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

const DECO: DecoItem[] = [
  { icon: 'alarm-clock', size: 20, x: 330, y: 20, rotate: 8 },
  { icon: 'party-popper', size: 20, x: 20, y: 80, rotate: -10 },
];

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEKS = 6;
const DAY_MS = 86_400_000;

const pad = (n: number) => String(n).padStart(2, '0');
const dateKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Monday-first offset for the 1st of the month. */
const leadingBlanks = (y: number, m: number) => (new Date(y, m, 1).getDay() + 6) % 7;

/** Goal Setting — mockup frame "Goal Setting". Calendar is hand-built, no date library. */
export default function GoalScreen() {
  const t = useTheme();
  const router = useRouter();
  const { examDate, update } = useSettings();

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = React.useState(() => {
    const seed = examDate ? new Date(examDate) : today;
    return { year: seed.getFullYear(), month: seed.getMonth() };
  });
  const [selected, setSelected] = React.useState<string | null>(examDate);
  const [noDate, setNoDate] = React.useState(false);

  const cells = React.useMemo(() => {
    const blanks = leadingBlanks(view.year, view.month);
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    return Array.from({ length: WEEKS * 7 }, (_, i) => {
      const day = i - blanks + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    });
  }, [view]);

  const daysToGo = React.useMemo(() => {
    if (!selected) return null;
    const target = new Date(selected);
    return Math.max(0, Math.round((startOfDay(target).getTime() - today.getTime()) / DAY_MS));
  }, [selected, today]);

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  const atCurrentMonth =
    view.year === today.getFullYear() && view.month === today.getMonth();

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const next = new Date(v.year, v.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const finish = (date: string | null) => {
    update({ examDate: date });
    router.push('/paywall');
  };

  const canSetGoal = noDate || !!selected;

  return (
    <GradientScreen to={t.colors.sage100}>
      <DecoLayer items={DECO} color={t.colors.decoration} />

      <View style={{ flex: 1, paddingTop: 12, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Txt size={22} weight="700">
          When is your test?
        </Txt>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingTop: 16 }}>
          <View
            style={{
              gap: 12,
              padding: 16,
              borderRadius: t.radius.lg,
              backgroundColor: t.colors.surface,
              shadowColor: t.colors.blue900,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.07,
              shadowRadius: 14,
              elevation: 3,
            }}
          >
            <Row
              style={{
                alignSelf: 'flex-start',
                gap: 6,
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: t.colors.successBg,
              }}
            >
              <Icon name="target" size={12} color={t.colors.successDark} />
              <Txt variant="label" size={10} weight="700" color={t.colors.successDark}>
                EXAM DATE
              </Txt>
            </Row>

            <Row style={{ justifyContent: 'space-between' }}>
              <MonthArrow
                direction="prev"
                disabled={atCurrentMonth}
                onPress={() => shiftMonth(-1)}
              />
              <Txt size={15} weight="700" accessibilityRole="header">
                {monthLabel}
              </Txt>
              <MonthArrow direction="next" onPress={() => shiftMonth(1)} />
            </Row>

            <Row style={{ gap: 4 }}>
              {WEEKDAYS.map((label, i) => (
                <Txt
                  key={`${label}-${i}`}
                  size={11}
                  weight="700"
                  align="center"
                  color={t.colors.textMuted}
                  style={{ flex: 1 }}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                >
                  {label}
                </Txt>
              ))}
            </Row>

            {Array.from({ length: WEEKS }, (_, w) => (
              <Row key={`week-${w}`} style={{ gap: 4 }}>
                {cells.slice(w * 7, w * 7 + 7).map((day, i) => (
                  <DayCell
                    key={`${w}-${i}`}
                    day={day}
                    weekend={i >= 5}
                    year={view.year}
                    month={view.month}
                    today={today}
                    selected={selected}
                    onPress={(key) => {
                      setSelected(key);
                      setNoDate(false);
                    }}
                  />
                ))}
              </Row>
            ))}
          </View>

          {daysToGo !== null && !noDate ? (
            <Row
              style={{
                gap: 10,
                padding: 14,
                borderRadius: t.radius.md,
                backgroundColor: t.colors.successBg,
              }}
            >
              <Icon name="sparkles" size={18} color={t.colors.successDark} />
              <Txt size={13} weight="600" color={t.colors.successDark} style={{ flex: 1 }}>
                {daysToGo} days to go — we&apos;ll build your study plan
              </Txt>
            </Row>
          ) : null}

          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel="I don't have a date yet"
            accessibilityState={{ checked: noDate }}
            onPress={() => {
              setNoDate((v) => !v);
              setSelected(null);
            }}
            style={{
              flexDirection: 'row',
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
            }}
          >
            <Icon
              name={noDate ? 'circle-check' : 'calendar-x'}
              size={14}
              color={noDate ? t.colors.accentDark : t.colors.textMuted}
            />
            <Txt size={13} weight="600" color={noDate ? t.colors.accentDark : t.colors.textMuted}>
              I don&apos;t have a date yet
            </Txt>
          </Pressable>
        </ScrollView>

        <DecoLayer
          items={[{ icon: 'car-front', size: 22, x: 320, y: 400, opacity: 0.5 }]}
          color={t.colors.decoration}
        />
      </View>

      <View style={{ gap: 8, paddingTop: 14, paddingHorizontal: 20, paddingBottom: 20 }}>
        <OnboardingButton
          label="Set my goal"
          disabled={!canSetGoal}
          onPress={() => finish(noDate ? null : selected)}
        />
        <OnboardingButton
          label="Skip for now"
          variant="soft"
          fontSize={14}
          paddingVertical={13}
          onPress={() => finish(null)}
        />
      </View>
    </GradientScreen>
  );
}

function MonthArrow({
  direction, disabled, onPress,
}: {
  direction: 'prev' | 'next';
  disabled?: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={direction === 'prev' ? 'Previous month' : 'Next month'}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={10}
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.colors.sage50,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon
        name={direction === 'prev' ? 'chevron-left' : 'chevron-right'}
        size={18}
        color={t.colors.textSecondary}
      />
    </Pressable>
  );
}

interface DayCellProps {
  day: number | null;
  weekend: boolean;
  year: number;
  month: number;
  today: Date;
  selected: string | null;
  onPress: (key: string) => void;
}

function DayCell({ day, weekend, year, month, today, selected, onPress }: DayCellProps) {
  const t = useTheme();

  if (day === null) return <View style={{ flex: 1, height: 34 }} />;

  const key = dateKey(year, month, day);
  const cellDate = new Date(year, month, day);
  const isPast = cellDate.getTime() < today.getTime();
  const isToday = cellDate.getTime() === today.getTime();
  const isSelected = selected === key;

  const textColor = isSelected
    ? t.colors.textInverse
    : isPast
      ? t.colors.textMuted
      : isToday
        ? t.colors.blue800
        : weekend
          ? t.colors.textSecondary
          : t.colors.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={cellDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
      accessibilityState={{ selected: isSelected, disabled: isPast }}
      disabled={isPast}
      onPress={() => onPress(key)}
      style={{
        flex: 1,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        opacity: isPast ? 0.5 : 1,
        ...(isSelected
          ? {
              backgroundColor: t.colors.accent,
              borderBottomWidth: 3,
              borderBottomColor: t.colors.accentDark,
              shadowColor: t.colors.accentDark,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 3,
            }
          : isToday
            ? { borderWidth: 1.5, borderColor: t.colors.blue800 }
            : null),
      }}
    >
      <Txt size={13} weight={isSelected || isToday ? '700' : '400'} color={textColor}>
        {day}
      </Txt>
    </Pressable>
  );
}
