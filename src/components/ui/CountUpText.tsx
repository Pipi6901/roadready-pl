import React from 'react';
import { Animated, Easing, View } from 'react-native';

import { Burst } from './Burst';
import { Txt } from './primitives';

interface CountUpTextProps {
  value: number;
  suffix?: string;
  duration?: number;
  size?: number;
  weight?: '400' | '600' | '700' | '800';
  color?: string;
  /** Fires a particle burst once the count-up lands, e.g. on a perfect score. */
  celebrate?: boolean;
}

/** Animates a number counting up from 0 to `value` on mount / value change. */
export function CountUpText({ value, suffix = '', duration = 900, size, weight = '800', color, celebrate }: CountUpTextProps) {
  const [display, setDisplay] = React.useState(0);
  const [burstActive, setBurstActive] = React.useState(false);
  const progress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    progress.setValue(0);
    setDisplay(0);
    setBurstActive(false);

    const id = progress.addListener(({ value: v }) => setDisplay(Math.round(v * value)));
    Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && celebrate) setBurstActive(true);
    });

    return () => progress.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View>
      <Txt size={size} weight={weight} color={color} numeric>
        {display}
        {suffix}
      </Txt>
      {celebrate ? <Burst active={burstActive} /> : null}
    </View>
  );
}
