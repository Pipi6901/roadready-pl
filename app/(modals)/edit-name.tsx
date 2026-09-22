import { useRouter } from 'expo-router';
import React from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/settings/Avatar';
import { NavBar } from '@/components/settings/NavBar';
import { Button, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useT } from '@/features/i18n/useT';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

const MAX_LENGTH = 24;

/**
 * Edit the display name shown on the Profile tab.
 *
 * There are no accounts (ADR-002), so this is the only "identity" the app
 * has: a local string that seeds the avatar initials and the greeting. The
 * avatar above the field previews the initials as they are typed.
 */
export default function EditNameModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardHeight();
  const { displayName, update } = useSettings();
  const [draft, setDraft] = React.useState(displayName);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0 && trimmed !== displayName;

  const save = () => {
    if (!canSave) return;
    update({ displayName: trimmed });
    router.back();
  };

  // The screen's own bottom inset is already under the keyboard when it is
  // up, so only what sticks out above it has to be made up for.
  const keyboardPad = Math.max(0, keyboard - insets.bottom);

  return (
    <Screen edges={['top', 'bottom']}>
      <NavBar title={tr('editName.navTitle')} action="close" />

      <View style={{ flex: 1, paddingBottom: keyboardPad }}>
        {/* Scrolls rather than squeezes: with the keyboard up a small phone
            has barely 300px left, and the avatar must not push the field out
            of reach. */}
        <ScreenScroll
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16, gap: 14 }}
        >
          <Txt size={22} weight="700">
            {tr('editName.heading')}
          </Txt>
          <Txt size={13} color={t.colors.textSecondary} lineHeight={19}>
            {tr('editName.subtitle')}
          </Txt>

          <Pressable onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <Avatar name={trimmed || displayName} size={72} radius={24} fontSize={24} edge={4} />
            </View>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              minHeight: 52,
              borderRadius: t.radius.lg,
              backgroundColor: t.colors.surface,
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: t.colors.accent,
            }}
          >
            <TextInput
              value={draft}
              onChangeText={(v) => setDraft(v.slice(0, MAX_LENGTH))}
              placeholder={tr('editName.placeholder')}
              placeholderTextColor={t.colors.textMuted}
              accessibilityLabel={tr('editName.navTitle')}
              autoFocus
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={save}
              maxLength={MAX_LENGTH}
              style={{ flex: 1, fontSize: 17, fontWeight: '600', color: t.colors.textPrimary, padding: 0 }}
            />
            <Txt size={11} color={t.colors.textMuted} numeric>
              {draft.length}/{MAX_LENGTH}
            </Txt>
          </View>
        </ScreenScroll>

        {/* Outside the scroll view: Save stays put above the keyboard instead
            of scrolling away behind it. */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Button label={tr('editName.save')} onPress={save} disabled={!canSave} />
        </View>
      </View>
    </Screen>
  );
}
