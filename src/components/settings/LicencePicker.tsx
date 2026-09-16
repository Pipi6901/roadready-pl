import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { LICENCE_CATEGORIES, LICENCE_GROUPS, pickableLicences, type LicenceGroup } from '@/constants/licences';
import { DEMO_BUNDLE } from '@/data/demo-bundle';
import { remoteContentStore } from '@/data/remoteContent';
import type { StringKey } from '@/features/i18n/strings';
import { useT } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';
import { questionAppliesTo, type Question } from '@/types/content';

interface LicencePickerProps {
  /** Code currently in force; drawn as selected. */
  selected: string;
  onSelect: (code: string) => void;
}

/**
 * The list of licence categories, grouped by vehicle, with the question count
 * each one gets from the catalogue. Shared by the first-launch step and the
 * Settings modal, so the two never drift apart.
 */
export function LicencePicker({ selected, onSelect }: LicencePickerProps) {
  const t = useTheme();
  const tr = useT();

  const contentVersion = React.useSyncExternalStore(remoteContentStore.subscribe, remoteContentStore.getVersion);
  const counts = React.useMemo(
    () => countByLicence(DEMO_BUNDLE.questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- contentVersion is the bundle's change signal
    [contentVersion],
  );
  const pickable = pickableLicences(selected);

  return (
    <>
      {LICENCE_GROUPS.map((group) => {
        const inGroup = pickable.filter((l) => l.group === group);
        if (inGroup.length === 0) return null;
        return (
          <View key={group} style={{ gap: 8 }}>
            <Txt size={11} weight="700" color={t.colors.textMuted} style={{ marginTop: 6 }}>
              {tr(groupKey(group)).toUpperCase()}
            </Txt>
            {inGroup.map((licence) => {
              const isSelected = licence.code === selected;
              const count = counts[licence.code] ?? 0;
              return (
                <Pressable
                  key={licence.code}
                  onPress={() => onSelect(licence.code)}
                  disabled={count === 0}
                  accessibilityRole="button"
                  accessibilityLabel={`${licence.code} — ${tr(licenceKey(licence.code))}`}
                  accessibilityState={{ selected: isSelected, disabled: count === 0 }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    minHeight: 64,
                    borderRadius: t.radius.lg,
                    backgroundColor: isSelected ? t.colors.sage50 : t.colors.surface,
                    borderWidth: isSelected ? 2 : StyleSheet.hairlineWidth * 2,
                    borderColor: isSelected ? t.colors.accent : t.colors.border,
                    opacity: pressed ? 0.85 : count === 0 ? 0.5 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: t.radius.md,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? t.colors.blue900 : t.colors.sage50,
                    }}
                  >
                    <Icon name={licence.icon} size={22} color={isSelected ? t.colors.onBlue : t.colors.onSurfaceAlt} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Txt size={16} weight="800">
                      {licence.code}
                      <Txt size={14} weight="600" color={t.colors.textSecondary}>
                        {'  ·  '}
                        {tr(licenceKey(licence.code))}
                      </Txt>
                    </Txt>
                    <Txt size={12} color={t.colors.textMuted}>
                      {tr('licence.minAge', { age: licence.minAge })}
                      {' · '}
                      {tr('licence.questions', { count })}
                    </Txt>
                  </View>
                  {isSelected ? <Icon name="circle-check" size={20} color={t.colors.accentDark} /> : null}
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </>
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
    counts[licence.code] = questions.filter((q) => questionAppliesTo(q, licence.code)).length;
  }
  return counts;
}
