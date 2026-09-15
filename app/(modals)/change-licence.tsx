import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { NavBar } from "@/components/settings/NavBar";
import { Icon } from "@/components/ui/Icon";
import { Screen, ScreenScroll, Txt } from "@/components/ui/primitives";
import {
  LICENCE_CATEGORIES,
  LICENCE_GROUPS,
  pickableLicences,
  type LicenceGroup,
} from "@/constants/licences";
import { DEMO_BUNDLE } from "@/data/demo-bundle";
import { remoteContentStore } from "@/data/remoteContent";
import { useT } from "@/features/i18n/useT";
import { useSettings } from "@/store/SettingsProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { questionAppliesTo, type Question } from "@/types/content";
import type { StringKey } from "@/features/i18n/strings";

/**
 * Change licence category.
 *
 * The exam paper is the same for every category — 32 questions, 25 minutes,
 * 68 of 74 points — but the catalogue tags every question with the categories
 * it is asked for, and a lorry candidate is asked about tachographs where a
 * motorcyclist gets counter-steering. This picker chooses which slice of the
 * catalogue the whole app draws from: lessons, mocks, readiness.
 *
 * Applies immediately, like the language pickers: nothing to download,
 * nothing to restart. Progress is kept per question, so switching back and
 * forth loses nothing.
 */
export default function LicenceModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { licenceCategory, update } = useSettings();

  const contentVersion = React.useSyncExternalStore(
    remoteContentStore.subscribe,
    remoteContentStore.getVersion,
  );
  const counts = React.useMemo(
    () => countByLicence(DEMO_BUNDLE.questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- contentVersion is the bundle's change signal
    [contentVersion],
  );

  const pickable = pickableLicences(licenceCategory);

  const select = (code: string) => {
    update({ licenceCategory: code });
    router.back();
  };

  return (
    <Screen edges={["top", "bottom"]}>
      <NavBar title={tr("licence.navTitle")} action="close" />

      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 4,
          paddingBottom: 24,
          gap: 14,
        }}
      >
        <Txt size={22} weight="700">
          {tr("licence.heading")}
        </Txt>
        <Txt size={13} color={t.colors.textSecondary} lineHeight={19}>
          {tr("licence.subtitle")}
        </Txt>

        {LICENCE_GROUPS.map((group) => {
          const inGroup = pickable.filter((l) => l.group === group);
          if (inGroup.length === 0) return null;
          return (
            <View key={group} style={{ gap: 8 }}>
              <Txt
                size={11}
                weight="700"
                color={t.colors.textMuted}
                style={{ marginTop: 6 }}
              >
                {tr(groupKey(group)).toUpperCase()}
              </Txt>
              {inGroup.map((licence) => {
                const selected = licence.code === licenceCategory;
                const count = counts[licence.code] ?? 0;
                return (
                  <Pressable
                    key={licence.code}
                    onPress={() => select(licence.code)}
                    disabled={count === 0}
                    accessibilityRole="button"
                    accessibilityLabel={`${licence.code} — ${tr(licenceKey(licence.code))}`}
                    accessibilityState={{ selected, disabled: count === 0 }}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      padding: 14,
                      minHeight: 64,
                      borderRadius: t.radius.lg,
                      backgroundColor: selected
                        ? t.colors.sage50
                        : t.colors.surface,
                      borderWidth: selected ? 2 : StyleSheet.hairlineWidth * 2,
                      borderColor: selected ? t.colors.accent : t.colors.border,
                      opacity: pressed ? 0.85 : count === 0 ? 0.5 : 1,
                    })}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: t.radius.md,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: selected
                          ? t.colors.blue900
                          : t.colors.sage50,
                      }}
                    >
                      <Icon
                        name={licence.icon}
                        size={22}
                        color={
                          selected ? t.colors.onBlue : t.colors.onSurfaceAlt
                        }
                      />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Txt size={16} weight="800">
                        {licence.code}
                        <Txt
                          size={14}
                          weight="600"
                          color={t.colors.textSecondary}
                        >
                          {"  ·  "}
                          {tr(licenceKey(licence.code))}
                        </Txt>
                      </Txt>
                      <Txt size={12} color={t.colors.textMuted}>
                        {tr("licence.minAge", { age: licence.minAge })}
                        {" · "}
                        {tr("licence.questions", { count })}
                      </Txt>
                    </View>
                    {selected ? (
                      <Icon
                        name="circle-check"
                        size={20}
                        color={t.colors.accentDark}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScreenScroll>
    </Screen>
  );
}

function groupKey(group: LicenceGroup): StringKey {
  return `licence.group.${group}` as StringKey;
}

function licenceKey(code: string): StringKey {
  return `licence.${code}` as StringKey;
}

/** How many catalogue questions each category is asked; the picker shows it per row. */
function countByLicence(questions: Question[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const licence of LICENCE_CATEGORIES) {
    counts[licence.code] = questions.filter((q) =>
      questionAppliesTo(q, licence.code),
    ).length;
  }
  return counts;
}
