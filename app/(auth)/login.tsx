import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Input, Button, SectionTitle } from '../../src/components';
import { colors, spacing, radius, typography } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  const handleNumberChange = (text: string) => {
    setMobileNumber(text);
    if (error) {
      setError('');
    }
  };

  const handleContinue = () => {
    // Validate if the input contains exactly 10 numeric digits
    const isValid = /^\d{10}$/.test(mobileNumber);
    
    if (!isValid) {
      setError('Please enter a valid mobile number.');
      return;
    }

    router.push('/(auth)/otp');
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        <SectionTitle 
          title="Employee Onboarding" 
          subtitle="Sign in to continue" 
          style={styles.header}
        />

        <Input
          label="Mobile Number"
          placeholder="Enter Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={mobileNumber}
          onChangeText={handleNumberChange}
          error={error}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={mobileNumber.length !== 10}
          onPress={handleContinue}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    marginTop: spacing['3xl'],
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  header: {
    marginBottom: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.md,
  },
  button: {
    width: '100%',
  },
});