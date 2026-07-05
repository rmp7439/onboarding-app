import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Screen, Card, Button } from "../../../src/components";
import { colors, spacing, typography, radius } from "../../../src/theme";
import { useOnboarding } from "../../../src/context/OnboardingContext";
import { VALIDATION } from "../../../src/constants/Validation";
import { OCR_MOCK_CONFIDENCE } from "../../../src/constants/OCR";
import {
  validateAadhaar,
  validatePinCode,
} from "../../../src/utils/validation";

const TRACKED_FIELDS = [
  "fullName",
  "dateOfBirth",
  "gender",
  "aadhaarNumber",
  "address",
  "city",
  "state",
  "pinCode",
] as const;

export default function ReviewDetailsScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [initialData] = useState(() => ({ ...data }));

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  const handleContinue = () => {
    router.push("/(onboarding)/new-guard/capture-photo");
  };

  const handleReupload = () => {
    router.back();
  };

  const { editedCount, verifiedCount } = useMemo(() => {
    let edited = 0;
    TRACKED_FIELDS.forEach((key) => {
      if (data[key] !== initialData[key]) {
        edited++;
      }
    });
    return {
      editedCount: edited,
      verifiedCount: TRACKED_FIELDS.length - edited,
    };
  }, [data, initialData]);

  const isFormValid =
    data.fullName &&
    data.dateOfBirth &&
    data.gender &&
    data.address &&
    data.city &&
    data.state &&
    validateAadhaar(data.aadhaarNumber || "") &&
    validatePinCode(data.pinCode || "");

  const renderField = (
    label: string,
    fieldKey: keyof typeof data,
    multiline = false,
    keyboardType = "default",
    maxLength?: number,
  ) => {
    const currentValue = data[fieldKey] as string;
    const initialValue = initialData[fieldKey] as string;
    const isEdited = currentValue !== initialValue;

    return (
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <View
            style={[
              styles.badge,
              isEdited ? styles.badgeEdited : styles.badgeVerified,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isEdited ? styles.badgeTextEdited : styles.badgeTextVerified,
              ]}
            >
              {isEdited ? "Edited" : "Auto-Verified"}
            </Text>
          </View>
        </View>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            isEdited && styles.inputEdited,
          ]}
          value={currentValue}
          onChangeText={(text) => handleChange(fieldKey, text)}
          multiline={multiline}
          keyboardType={keyboardType as any}
          maxLength={maxLength}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    );
  };

  return (
    <Screen scrollable={false} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summaryContainer}>
          <Card style={styles.confidenceCard}>
            <View style={styles.confidenceHeader}>
              <View>
                <Text style={styles.confidenceTitle}>OCR Confidence</Text>
                <Text style={styles.confidenceSubtitle}>
                  High accuracy detected
                </Text>
              </View>
              <Text style={styles.confidenceValue}>{OCR_MOCK_CONFIDENCE}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${OCR_MOCK_CONFIDENCE}%` },
                ]}
              />
            </View>
          </Card>

          <View style={styles.metricsRow}>
            <Card style={styles.metricCard}>
              <Text style={styles.metricNumber}>{verifiedCount}</Text>
              <Text style={styles.metricLabel}>Verified Fields</Text>
            </Card>
            <Card
              style={[
                styles.metricCard,
                editedCount > 0 && styles.metricCardEditedContainer,
              ]}
            >
              <Text
                style={[
                  styles.metricNumber,
                  editedCount > 0 && styles.metricNumberEdited,
                ]}
              >
                {editedCount}
              </Text>
              <Text
                style={[
                  styles.metricLabel,
                  editedCount > 0 && styles.metricLabelEdited,
                ]}
              >
                Edited Fields
              </Text>
            </Card>
          </View>
        </View>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Details</Text>
          </View>

          {renderField("Full Name", "fullName")}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderField("Date of Birth", "dateOfBirth")}
            </View>
            <View style={styles.halfWidth}>
              {renderField("Gender", "gender")}
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Document Details</Text>
          </View>

          {renderField("Document Number", "aadhaarNumber")}
          {renderField("Complete Address", "address", true)}

          <View style={styles.row}>
            <View style={styles.halfWidth}>{renderField("City", "city")}</View>
            <View style={styles.halfWidth}>
              {renderField("State", "state")}
            </View>
          </View>

          {renderField(
            "PIN Code",
            "pinCode",
            false,
            "numeric",
            VALIDATION.PIN_CODE_MAX_LENGTH,
          )}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Confirm & Continue"
          onPress={handleContinue}
          disabled={!isFormValid}
          style={styles.fullButton}
        />
        <Button
          title="Re-upload Document"
          variant="outline"
          onPress={handleReupload}
          style={[styles.fullButton, styles.secondaryButton]}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing["2xl"],
  },
  summaryContainer: { marginBottom: spacing["2xl"] },
  confidenceCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#E8F8EE",
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  confidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  confidenceTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  confidenceSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    marginTop: 2,
  },
  confidenceValue: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E8F8EE",
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: radius.full,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  metricCardEditedContainer: {
    borderColor: colors.warning,
    backgroundColor: "#FFFBF2",
  },
  metricNumber: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metricNumberEdited: { color: colors.warning },
  metricLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  metricLabelEdited: { color: colors.warning },
  card: {
    padding: spacing.lg,
    marginBottom: spacing["2xl"],
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  inputContainer: { marginBottom: spacing.lg },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeVerified: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  badgeEdited: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badgeTextVerified: { color: "#166534" },
  badgeTextEdited: { color: "#B45309" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  inputEdited: {
    borderColor: colors.warning,
    backgroundColor: "#FFFAED",
    borderWidth: 1.5,
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  halfWidth: { flex: 1 },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fullButton: { width: "100%" },
  secondaryButton: { marginTop: spacing.md },
});