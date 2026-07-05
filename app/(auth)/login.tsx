import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { validatePhoneNumber } from '../../src/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const isValid = validatePhoneNumber(phone);

  const handleContinue = () => {
    if (isValid) {
      router.push('/otp');
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle 
          title="Sign In" 
          subtitle="Enter your mobile number to continue" 
          style={styles.header} 
        />
        <Card style={styles.card}>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Mobile Number"
            keyboardType="numeric"
            maxLength={10}
            placeholderTextColor={colors.textSecondary}
          />
        </Card>
      </View>
      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue} 
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
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  footer: { paddingVertical: spacing.md, marginTop: spacing.md },
  button: { width: '100%' },
});