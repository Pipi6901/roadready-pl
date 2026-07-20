import React from 'react';
import { View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';

/** Mockup frames are drawn on a 375×812 canvas; coordinates below are that space. */
const FRAME_W = 375;
const FRAME_H = 812;

export interface DecoItem {
  icon: IconName;
  size: number;
  x: number;
  y: number;
  rotate?: number;
  opacity?: number;
}

interface DecoLayerProps {
  items: DecoItem[];
  color: string;
  /** Applied to every item that does not carry its own opacity. */
  opacity?: number;
  frameWidth?: number;
  frameHeight?: number;
}

/**
 * Scattered background icons. Items past the middle of the mockup frame are
 * anchored to the opposite edge instead of to left/top, so the composition
 * keeps its balance on screens wider or taller than the 375×812 mockup.
 */
export function DecoLayer({
  items, color, opacity = 1, frameWidth = FRAME_W, frameHeight = FRAME_H,
}: DecoLayerProps) {
  return (
    <>
      {items.map((d, i) => (
        <View
          key={`${d.icon}-${i}`}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            // Must live in style, not as a prop: the prop form is a no-op in
            // RN 0.86 / RN-Web, and the decoration would swallow every tap.
            pointerEvents: 'none',
            position: 'absolute',
            ...(d.x + d.size / 2 <= frameWidth / 2
              ? { left: d.x }
              : { right: Math.max(0, frameWidth - d.x - d.size) }),
            ...(d.y + d.size / 2 <= frameHeight / 2
              ? { top: d.y }
              : { bottom: Math.max(0, frameHeight - d.y - d.size) }),
            opacity: d.opacity ?? opacity,
            transform: d.rotate ? [{ rotate: `${d.rotate}deg` }] : undefined,
          }}
        >
          <Icon name={d.icon} size={d.size} color={color} />
        </View>
      ))}
    </>
  );
}

interface DotGridProps {
  width: number;
  height: number;
  color: string;
  opacity: number;
  /** Mockup grid origin and pitch. */
  originX: number;
  originY: number;
  stepX: number;
  stepY: number;
  dotSize?: number;
}

/** Dotted paper texture. Tiled to the real viewport rather than the mockup's fixed count. */
export function DotGrid({
  width, height, color, opacity, originX, originY, stepX, stepY, dotSize = 3,
}: DotGridProps) {
  const cols = Math.max(0, Math.ceil((width - originX) / stepX));
  const rows = Math.max(0, Math.ceil((height - originY) / stepY));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ pointerEvents: 'none', position: 'absolute', left: 0, top: 0, width, height }}
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <View
            key={`${r}-${c}`}
            style={{
              position: 'absolute',
              left: originX + c * stepX,
              top: originY + r * stepY,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              opacity,
            }}
          />
        )),
      )}
    </View>
  );
}
