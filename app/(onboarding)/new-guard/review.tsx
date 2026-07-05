import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useOnboarding } from '../../../src/context/OnboardingContext';

export default function ReviewScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Route to home or a dedicated success screen if one exists
      router.replace('/(onboarding)/home');
    }, 1500);
  };

  const DataRow = ({ label, value }: { label: string; value?: string | null }) => (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value || '—'}</Text>
    </View>
  );

  return (
    <Screen scrollable={false} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle
          title="Final Review"
          subtitle="Please verify all information before final submission."
          style={styles.header}
        />

        {/* Submission Status & Profile Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.profileContainer}>
              {data.selfieUri ? (
                <Image source={{ uri: data.selfieUri }} style={styles.profileImage} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profilePlaceholderText}>👤</Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.employeeName}>{data.fullName || 'Unknown'}</Text>
                <Text style={styles.employeeRole}>New Guard Registration</Text>
              </View>
            </View>
          </View>
          <View style={styles.statusBanner}>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>All required fields completed. Ready to submit.</Text>
          </View>
        </Card>

        {/* Personal Details */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.editLink} onPress={() => router.push('/(onboarding)/new-guard/review-details')}>Edit</Text>
          </View>
          <View style={styles.divider} />
          <DataRow label="Full Name" value={data.fullName} />
          <DataRow label="Date of Birth" value={data.dateOfBirth} />
          <DataRow label="Gender" value={data.gender} />
        </Card>

        {/* Contact & Address */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact & Address</Text>
            <Text style={styles.editLink} onPress={() => router.push('/(onboarding)/new-guard/review-details')}>Edit</Text>
          </View>
          <View style={styles.divider} />
          <DataRow label="Address" value={data.address} />
          <DataRow label="City" value={data.city} />
          <DataRow label="State" value={data.state} />
          <DataRow label="PIN Code" value={data.pinCode} />
        </Card>

        {/* Attached Documents Overview */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Identity & Documents</Text>
          </View>
          <View style={styles.divider} />
          
          <DataRow label="Document Number" value={data.aadhaarNumber} />
          
          <Text style={styles.previewLabel}>Document Scans</Text>
          <View style={styles.documentPreviewContainer}>
            <View style={styles.docPreviewBox}>
              <View style={styles.docPlaceholder}>
                <Text style={styles.docPlaceholderIcon}>📄</Text>
              </View>
              <Text style={styles.docPreviewText}>Front Side</Text>
            </View>
            <View style={styles.docPreviewBox}>
              <View style={styles.docPlaceholder}>
                <Text style={styles.docPlaceholderIcon}>📄</Text>
              </View>
              <Text style={styles.docPreviewText}>Back Side</Text>
            </View>
          </View>

          {data.uploadedDocuments && data.uploadedDocuments.length > 0 && (
            <View style={styles.additionalDocsContainer}>
              <Text style={styles.previewLabel}>Additional Attachments</Text>
              {data.uploadedDocuments.map((docTitle, index) => (
                <View key={index} style={styles.attachmentBadge}>
                  <Text style={styles.attachmentIcon}>📎</Text>
                  <Text style={styles.attachmentText}>{docTitle}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isSubmitting ? "Submitting..." : "Submit Registration"}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.fullButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },

  // Summary Card
  summaryCard: {
    padding: 0,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    borderColor: colors.border,
    borderWidth: 1,
  },
  summaryHeader: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
  },
  profilePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  profilePlaceholderText: {
    fontSize: 24,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  employeeName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },
  statusIcon: {
    color: colors.success,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
  },
  statusText: {
    color: colors.success,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  // Section Cards
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderColor: colors.border,
    borderWidth: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  editLink: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.6,
    marginBottom: spacing.md,
  },

  // Data Rows
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  dataLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  dataValue: {
    flex: 2,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'right',
  },

  // Previews
  previewLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  documentPreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  docPreviewBox: {
    flex: 1,
  },
  docPlaceholder: {
    height: 80,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.xs,
  },
  docPlaceholderIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  docPreviewText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  
  // Attachments
  additionalDocsContainer: {
    marginTop: spacing.md,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  attachmentIcon: {
    marginRight: spacing.sm,
    fontSize: typography.fontSize.sm,
  },
  attachmentText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },

  // Footer
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fullButton: {
    width: '100%',
  },
});