import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { validateOTP } from '../../src/utils/validation';

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');

  const isValid = validateOTP(otp);

  const handleVerify = () => {
    if (isValid) {
      router.replace('/(onboarding)/home');
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle 
          title="Verify OTP" 
          subtitle="Enter the code sent to your mobile device" 
          style={styles.header} 
        />
        <Card style={styles.card}>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor={colors.textSecondary}
          />
        </Card>
      </View>
      <View style={styles.footer}>
        <Button 
          title="Verify & Proceed" 
          onPress={handleVerify} 
          disabled={!isValid} 
          style={styles.button} 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  content: { flex: 1 },
  header: { marginBottom: spacing.xl, marginTop: spacing.xl },
  card: { padding: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.lg,
    color: colors.text,
    backgroundColor: colors.surface,
    textAlign: 'center',
    letterSpacing: 4,
  },
  footer: { paddingVertical: spacing.md, marginTop: spacing.md },
  button: { width: '100%' },
});