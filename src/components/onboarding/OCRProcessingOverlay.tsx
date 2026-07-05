import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors, spacing, typography, radius } from "../../theme";
import OCRStageList from "./OCRStageList";

interface OCRProcessingOverlayProps {
  isProcessing: boolean;
  scanLineY: Animated.Value;
  progress: Animated.Value;
  displayedPercent: number;
  displayedTime: number;
  currentStageIndex: number;
  textOpacity: Animated.Value;
  spinnerInterpolate: Animated.AnimatedInterpolation<string>;
}

export default function OCRProcessingOverlay({
  isProcessing,
  scanLineY,
  progress,
  displayedPercent,
  displayedTime,
  currentStageIndex,
  textOpacity,
  spinnerInterpolate,
}: OCRProcessingOverlayProps) {
  if (!isProcessing) return null;

  return (
    <View style={styles.processingOverlay}>
      <View style={styles.scannerBox}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        <Animated.View
          style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}
        />
      </View>

      <View style={styles.statusContainer}>
        <OCRStageList
          currentStageIndex={currentStageIndex}
          textOpacity={textOpacity}
          spinnerInterpolate={spinnerInterpolate}
        />

        <View style={styles.progressHeader}>
          <Text style={styles.progressPercent}>
            {displayedPercent}% Complete
          </Text>
          <Text style={styles.remainingTime}>
            Est. remaining: {displayedTime}s
          </Text>
        </View>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    zIndex: 30,
  },
  scannerBox: {
    width: 240,
    height: 240,
    position: "relative",
    marginBottom: spacing["2xl"],
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: radius.md,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: radius.md,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: radius.md,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: radius.md,
  },
  scanLine: {
    width: "100%",
    height: 4,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: radius.full,
  },
  statusContainer: { width: "100%", paddingHorizontal: spacing.sm },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.sm,
  },
  progressPercent: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  remainingTime: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
});