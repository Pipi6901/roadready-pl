import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';

export interface RoutePoint {
  x: number;
  y: number;
}

interface TopicRouteProps {
  points: RoutePoint[];
  width: number;
  height: number;
}

/**
 * The road that links the topic nodes — mockup "Connector" + "Road Dashes".
 * A thick routeLine stroke with a dashed centre line on top, S-curved between
 * consecutive nodes so the map reads as a winding road rather than a zigzag.
 */
export function TopicRoute({ points, width, height }: TopicRouteProps) {
  const t = useTheme();

  if (points.length < 2) return null;

  const d = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const bend = (p.y - prev.y) / 2;
      return `C ${prev.x} ${prev.y + bend} ${p.x} ${p.y - bend} ${p.x} ${p.y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height} style={{ pointerEvents: 'none', position: 'absolute', left: 0, top: 0 }}>
      <Path d={d} stroke={t.colors.routeLine} strokeWidth={16} strokeLinecap="round" fill="none" />
      <Path
        d={d}
        stroke={t.colors.surface}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="12 16"
        fill="none"
      />
    </Svg>
  );
}
