import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, View } from 'react-native';

import { Avatar } from '@/components/settings/Avatar';
import { NavBar } from '@/components/settings/NavBar';
import { formatDate, planLabel } from '@/components/settings/plan';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection, useCardShadow } from '@/components/settings/SettingsSection';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

const VOICE_SPEED_MIN = 0.5;
const VOICE_SPEED_MAX = 2;
const VOICE_SPEED_STEP = 0.1;

/** "20:00" -> "8:00 PM". */
function formatTime(hhmm: string): string {
  const [rawH, rawM] = hhmm.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Settings — mockup frame "Settings", with one structural change.
 *
 * The mockup's ACCOUNT section (email, Change Password, Delete Account) is gone
 * on purpose: the product has no user accounts at all. Progress lives on the
 * device and the subscription is tied to the Apple ID / Google account and comes
 * back through Restore Purchase (ADR-002, scope discrepancy Р-5). There is
 * nothing to sign into, so the section is replaced by PURCHASES — restore and a
 * local progress reset — and the Log Out button at the bottom is dropped.
 */
export default function SettingsScreen() {
  const t = useTheme();
  const router = useRouter();
  const shadow = useCardShadow();
  const settings = useSettings();
  const progress = useProgress();
  const subscription = useSubscription();
  const { country } = useContent();

  const [restoring, setRestoring] = React.useState(false);

  const onRestore = async () => {
    setRestoring(true);
    try {
      const restored = await subscription.restore();
      Alert.alert(
        restored ? 'Purchase restored' : 'Nothing to restore',
        restored
          ? 'Your subscription is active again on this device.'
          : 'We could not find an active subscription for this store account.',
      );
    } finally {
      setRestoring(false);
    }
  };

  const onResetProgress = () => {
    // Destructive and unrecoverable — progress exists only on this device.
    Alert.alert(
      'Reset progress?',
      'This erases your XP, streak, mastered questions and mock test history on this device. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => progress.reset() },
      ],
    );
  };

  const onEditExamDate = () => {
    // TODO: replace with the native date picker (goal-setting screen reuse).
    Alert.alert(
      'Test date',
      settings.examDate
        ? `Your test is set for ${formatDate(settings.examDate)}.`
        : 'Set your test date to see a countdown and a readiness estimate.',
      settings.examDate
        ? [
            { text: 'Close', style: 'cancel' },
            { text: 'Clear date', style: 'destructive', onPress: () => settings.update({ examDate: null }) },
          ]
        : [{ text: 'OK' }],
    );
  };

  const onEditReminderTime = () => {
    // TODO: replace with the native time picker once notifications are wired.
    Alert.alert('Reminder time', `Daily reminder is set for ${formatTime(settings.reminderTime)}.`);
  };

  const openLegal = (doc: string) => {
    // TODO: point at the published document once the legal pages are live.
    Alert.alert(doc, `${doc} will open here once the document is published.`);
  };

  const setVoiceSpeed = (delta: number) => {
    const next = Math.round((settings.voiceSpeed + delta) * 10) / 10;
    settings.update({ voiceSpeed: Math.min(VOICE_SPEED_MAX, Math.max(VOICE_SPEED_MIN, next)) });
  };

  return (
    <Screen>
      <NavBar title="Settings" />

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 22 }}>
          {/* Mini profile — no email row, there is no account (ADR-002). */}
          <Row
            style={[
              {
                gap: 12,
                padding: 14,
                borderRadius: t.radius.lg,
                backgroundColor: t.colors.surface,
              },
              shadow,
            ]}
          >
            <Avatar name={settings.displayName} size={48} radius={16} fontSize={15} />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt size={15} weight="700">
                {settings.displayName}
              </Txt>
              <Txt size={12} color={t.colors.textSecondary}>
                Progress is stored on this device
              </Txt>
            </View>
          </Row>

          <SettingsSection title="Country" icon="map-pin">
            <SettingsRow
              label="Country"
              value={`${country.name} ${country.flagEmoji}`}
              onPress={() => router.push('/(modals)/change-country')}
              last
            />
          </SettingsSection>

          <SettingsSection title="Language" icon="languages">
            <SettingsRow
              label="Translation language"
              value={settings.localeName}
              onPress={() => router.push('/(modals)/change-language')}
              last
            />
          </SettingsSection>

          <SettingsSection title="Exam date" icon="calendar-clock" iconColor={t.colors.amberDark}>
            <SettingsRow
              label="Test date"
              value={settings.daysUntilExam !== null ? `${settings.daysUntilExam} days away` : 'Not set'}
              onPress={onEditExamDate}
              last
            />
          </SettingsSection>

          <SettingsSection title="Notifications" icon="bell" iconColor={t.colors.amberDark}>
            <SettingsRow
              label="Daily reminder"
              switchValue={settings.dailyReminder}
              onSwitchChange={(dailyReminder) => settings.update({ dailyReminder })}
            />
            <SettingsRow
              label="Reminder time"
              value={formatTime(settings.reminderTime)}
              onPress={onEditReminderTime}
              disabled={!settings.dailyReminder}
            />
            <SettingsRow
              label="Question of the Day"
              switchValue={settings.questionOfTheDay}
              onSwitchChange={(questionOfTheDay) => settings.update({ questionOfTheDay })}
              last
            />
          </SettingsSection>

          {/* The demo bundle ships inside the app binary, so there is genuinely
              nothing to download yet. In production this row reports the state
              of the downloaded content package and the action fetches it. */}
          <SettingsSection title="Offline" icon="download" iconColor={t.colors.successDark}>
            <SettingsRow label="Downloaded content" value="Demo bundle (bundled with app)" />
            <SettingsRow
              label="Download all content for offline use"
              subtitle="Included in the app for now — the downloadable content pack arrives with the full question bank."
              accent
              disabled
              chevron={false}
              last
            />
          </SettingsSection>

          <SettingsSection title="Purchases" icon="gem" iconColor={t.colors.amberDark}>
            <SettingsRow label="Current plan" value={planLabel(subscription.state)} />
            <SettingsRow label="Renewal date" value={formatDate(subscription.state.renewsAt)} />
            <SettingsRow
              label="Manage Subscription"
              onPress={() => router.push('/settings/subscription')}
            />
            <SettingsRow
              label={restoring ? 'Restoring…' : 'Restore Purchase'}
              accessibilityHint="Looks for a subscription bought with this store account"
              onPress={onRestore}
              disabled={restoring}
              chevron={false}
            />
            <SettingsRow label="Reset progress" danger onPress={onResetProgress} chevron={false} last />
          </SettingsSection>

          <SettingsSection title="Audio" icon="volume-2">
            <SettingsRow label="Voice speed" value={`${settings.voiceSpeed.toFixed(1)}×`}>
              {/* Stepper instead of a draggable slider: no slider dependency is
                  installed, and −/+ buttons are the more accessible control. */}
              <Row style={{ gap: 12 }}>
                <SpeedButton
                  icon="chevron-left"
                  label="Decrease voice speed"
                  disabled={settings.voiceSpeed <= VOICE_SPEED_MIN}
                  onPress={() => setVoiceSpeed(-VOICE_SPEED_STEP)}
                />
                <View style={{ flex: 1 }}>
                  <ProgressBar
                    value={(settings.voiceSpeed - VOICE_SPEED_MIN) / (VOICE_SPEED_MAX - VOICE_SPEED_MIN)}
                    height={6}
                    fillColor={t.colors.success}
                  />
                </View>
                <SpeedButton
                  icon="chevron-right"
                  label="Increase voice speed"
                  disabled={settings.voiceSpeed >= VOICE_SPEED_MAX}
                  onPress={() => setVoiceSpeed(VOICE_SPEED_STEP)}
                />
              </Row>
            </SettingsRow>
            <SettingsRow
              label="Auto-read questions"
              switchValue={settings.autoReadQuestions}
              onSwitchChange={(autoReadQuestions) => settings.update({ autoReadQuestions })}
              last
            />
          </SettingsSection>

          <SettingsSection title="About" icon="info" iconColor={t.colors.textMuted}>
            <SettingsRow label="App version" value={Constants.expoConfig?.version ?? '—'} />
            <SettingsRow label="Terms of Service" onPress={() => openLegal('Terms of Service')} />
            <SettingsRow label="Privacy Policy" onPress={() => openLegal('Privacy Policy')} last />
          </SettingsSection>

          {/* NFR-11. Deliberately no DVSA or Crown Copyright wording — that
              attribution is only correct once the content licence is signed. */}
          <Txt size={11} color={t.colors.textMuted} lineHeight={16}>
            Contains public sector information licensed under the Open Government Licence v3.0.
          </Txt>
        </View>
      </ScreenScroll>
    </Screen>
  );
}

function SpeedButton({
  icon, label, onPress, disabled,
}: {
  icon: 'chevron-left' | 'chevron-right';
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.colors.sage100,
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
      })}
    >
      <Icon name={icon} size={18} color={t.colors.onSurfaceAlt} />
    </Pressable>
  );
}
