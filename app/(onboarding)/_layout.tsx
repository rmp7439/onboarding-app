import { Tabs } from 'expo-router';

export default function GuardLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      {/* Hide the new-guard onboarding flow from the bottom tab bar */}
      <Tabs.Screen name="new-guard" options={{ href: null }} />
    </Tabs>
  );
}