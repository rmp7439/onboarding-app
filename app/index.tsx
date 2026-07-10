import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../src/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkEmployeeSession = async () => {
      try {
        const storedId = await AsyncStorage.getItem('employeeId');
        if (storedId) {
          // Employee is already registered, skip to Profile
          router.replace('/(onboarding)/profile');
        } else {
          // No employee found, proceed to normal registration flow
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        router.replace('/(auth)/login');
      }
    };

    checkEmployeeSession();
  }, []);

  // Display a loading indicator while checking storage
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});