import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Row, Txt } from '@/components/ui/primitives';
import { useDateLocale } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEKS = 6;

const pad = (n: number) => String(n).padStart(2, '0');
export const dateKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Monday-first offset for the 1st of the month. */
const leadingBlanks = (y: number, m: number) => (new Date(y, m, 1).getDay() + 6) % 7;

interface ExamCalendarProps {
  selected: string | null;
  onSelect: (key: string) => void;
}

/**
 * Hand-built month calendar (no date library) — shared by onboarding's goal
 * screen and the settings exam-date screen, so both edit `examDate` identically.
 */
export function ExamCalendar({ selected, onSelect }: ExamCalendarProps) {
  const t = useTheme();
  const dateLocale = useDateLocale();
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = React.useState(() => {
    const seed = selected ? new Date(selected) : today;
    return { year: seed.getFullYear(), month: seed.getMonth() };
  });

  const cells = React.useMemo(() => {
    const blanks = leadingBlanks(view.year, view.month);
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    return Array.from({ length: WEEKS * 7 }, (_, i) => {
      const day = i - blanks + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    });
  }, [view]);

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(dateLocale, {
    month: 'long',
    year: 'numeric',
  });

  const atCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const next = new Date(v.year, v.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
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
        <MonthArrow direction="prev" disabled={atCurrentMonth} onPress={() => shiftMonth(-1)} />
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
              onPress={onSelect}
            />
          ))}
        </Row>
      ))}
    </View>
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
  const dateLocale = useDateLocale();

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
      accessibilityLabel={cellDate.toLocaleDateString(dateLocale, {
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
