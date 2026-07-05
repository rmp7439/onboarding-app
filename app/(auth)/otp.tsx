import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Input, Button, SectionTitle } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length === 6) {
      router.replace('/(onboarding)/home');
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <SectionTitle
          title="Verify OTP"
          subtitle="We've sent a 6-digit OTP to your mobile number."
          style={styles.sectionTitle}
        />

        <Input
          label=""
          placeholder="000000"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          autoFocus={true}
          style={styles.otpInput}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity 
            disabled={timer > 0} 
            onPress={handleResend}
            activeOpacity={0.8}
          >
            <Text style={[styles.resendLink, timer > 0 && styles.resendLinkDisabled]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.timerText}>
          Countdown: {formatTime(timer)}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Verify"
          disabled={otp.length !== 6}
          onPress={handleVerify}
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
  header: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.lg,
  },
  backText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: spacing['2xl'],
  },
  otpInput: {
    textAlign: 'center',
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 8,
    height: 80,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  resendLink: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  resendLinkDisabled: {
    color: colors.border,
  },
  timerText: {
    textAlign: 'center',
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  footer: {
    paddingVertical: spacing.md,
  },
  button: {
    width: '100%',
  },
});