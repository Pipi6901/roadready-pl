import { Stack } from 'expo-router';
import React from 'react';

/** Onboarding flow: welcome → country → language → goal → paywall. */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
