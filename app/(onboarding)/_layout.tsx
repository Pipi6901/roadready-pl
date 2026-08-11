import { Stack } from 'expo-router';
import React from 'react';

/** Onboarding flow: adapty-onboarding (the whole Adapty-hosted funnel) → paywall. */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
