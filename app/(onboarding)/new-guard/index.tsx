import React from 'react';
import { Redirect } from 'expo-router';

export default function NewGuardIndexScreen() {
  // Bypasses the manual entry form and automatically redirects to Aadhaar upload
  // This preserves the route structure while enforcing the new flow
  return <Redirect href="/(onboarding)/new-guard/aadhaar-upload" />;
}