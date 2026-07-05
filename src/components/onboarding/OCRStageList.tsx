import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors, spacing, typography } from "../../theme";
import { OCR_STAGES } from "../../constants/OCR";

interface OCRStageListProps {
  currentStageIndex: number;
  textOpacity: Animated.Value;
  spinnerInterpolate: Animated.AnimatedInterpolation<string>;
}

export default function OCRStageList({
  currentStageIndex,
  textOpacity,
  spinnerInterpolate,
}: OCRStageListProps) {
  return (
    <View style={styles.stagesList}>
      {OCR_STAGES.map((stage, index) => {
        const isCompleted = index < currentStageIndex;
        const isCurrent = index === currentStageIndex;
        const isUpcoming = index > currentStageIndex;

        return (
          <View key={index} style={styles.stageRow}>
            <View style={styles.stageIconContainer}>
              {isCompleted && (
                <View style={styles.completedIcon}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              )}
              {isCurrent && (
                <Animated.View
                  style={[
                    styles.spinner,
                    { transform: [{ rotate: spinnerInterpolate }] },
                  ]}
                />
              )}
              {isUpcoming && <View style={styles.upcomingIcon} />}
            </View>

            <Animated.Text
              style={[
                styles.stageListText,
                isCompleted && styles.stageCompleted,
                isCurrent && [styles.stageCurrent, { opacity: textOpacity }],
                isUpcoming && styles.stageUpcoming,
              ]}
            >
              {stage}
            </Animated.Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stagesList: { width: "100%", marginBottom: spacing.xl },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  stageIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  completedIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  completedText: { color: colors.white, fontSize: 10, fontWeight: "bold" },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderTopColor: colors.primary,
  },
  upcomingIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  stageListText: { fontSize: typography.fontSize.md },
  stageCompleted: {
    color: colors.success,
    fontWeight: typography.fontWeight.medium,
  },
  stageCurrent: { color: colors.white, fontWeight: typography.fontWeight.bold },
  stageUpcoming: {
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: typography.fontWeight.medium,
  },
});