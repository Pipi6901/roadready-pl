import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SaveButton } from '@/components/SaveButton';
import { NavBar } from '@/components/practice/NavBar';
import { QuestionRunner } from '@/components/practice/QuestionRunner';
import { cardShadow } from '@/components/practice/shadow';
import { Icon } from '@/components/ui/Icon';
import { Button, Card, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useT } from '@/features/i18n/useT';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';
import type { DisplayQuestion } from '@/types/content';

/**
 * Saved questions — the bookmarks, as a list, and as a practice session.
 *
 * The list is the point of the screen: a learner who bookmarked a question in
 * the exam wants to read it again, not be quizzed on it at once. Tapping a
 * row opens that one question in the same card runner Weak Spots uses;
 * "Practise all" runs the whole list. Either way the list is frozen for the
 * session — un-bookmarking mid-run must not pull the card out from under the
 * learner, so the runner works from a snapshot.
 */
export default function SavedScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { getQuestion, getTopic } = useContent();
  const progress = useProgress();

  const [session, setSession] = React.useState<DisplayQuestion[] | null>(null);

  // Newest first: the question saved a minute ago in the exam is the one the
  // learner came here for.
  const saved = React.useMemo(
    () =>
      [...progress.savedQuestionIds]
        .reverse()
        .map((id) => getQuestion(id))
        .filter((q): q is DisplayQuestion => !!q),
    [progress.savedQuestionIds, getQuestion],
  );

  const goHome = () => router.replace('/(tabs)');

  if (session) {
    return (
      <QuestionRunner
        questions={session}
        summaryTitle={tr('saved.summaryTitle')}
        summarySubtitle={tr('saved.summarySubtitle')}
        onExit={() => setSession(null)}
        exitLabel={tr('saved.backToList')}
      />
    );
  }

  if (!saved.length) {
    return (
      <Screen>
        <NavBar title={tr('saved.title')} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
            }}
          >
            <Icon name="bookmark" size={44} color={t.colors.onSurfaceAlt} />
          </View>
          <Txt size={20} weight="700" align="center">
            {tr('saved.emptyTitle')}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" style={{ maxWidth: 280 }}>
            {tr('saved.emptyBody')}
          </Txt>
          <Button label={tr('saved.backHome')} onPress={goHome} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <NavBar title={tr('saved.title')} />

      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 12 }}
      >
        <Card bg={t.colors.surface} gap={4}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt size={13} weight="700" color={t.colors.textSecondary}>
              {tr('saved.count', { count: saved.length })}
            </Txt>
            <Icon name="bookmark" size={16} color={t.colors.accentDark} fill={t.colors.accent} />
          </Row>
          <Txt size={12} color={t.colors.textMuted}>
            {tr('saved.hint')}
          </Txt>
        </Card>

        {saved.map((q) => (
          <SavedRow
            key={q.id}
            question={q}
            topicName={getTopic(q.topicId)?.name ?? ''}
            onPress={() => setSession([q])}
          />
        ))}
      </ScreenScroll>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}>
        <Button label={tr('saved.practiseAll')} onPress={() => setSession(saved)} />
      </View>
    </Screen>
  );
}

function SavedRow({
  question, topicName, onPress,
}: { question: DisplayQuestion; topicName: string; onPress: () => void }) {
  const t = useTheme();

  // Two controls side by side, not one inside the other: the bookmark is its
  // own button, and a button nested in a button is invalid on the web and
  // reads as one control to a screen reader.
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 6,
          borderRadius: t.radius.lg,
          backgroundColor: t.colors.surface,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: t.colors.sage100,
        },
        cardShadow(t),
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${topicName}. ${question.text}`}
        onPress={onPress}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 12,
          paddingLeft: 16,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <Txt size={11} weight="700" color={t.colors.textMuted}>
            {topicName.toUpperCase()}
          </Txt>
          <Txt size={14} weight="600" numberOfLines={2}>
            {question.text}
          </Txt>
          {question.translation?.text ? (
            <Txt size={12} color={t.colors.textSecondary} numberOfLines={1}>
              {question.translation.text}
            </Txt>
          ) : null}
        </View>
        <Icon name="chevron-right" size={18} color={t.colors.textMuted} />
      </Pressable>

      {/* Un-saving is the natural gesture on a list of saved things, and it
          should not take a detour through the card to do it. */}
      <SaveButton questionId={question.id} size={18} />
    </View>
  );
}
