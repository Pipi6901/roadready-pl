import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';

import { Avatar } from '@/components/settings/Avatar';
import { NavBar } from '@/components/settings/NavBar';
import { formatDate, planLabel } from '@/components/settings/plan';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection, useCardShadow } from '@/components/settings/SettingsSection';
import { Icon } from '@/components/ui/Icon';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { Slider } from '@/components/ui/Slider';
import { COUNTRY_SELECTOR_ENABLED } from '@/constants/flags';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/constants/legal';
import type { StringKey } from '@/features/i18n/strings';
import { useDateLocale, useT } from '@/features/i18n/useT';
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
  if (bytes < 1024 * 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
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
  const tr = useT();
  const dateLocale = useDateLocale();
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
        tr(restored ? 'settings.restore.restoredTitle' : 'settings.restore.nothingTitle'),
        tr(restored ? 'settings.restore.restoredBody' : 'settings.restore.nothingBody'),
      );
    } finally {
      setRestoring(false);
    }
  };

  const onResetProgress = () => {
    // Destructive and unrecoverable — progress exists only on this device.
    Alert.alert(tr('settings.reset.title'), tr('settings.reset.body'), [
      { text: tr('common.cancel'), style: 'cancel' },
      { text: tr('common.reset'), style: 'destructive', onPress: () => progress.reset() },
    ]);
  };

  const onToggleDailyReminder = async (enabled: boolean) => {
    if (!enabled) {
      settings.update({ dailyReminder: false });
      return;
    }
    const granted = await requestNotificationPermission();
    if (!granted) {
      Alert.alert(tr('settings.notifOff.title'), tr('settings.notifOff.body'));
      return;
    }
    settings.update({ dailyReminder: true });
  };

  const onDeleteMedia = () => {
    Alert.alert(tr('settings.deleteMedia.title'), tr('settings.deleteMedia.body'), [
      { text: tr('common.cancel'), style: 'cancel' },
      { text: tr('common.delete'), style: 'destructive', onPress: () => media.remove() },
    ]);
  };

  const openLegal = async (url: string, title: string) => {
    // App Review checks that a subscription app links to a reachable privacy
    // policy from inside the app, not only from the store listing.
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(title, tr('settings.legal.openFailed', { url }));
    }
  };

  // Local draft so dragging feels instant; the store only writes once the
  // finger lifts (see Slider's onSlidingComplete), not on every pixel moved.
  const [voiceSpeedDraft, setVoiceSpeedDraft] = React.useState(settings.voiceSpeed);
  React.useEffect(() => setVoiceSpeedDraft(settings.voiceSpeed), [settings.voiceSpeed]);

  return (
    <Screen>
      <NavBar title={tr('settings.title')} />

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
                {tr('settings.progressOnDevice')}
              </Txt>
            </View>
          </Row>

          {COUNTRY_SELECTOR_ENABLED ? (
            <SettingsSection title={tr('settings.section.country')} icon="map-pin">
              <SettingsRow
                label={tr('settings.row.country')}
                value={`${country.name} ${country.flagEmoji}`}
                onPress={() => router.push('/(modals)/change-country')}
                last
              />
            </SettingsSection>
          ) : null}

          <SettingsSection title={tr('settings.section.language')} icon="languages">
            <SettingsRow
              label={tr('settings.row.licence')}
              value={`${settings.licenceCategory} · ${tr(`licence.${settings.licenceCategory}` as StringKey)}`}
              onPress={() => router.push('/(modals)/change-licence')}
            />
            <SettingsRow
              label={tr('settings.row.interfaceLanguage')}
              value={settings.uiLocaleName}
              onPress={() => router.push('/(modals)/change-ui-language')}
            />
            <SettingsRow
              label={tr('settings.row.questionLanguage')}
              value={settings.questionLocaleName}
              onPress={() => router.push('/(modals)/change-language')}
            />
            <SettingsRow
              label={tr('settings.row.translation')}
              value={settings.translationEnabled ? settings.localeName : tr('transLang.none')}
              onPress={() => router.push('/(modals)/change-translation')}
              last
            />
          </SettingsSection>

          <SettingsSection
            title={tr('settings.section.examDate')}
            icon="calendar-clock"
            iconColor={t.colors.amberDark}
          >
            <SettingsRow
              label={tr('settings.row.testDate')}
              value={
                settings.daysUntilExam !== null
                  ? tr('settings.daysAway', { days: settings.daysUntilExam })
                  : tr('common.notSet')
              }
              onPress={() => router.push('/settings/exam-date')}
              last
            />
          </SettingsSection>

          <SettingsSection
            title={tr('settings.section.notifications')}
            icon="bell"
            iconColor={t.colors.amberDark}
          >
            <SettingsRow
              label={tr('settings.row.dailyReminder')}
              switchValue={settings.dailyReminder}
              onSwitchChange={(enabled) => void onToggleDailyReminder(enabled)}
            />
            <SettingsRow
              label={tr('settings.row.reminderTime')}
              value={formatTime(settings.reminderTime)}
              onPress={() => router.push('/settings/reminder-time')}
              disabled={!settings.dailyReminder}
              last
            />
            {/* No "Question of the Day" row: the setting exists, nothing
                reads it yet. A switch that toggles nothing is a broken
                switch as far as anyone flipping it can tell. */}
          </SettingsSection>

          {/* Questions and explanations ship inside the binary and are refreshed
              by a ~200 KB content.json fetch, so they are never "downloaded" in
              any sense a learner would recognise. Only media is worth a real
              download — see src/features/media/mediaCache.ts. */}
          <SettingsSection
            title={tr('settings.section.offline')}
            icon="download"
            iconColor={t.colors.successDark}
          >
            <SettingsRow
              label={tr('settings.row.questionsExplanations')}
              value={tr('settings.value.includedInApp')}
            />

            {media.status.total === 0 ? (
              <SettingsRow
                label={tr('settings.row.imagesClips')}
                subtitle={tr('settings.offline.nothingToDownload')}
                chevron={false}
                last
              />
            ) : (
              <>
                <SettingsRow
                  label={tr('settings.row.imagesClips')}
                  value={tr('settings.offline.cached', {
                    cached: media.status.cached,
                    total: media.status.total,
                    size: formatSize(media.status.bytes),
                  })}
                />
                <SettingsRow
                  label={
                    media.status.downloading
                      ? tr('settings.offline.downloading', {
                          percent: Math.round((media.status.progress ?? 0) * 100),
                        })
                      : tr('settings.offline.downloadAll')
                  }
                  subtitle={
                    media.status.failed > 0
                      ? tr('settings.offline.failed', { count: media.status.failed })
                      : media.status.cached === media.status.total
                        ? tr('settings.offline.allCached')
                        : media.status.totalBytes > 0
                          ? tr('settings.offline.estimate', {
                              code: settings.licenceCategory,
                              count: media.status.total - media.status.cached,
                              size: formatSize(media.status.totalBytes - media.status.bytes),
                            })
                          : tr('settings.offline.estimateNoSize', {
                              code: settings.licenceCategory,
                              count: media.status.total - media.status.cached,
                            })
                  }
                  accent
                  chevron={false}
                  disabled={media.status.downloading || media.status.cached === media.status.total}
                  onPress={media.download}
                  accessibilityHint={tr('settings.offline.downloadHint')}
                  last={media.status.cached === 0}
                />
                {media.status.cached > 0 && (
                  <SettingsRow
                    label={tr('settings.offline.delete')}
                    danger
                    chevron={false}
                    onPress={onDeleteMedia}
                    last
                  />
                )}
              </>
            )}
          </SettingsSection>

          <SettingsSection
            title={tr('settings.section.purchases')}
            icon="gem"
            iconColor={t.colors.amberDark}
          >
            <SettingsRow label={tr('settings.row.currentPlan')} value={planLabel(subscription.state, tr)} />
            <SettingsRow
              label={tr('settings.row.renewalDate')}
              value={formatDate(subscription.state.renewsAt, dateLocale)}
            />
            <SettingsRow
              label={tr('settings.row.manageSubscription')}
              onPress={() => router.push('/settings/subscription')}
            />
            <SettingsRow
              label={tr(restoring ? 'settings.row.restoring' : 'settings.row.restorePurchase')}
              accessibilityHint={tr('settings.restoreHint')}
              onPress={onRestore}
              disabled={restoring}
              chevron={false}
            />
            <SettingsRow
              label={tr('settings.row.resetProgress')}
              danger
              onPress={onResetProgress}
              chevron={false}
              last
            />
          </SettingsSection>

          <SettingsSection title={tr('settings.section.audio')} icon="volume-2">
            <SettingsRow label={tr('settings.row.voiceSpeed')}>
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
                  accessibilityLabel={tr('settings.row.voiceSpeed')}
                />
              </View>
            </SettingsRow>
            <SettingsRow
              label={tr('settings.row.autoRead')}
              switchValue={settings.autoReadQuestions}
              onSwitchChange={(autoReadQuestions) => settings.update({ autoReadQuestions })}
              last
            />
          </SettingsSection>

          <SettingsSection title={tr('settings.section.appearance')} icon="moon">
            {/* Three options, all visible at once: a picker modal for a choice
                this small would be one tap too many. */}
            <Row style={{ gap: 8, padding: 12 }}>
              {(
                [
                  { mode: 'dark', icon: 'moon', label: tr('settings.theme.dark') },
                  { mode: 'light', icon: 'sun', label: tr('settings.theme.light') },
                  { mode: 'system', icon: 'smartphone', label: tr('settings.theme.system') },
                ] as const
              ).map((opt) => {
                const selected = settings.themeMode === opt.mode;
                return (
                  <Pressable
                    key={opt.mode}
                    onPress={() => settings.update({ themeMode: opt.mode })}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={opt.label}
                    style={({ pressed }) => ({
                      flex: 1,
                      alignItems: 'center',
                      gap: 6,
                      paddingVertical: 12,
                      borderRadius: t.radius.md,
                      backgroundColor: selected ? t.colors.sage100 : t.colors.surface,
                      borderWidth: 2,
                      borderColor: selected ? t.colors.accent : t.colors.border,
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Icon name={opt.icon} size={20} color={selected ? t.colors.accentDark : t.colors.textMuted} />
                    <Txt size={12} weight={selected ? '700' : '500'} color={selected ? t.colors.textPrimary : t.colors.textSecondary}>
                      {opt.label}
                    </Txt>
                  </Pressable>
                );
              })}
            </Row>
          </SettingsSection>

          <SettingsSection title={tr('settings.section.feedback')} icon="vibrate">
            <SettingsRow
              label={tr('settings.row.vibration')}
              subtitle={tr('settings.vibrationSubtitle')}
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

          <SettingsSection
            title={tr('settings.section.about')}
            icon="info"
            iconColor={t.colors.textMuted}
          >
            <SettingsRow
              label={tr('settings.row.appVersion')}
              value={Constants.expoConfig?.version ?? '—'}
            />
            <SettingsRow
              label={tr('settings.row.privacyPolicy')}
              onPress={() => void openLegal(PRIVACY_POLICY_URL, tr('settings.row.privacyPolicy'))}
            />
            <SettingsRow
              label={tr('settings.row.termsOfUse')}
              onPress={() => void openLegal(TERMS_OF_USE_URL, tr('settings.row.termsOfUse'))}
              last
            />
          </SettingsSection>

          {/* Source attribution: the catalogue is the ministry's public question
              bank, not a licensed DVSA-style package, so this names the source
              and disclaims affiliation — same wording as the legal pages. */}
          <Txt size={11} color={t.colors.textMuted} lineHeight={16}>
            {tr('settings.legal.attribution')}
          </Txt>
        </View>
      </ScreenScroll>
    </Screen>
  );
}
