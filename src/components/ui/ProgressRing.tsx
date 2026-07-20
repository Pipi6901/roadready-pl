import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';
import { Txt } from './primitives';

interface ProgressRingProps {
  /** 0..1 */
  value: number;
  size?: number;
  /** Ring thickness. Mockup uses innerRadius 0.72 on a 64px ring ≈ 9px stroke. */
  thickness?: number;
  trackColor?: string;
  fillColor?: string;
  label?: string;
  labelSize?: number;
}

export function ProgressRing({
  value, size = 64, thickness = 9, trackColor, fillColor, label, labelSize = 14,
}: ProgressRingProps) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor ?? t.colors.sage100}
          strokeWidth={thickness}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={fillColor ?? t.colors.success}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={`${circumference * pct} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {label ? (
        <Txt size={labelSize} weight="700">
          {label}
        </Txt>
      ) : null}
    </View>
  );
}
