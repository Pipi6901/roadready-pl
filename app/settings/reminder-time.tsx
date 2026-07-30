import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { NavBar } from '@/components/settings/NavBar';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { Slider } from '@/components/ui/Slider';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { formatTime } from '@/utils/time';

const HOUR_TICKS = [0, 6, 12, 18, 23];
const MINUTE_TICKS = [0, 15, 30, 45];

/**
 * Reminder time editor, pushed from Settings > Notifications > Reminder time.
 * Two draggable sliders (hour, 5-minute steps) instead of a native time
 * picker — no such component exists in the project yet, and this matches the
 * app's own Slider (already used for voice speed) rather than adding a new
 * dependency for one screen.
 */
export default function ReminderTimeScreen() {
  const t = useTheme();
  const router = useRouter();
  const settings = useSettings();

  const [initialHour, initialMinute] = settings.reminderTime.split(':').map(Number);
  const [hour, setHour] = React.useState(initialHour);
  const [minute, setMinute] = React.useState(initialMinute);

  const hhmm = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const save = () => {
    settings.update({ reminderTime: hhmm });
    router.back();
  };

  return (
    <Screen>
      <NavBar title="Reminder time" />

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 28 }}>
          <Txt size={32} weight="700" align="center">
            {formatTime(hhmm)}
          </Txt>

          <View style={{ gap: 10 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt size={13} weight="600" color={t.colors.textSecondary}>
                Hour
              </Txt>
              <Txt size={13} color={t.colors.textSecondary}>
                {String(hour).padStart(2, '0')}
              </Txt>
            </Row>
            <Slider
              min={0}
              max={23}
              step={1}
              value={hour}
              ticks={HOUR_TICKS}
              onValueChange={setHour}
              accessibilityLabel="Reminder hour"
            />
          </View>

          <View style={{ gap: 10 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt size={13} weight="600" color={t.colors.textSecondary}>
                Minute
              </Txt>
              <Txt size={13} color={t.colors.textSecondary}>
                {String(minute).padStart(2, '0')}
              </Txt>
            </Row>
            <Slider
              min={0}
              max={55}
              step={5}
              value={minute}
              ticks={MINUTE_TICKS}
              onValueChange={setMinute}
              accessibilityLabel="Reminder minute"
            />
          </View>

          <OnboardingButton label="Save" onPress={save} />
        </View>
      </ScreenScroll>
    </Screen>
  );
}
