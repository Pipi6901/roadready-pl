import React from 'react';
import { PanResponder, View, type LayoutChangeEvent } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

const THUMB_SIZE = 22;
const TRACK_HEIGHT = 6;
const TOUCH_HEIGHT = 28;

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  /** Values (in the min..max range) to draw a tick mark at. */
  ticks?: number[];
  /** Shorter, thinner marks drawn between the main ticks — purely visual. */
  minorTicks?: number[];
  onValueChange: (value: number) => void;
  /** Fires once, when the finger lifts — the good place to persist the value. */
  onSlidingComplete?: (value: number) => void;
  accessibilityLabel?: string;
}

/** Draggable slider with tick marks — replaces the +/- stepper so the whole
 *  track can be dragged with a finger, like a native speed control. */
export function Slider({
  min, max, step, value, ticks, minorTicks, onValueChange, onSlidingComplete, accessibilityLabel,
}: SliderProps) {
  const t = useTheme();
  const [trackWidth, setTrackWidth] = React.useState(0);

  const clampToStep = React.useCallback(
    (raw: number) => {
      const stepped = Math.round((raw - min) / step) * step + min;
      const rounded = Math.round(stepped * 100) / 100;
      return Math.min(max, Math.max(min, rounded));
    },
    [min, max, step],
  );

  const valueFromX = React.useCallback(
    (x: number) => {
      if (trackWidth <= 0) return value;
      const pct = Math.min(1, Math.max(0, x / trackWidth));
      return clampToStep(min + pct * (max - min));
    },
    [trackWidth, min, max, clampToStep, value],
  );

  // Re-read via ref so the PanResponder (created once) always calls the
  // latest handlers without needing to be rebuilt on every value change.
  const latest = React.useRef({ valueFromX, onValueChange, onSlidingComplete });
  latest.current = { valueFromX, onValueChange, onSlidingComplete };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          latest.current.onValueChange(latest.current.valueFromX(e.nativeEvent.locationX));
        },
        onPanResponderMove: (e) => {
          latest.current.onValueChange(latest.current.valueFromX(e.nativeEvent.locationX));
        },
        onPanResponderRelease: (e) => {
          const next = latest.current.valueFromX(e.nativeEvent.locationX);
          latest.current.onValueChange(next);
          latest.current.onSlidingComplete?.(next);
        },
      }),
    [],
  );

  const pct = (value - min) / (max - min);

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment') {
          const next = clampToStep(value + step);
          onValueChange(next);
          onSlidingComplete?.(next);
        } else if (e.nativeEvent.actionName === 'decrement') {
          const next = clampToStep(value - step);
          onValueChange(next);
          onSlidingComplete?.(next);
        }
      }}
      style={{ height: TOUCH_HEIGHT, justifyContent: 'center' }}
    >
      <View
        pointerEvents="none"
        style={{
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: t.colors.sage100,
          overflow: 'hidden',
        }}
      >
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: t.colors.success }} />
      </View>

      {minorTicks ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}>
          {minorTicks.map((tickValue) => {
            const tickPct = (tickValue - min) / (max - min);
            return (
              <View
                key={tickValue}
                style={{
                  position: 'absolute',
                  left: `${tickPct * 100}%`,
                  marginLeft: -0.5,
                  width: 1,
                  height: TRACK_HEIGHT + 2,
                  borderRadius: 0.5,
                  backgroundColor: t.colors.border,
                }}
              />
            );
          })}
        </View>
      ) : null}

      {ticks ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}>
          {ticks.map((tickValue) => {
            const tickPct = (tickValue - min) / (max - min);
            const passed = tickValue <= value + step / 2;
            return (
              <View
                key={tickValue}
                style={{
                  position: 'absolute',
                  left: `${tickPct * 100}%`,
                  marginLeft: -1,
                  width: 2,
                  height: TRACK_HEIGHT + 8,
                  borderRadius: 1,
                  backgroundColor: passed ? t.colors.successDark : t.colors.border,
                }}
              />
            );
          })}
        </View>
      ) : null}

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: `${pct * 100}%`,
          marginLeft: -THUMB_SIZE / 2,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: t.colors.success,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
        }}
      />
    </View>
  );
}
