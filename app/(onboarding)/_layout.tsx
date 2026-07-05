import { Tabs } from 'expo-router';
import { OnboardingProvider } from '../../src/context/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        {/* Hide the new-guard onboarding flow from the bottom tab bar */}
        <Tabs.Screen name="new-guard" options={{ href: null }} />
      </Tabs>
    </OnboardingProvider>
  );
}