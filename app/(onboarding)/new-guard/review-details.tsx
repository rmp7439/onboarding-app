import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, Button } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useOnboarding } from '../../../src/context/OnboardingContext';

export default function ReviewDetailsScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  const handleContinue = () => {
    router.push('/(onboarding)/new-guard/capture-photo');
  };

  const handleReupload = () => {
    router.back();
  };

  const renderVerifiedInput = (
    label: string, 
    fieldKey: keyof typeof data, 
    multiline = false, 
    keyboardType = 'default', 
    maxLength?: number
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>✓ {label}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Verified</Text>
        </View>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={data[fieldKey] as string}
        onChangeText={(text) => handleChange(fieldKey, text)}
        multiline={multiline}
        keyboardType={keyboardType as any}
        maxLength={maxLength}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>OCR Completed Successfully</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Extracted Information</Text>
          <View style={styles.divider} />

          {renderVerifiedInput('Full Name', 'fullName')}
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderVerifiedInput('DOB', 'dateOfBirth')}
            </View>
            <View style={styles.halfWidth}>
              {renderVerifiedInput('Gender', 'gender')}
            </View>
          </View>

          {renderVerifiedInput('Aadhaar Number', 'aadhaarNumber')}
          {renderVerifiedInput('Address', 'address', true)}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderVerifiedInput('City', 'city')}
            </View>
            <View style={styles.halfWidth}>
              {renderVerifiedInput('State', 'state')}
            </View>
          </View>

          {renderVerifiedInput('PIN Code', 'pinCode', false, 'numeric', 6)}
          
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.fullButton}
        />
        <Button
          title="Re-upload Aadhaar"
          variant="outline"
          onPress={handleReupload}
          style={[styles.fullButton, styles.secondaryButton]}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  content: { 
    flex: 1 
  },
  successHeader: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successIconText: {
    color: colors.white,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  successTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.success,
  },
  badge: {
    backgroundColor: '#E8F8EE', // Light green background
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: spacing.md 
  },
  halfWidth: { 
    flex: 1 
  },
  footer: { 
    paddingVertical: spacing.md, 
    marginTop: spacing.xl 
  },
  fullButton: { 
    width: '100%' 
  },
  secondaryButton: {
    marginTop: spacing.md,
  }
});