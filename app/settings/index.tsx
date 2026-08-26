import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Alert, Linking, View } from 'react-native';

import { Avatar } from '@/components/settings/Avatar';
import { NavBar } from '@/components/settings/NavBar';
import { formatDate, planLabel } from '@/components/settings/plan';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection, useCardShadow } from '@/components/settings/SettingsSection';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { Slider } from '@/components/ui/Slider';
import { COUNTRY_SELECTOR_ENABLED } from '@/constants/flags';
import { PRIVACY_POLICY_URL } from '@/constants/legal';
import { useMediaPack } from '@/features/media/useMediaPack';
import { requestNotificationPermission } from '@/features/notifications/reminders';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { formatTime } from '@/utils/time';

const VOICE_SPEED_MIN = 0.5;
const VOICE_SPEED_MAX = 2;
// Matches the spacing between major and minor ticks, so the thumb can only
// ever land exactly on one of them.
const VOICE_SPEED_STEP = 0.125;
const VOICE_SPEED_TICKS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const VOICE_SPEED_MINOR_TICKS = [0.625, 0.875, 1.125, 1.375, 1.625, 1.875];

/** Sizes are only ever shown to help judge a download, so one decimal is plenty. */
function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
  const media = useMediaPack();

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

  const onToggleDailyReminder = async (enabled: boolean) => {
    if (!enabled) {
      settings.update({ dailyReminder: false });
      return;
    }
    const granted = await requestNotificationPermission();
    if (!granted) {
      Alert.alert(
        'Notifications are off',
        'Enable notifications for RoadReady in your device Settings to get a daily reminder.',
      );
      return;
    }
    settings.update({ dailyReminder: true });
  };

  const onDeleteMedia = () => {
    Alert.alert(
      'Delete downloaded media?',
      'Illustrations and clips will be streamed again next time you need them, so this only frees space — no progress is lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => media.remove() },
      ],
    );
  };

  const openLegal = async (url: string, title: string) => {
    // App Review checks that a subscription app links to a reachable privacy
    // policy from inside the app, not only from the store listing.
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(title, `Could not open the browser. The document is at ${url}`);
    }
  };

  // Local draft so dragging feels instant; the store only writes once the
  // finger lifts (see Slider's onSlidingComplete), not on every pixel moved.
  const [voiceSpeedDraft, setVoiceSpeedDraft] = React.useState(settings.voiceSpeed);
  React.useEffect(() => setVoiceSpeedDraft(settings.voiceSpeed), [settings.voiceSpeed]);

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

          {COUNTRY_SELECTOR_ENABLED ? (
            <SettingsSection title="Country" icon="map-pin">
              <SettingsRow
                label="Country"
                value={`${country.name} ${country.flagEmoji}`}
                onPress={() => router.push('/(modals)/change-country')}
                last
              />
            </SettingsSection>
          ) : null}

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
              onPress={() => router.push('/settings/exam-date')}
              last
            />
          </SettingsSection>

          <SettingsSection title="Notifications" icon="bell" iconColor={t.colors.amberDark}>
            <SettingsRow
              label="Daily reminder"
              switchValue={settings.dailyReminder}
              onSwitchChange={(enabled) => void onToggleDailyReminder(enabled)}
            />
            <SettingsRow
              label="Reminder time"
              value={formatTime(settings.reminderTime)}
              onPress={() => router.push('/settings/reminder-time')}
              disabled={!settings.dailyReminder}
            />
            <SettingsRow
              label="Question of the Day"
              switchValue={settings.questionOfTheDay}
              onSwitchChange={(questionOfTheDay) => settings.update({ questionOfTheDay })}
              last
            />
          </SettingsSection>

          {/* Questions and explanations ship inside the binary and are refreshed
              by a ~200 KB content.json fetch, so they are never "downloaded" in
              any sense a learner would recognise. Only media is worth a real
              download — see src/features/media/mediaCache.ts. */}
          <SettingsSection title="Offline" icon="download" iconColor={t.colors.successDark}>
            <SettingsRow label="Questions and explanations" value="Included in the app" />

            {media.status.total === 0 ? (
              <SettingsRow
                label="Images and clips"
                subtitle="No illustrated questions in the current content — nothing to download."
                chevron={false}
                last
              />
            ) : (
              <>
                <SettingsRow
                  label="Images and clips"
                  value={`${media.status.cached} of ${media.status.total} · ${formatSize(media.status.bytes)}`}
                />
                <SettingsRow
                  label={
                    media.status.downloading
                      ? `Downloading… ${Math.round((media.status.progress ?? 0) * 100)}%`
                      : 'Download all media for offline use'
                  }
                  subtitle={
                    media.status.failed > 0
                      ? `${media.status.failed} file(s) could not be downloaded. Tap to try again.`
                      : media.status.cached === media.status.total
                        ? 'Everything is on this device — illustrated questions work with no connection.'
                        : undefined
                  }
                  accent
                  chevron={false}
                  disabled={media.status.downloading || media.status.cached === media.status.total}
                  onPress={media.download}
                  accessibilityHint="Downloads every question illustration and video clip to this device"
                  last={media.status.cached === 0}
                />
                {media.status.cached > 0 && (
                  <SettingsRow
                    label="Delete downloaded media"
                    danger
                    chevron={false}
                    onPress={onDeleteMedia}
                    last
                  />
                )}
              </>
            )}
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
            <SettingsRow label="Voice speed">
              <View style={{ gap: 4 }}>
                <Txt size={15} weight="700" align="center" color={t.colors.successDark}>
                  {voiceSpeedDraft.toFixed(1)}×
                </Txt>
                <Slider
                  min={VOICE_SPEED_MIN}
                  max={VOICE_SPEED_MAX}
                  step={VOICE_SPEED_STEP}
                  ticks={VOICE_SPEED_TICKS}
                  minorTicks={VOICE_SPEED_MINOR_TICKS}
                  value={voiceSpeedDraft}
                  onValueChange={setVoiceSpeedDraft}
                  onSlidingComplete={(next) => settings.update({ voiceSpeed: next })}
                  accessibilityLabel="Voice speed"
                />
              </View>
            </SettingsRow>
            <SettingsRow
              label="Auto-read questions"
              switchValue={settings.autoReadQuestions}
              onSwitchChange={(autoReadQuestions) => settings.update({ autoReadQuestions })}
              last
            />
          </SettingsSection>

          <SettingsSection title="Feedback" icon="vibrate">
            <SettingsRow
              label="Vibration"
              subtitle="Buzz on a correct answer during lessons, quizzes and reviews"
              switchValue={settings.hapticsEnabled}
              onSwitchChange={(hapticsEnabled) => {
                settings.update({ hapticsEnabled });
                // Fire directly rather than through useHaptics(): that hook
                // reads hapticsEnabled from context, which hasn't re-rendered
                // with this update yet — the whole point here is to let the
                // learner immediately feel what turning it on does.
                if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              last
            />
          </SettingsSection>

          <SettingsSection title="About" icon="info" iconColor={t.colors.textMuted}>
            <SettingsRow label="App version" value={Constants.expoConfig?.version ?? '—'} />
            <SettingsRow
              label="Privacy Policy"
              onPress={() => void openLegal(PRIVACY_POLICY_URL, 'Privacy Policy')}
              last
            />
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
