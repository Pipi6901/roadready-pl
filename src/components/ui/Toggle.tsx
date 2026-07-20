import React from 'react';
import { Animated, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

/** iOS switch metrics — kept fixed so the thumb always sits inside the track,
 *  regardless of platform (unlike the native Switch, which renders inconsistently
 *  on Android/web). */
const TRACK_WIDTH = 42;
const TRACK_HEIGHT = 25;
const THUMB_SIZE = 21;
const THUMB_INSET = 2;

interface ToggleProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

/** Custom iOS-style switch: green track, white thumb, same look on every platform. */
export function Toggle({ value, onValueChange, disabled, accessibilityLabel, accessibilityHint, style }: ToggleProps) {
  const t = useTheme();
  // Plain state (not Animated.View) drives the style: `Animated.createAnimatedComponent`
  // force-injects a `collapsable` prop meant for the native driver, which
  // react-native-web then leaks onto the DOM as an invalid attribute.
  const [progress, setProgress] = React.useState(value ? 1 : 0);

  React.useEffect(() => {
    const anim = new Animated.Value(progress);
    const id = anim.addListener(({ value: v }) => setProgress(v));
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const translateX = THUMB_INSET + progress * (TRACK_WIDTH - THUMB_SIZE - THUMB_INSET * 2);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      hitSlop={8}
      style={[
        {
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { borderRadius: TRACK_HEIGHT / 2, backgroundColor: t.colors.border }]} />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: TRACK_HEIGHT / 2, backgroundColor: t.colors.primary500, opacity: progress },
        ]}
      />
      <View
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: '#FFFFFF',
          transform: [{ translateX }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
        }}
      />
    </Pressable>
  );
}
