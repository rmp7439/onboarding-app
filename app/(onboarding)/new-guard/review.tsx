import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen, Card, SectionTitle, Button } from "../../../src/components";
import { colors, spacing, typography, radius } from "../../../src/theme";
import { useOnboarding } from "../../../src/context/OnboardingContext";

export default function FinalReviewScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/(onboarding)/new-guard/success");
    }, 2000);
  };

  const handleBack = () => {
    if (!isSubmitting) {
      router.back();
    }
  };

  const renderRow = (label: string, value: string) => (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle
          title="Final Review"
          subtitle="Review all information before submitting the registration."
          style={styles.header}
        />

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.divider} />
          {renderRow("Full Name", data.fullName || "-")}
          {renderRow("Date of Birth", data.dateOfBirth || "-")}
          {renderRow("Gender", data.gender || "-")}
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Aadhaar Details</Text>
          <View style={styles.divider} />
          {renderRow("Aadhaar Number", data.aadhaarNumber || "-")}
          {renderRow("Verification", "Auto-extracted ✓")}
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Address</Text>
            <Text style={styles.dataValueMultiline}>
              {`${data.address || "-"}, ${data.city || "-"}, ${data.state || "-"} - ${data.pinCode || "-"}`}
            </Text>
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Employee Photo</Text>
          <View style={styles.divider} />
          <View style={styles.attachmentRow}>
            <View style={styles.thumbnailPlaceholder}>
              <Text style={styles.thumbnailText}>📸</Text>
            </View>
            <View style={styles.attachmentInfo}>
              <Text style={styles.attachmentName}>
                {data.employeePhoto || "No photo attached"}
              </Text>
              <Text
                style={[
                  styles.attachmentStatus,
                  !data.employeePhoto && styles.attachmentStatusMissing,
                ]}
              >
                {data.employeePhoto ? "Attached ✓" : "Missing"}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Supporting Documents</Text>
          <View style={styles.divider} />
          <View style={styles.documentList}>
            {data.uploadedDocuments.length > 0 ? (
              data.uploadedDocuments.map((doc, idx) => (
                <Text key={idx} style={styles.documentItem}>
                  • {doc}
                </Text>
              ))
            ) : (
              <Text style={styles.documentItem}>No documents attached</Text>
            )}
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            disabled={isSubmitting}
            style={styles.halfButton}
          />
          <Button
            title="Submit Employee"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.halfButton}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  content: { flex: 1 },
  header: { marginBottom: spacing.lg, marginTop: spacing.md },
  sectionCard: { marginBottom: spacing.md },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
    opacity: 0.5,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  dataLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  dataValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
    flex: 2,
    textAlign: "right",
  },
  dataValueMultiline: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
    flex: 2,
    textAlign: "right",
    lineHeight: typography.lineHeight.sm,
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  thumbnailPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  thumbnailText: { fontSize: typography.fontSize.xl },
  attachmentInfo: { flex: 1 },
  attachmentName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  attachmentStatus: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
    marginTop: 2,
  },
  attachmentStatusMissing: { color: colors.error },
  documentList: { paddingLeft: spacing.xs },
  documentItem: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  footer: { paddingVertical: spacing.md, marginTop: spacing.md },
  buttonRow: { flexDirection: "row", gap: spacing.md },
  halfButton: { flex: 1 },
});