import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Row, Txt } from '@/components/ui/primitives';
import type { MockAttempt } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { cardShadow } from './shadow';

/**
 * Mock test scores over time — a bar per attempt, points above, date below.
 *
 * Answers the complaint that came up in all five competitor interviews: a
 * single readiness number tells you nothing. A row of dated results shows
 * whether the last month of work actually moved anything.
 */

/** Six fits the width at a readable bar size; older attempts are still stored. */
const MAX_BARS = 6;
/** A 0% attempt still needs to be visible as a bar rather than vanish. */
const MIN_BAR_HEIGHT = 4;
const MAX_BAR_HEIGHT = 100;

function dayLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

interface Props {
  attempts: MockAttempt[];
  passMark: number;
  /** Points on offer in a full paper — 74 in Poland, the question count elsewhere. */
  scoreMax: number;
}

export function ScoreHistoryChart({ attempts, passMark, scoreMax }: Props) {
  const t = useTheme();

  // mockAttempts is stored newest-first; a chart has to read left to right in
  // time, so the slice is reversed rather than the store.
  const shown = React.useMemo(() => attempts.slice(0, MAX_BARS).reverse(), [attempts]);

  // One bar is not a history — it invites comparing a result against nothing.
  if (shown.length < 2) return null;

  const passPct = Math.round((passMark / scoreMax) * 100);

  return (
    <View
      style={[
        {
          borderRadius: t.radius.lg,
          backgroundColor: t.colors.surface,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: t.colors.border,
          padding: 16,
          gap: 14,
        },
        cardShadow(t, 16),
      ]}
    >
      <Row style={{ alignItems: 'center' }}>
        <Txt size={14} weight="700" style={{ flex: 1 }}>
          Your last results
        </Txt>
        <Txt size={12} color={t.colors.textSecondary}>
          Pass mark {passMark} / {scoreMax}
        </Txt>
      </Row>

      {/* alignItems flex-end is what keeps the date labels on one baseline —
          the columns are different heights, only their bottoms line up. */}
      <Row style={{ alignItems: 'flex-end', gap: 8 }}>
        {shown.map((a) => {
          // Points, not answers: a.score and a.total both come out of
          // scoreMockSession already weighted.
          const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
          const date = dayLabel(a.finishedAt);
          return (
            <View
              key={a.finishedAt}
              accessible
              accessibilityLabel={`${date}: ${a.score} of ${a.total} points, ${a.passed ? 'passed' : 'not passed'}`}
              style={{ flex: 1, alignItems: 'center', gap: 6 }}
            >
              <Txt
                size={11}
                weight="700"
                color={a.passed ? t.colors.successText : t.colors.textSecondary}
              >
                {a.score}
              </Txt>
              <View
                style={{
                  width: 24,
                  height: Math.max(MIN_BAR_HEIGHT, Math.min(MAX_BAR_HEIGHT, pct)),
                  borderRadius: 6,
                  backgroundColor: a.passed ? t.colors.success : t.colors.sage200,
                }}
              />
              {/* textSecondary, not textMuted: the muted token is #9CA6A0 and
                  fails AA on white (docs/04-design-system.md §1), which at
                  10 px matters more than anywhere else on the screen. */}
              <Txt size={10} color={t.colors.textSecondary}>
                {date}
              </Txt>
            </View>
          );
        })}
      </Row>

      {/* NFR-07: pass and fail must not be signalled by colour alone. */}
      <Txt size={11} color={t.colors.textSecondary}>
        Bars show points scored. Green marks a pass — {passPct}% of the points on
        offer or above.
      </Txt>
    </View>
  );
}
