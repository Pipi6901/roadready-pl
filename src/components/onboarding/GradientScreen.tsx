import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

interface GradientScreenProps extends ViewProps {
  /** Second gradient stop; the first is always the theme background. */
  to: string;
}

/**
 * Onboarding steps 2–5 share a 135° background wash. The mockup's fake status
 * bar (9:41 / battery) is dropped — the real one is drawn by the OS above the
 * safe area.
 */
export function GradientScreen({ to, style, children, ...rest }: GradientScreenProps) {
  const t = useTheme();
  return (
    <LinearGradient
      colors={[t.colors.bg, to]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View style={[{ flex: 1 }, style]} {...rest}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
