import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  Image,
} from "react-native";
import { Card, Button } from "../index";
import { colors, spacing, typography } from "../../theme";
import { PreviewState } from "../../types/Document";

interface ImagePreviewModalProps {
  preview: PreviewState | null;
  previewAnim: Animated.Value;
  onCancel: () => void;
  onRetake: () => void;
  onUseImage: () => void;
}

export default function ImagePreviewModal({
  preview,
  previewAnim,
  onCancel,
  onRetake,
  onUseImage,
}: ImagePreviewModalProps) {
  if (!preview) return null;

  return (
    <Animated.View
      style={[
        styles.previewScreenOverlay,
        {
          opacity: previewAnim,
          transform: [
            {
              translateY: previewAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <SafeAreaView style={styles.previewSafeArea}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Review Image</Text>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.cancelPreviewBtn}
          />
        </View>

        <View style={styles.previewImageWrapper}>
          <Image
            source={{ uri: preview.uri }}
            style={styles.fullPreviewImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.previewFooter}>
          <Card style={styles.previewDetailsCard}>
            <View style={styles.previewDetailRow}>
              <Text style={styles.previewDetailLabel}>Filename:</Text>
              <Text
                style={styles.previewDetailValue}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {preview.filename}
              </Text>
            </View>
            <View style={styles.previewDetailRow}>
              <Text style={styles.previewDetailLabel}>Resolution:</Text>
              <Text style={styles.previewDetailValue}>
                {preview.width} x {preview.height}
              </Text>
            </View>
          </Card>

          <View style={styles.previewButtonRow}>
            <Button
              title="Retake"
              variant="outline"
              onPress={onRetake}
              style={styles.previewHalfBtn}
            />
            <Button
              title="Use Image"
              onPress={onUseImage}
              style={styles.previewHalfBtn}
            />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  previewScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    zIndex: 20,
  },
  previewSafeArea: { flex: 1, justifyContent: "space-between" },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  previewTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  cancelPreviewBtn: { height: 36, paddingHorizontal: spacing.md },
  previewImageWrapper: {
    flex: 1,
    backgroundColor: "#000",
    marginVertical: spacing.md,
  },
  fullPreviewImage: { width: "100%", height: "100%" },
  previewFooter: { padding: spacing.md, paddingBottom: spacing.xl },
  previewDetailsCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  previewDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  previewDetailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  previewDetailValue: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
    textAlign: "right",
    marginLeft: spacing.lg,
  },
  previewButtonRow: { flexDirection: "row", gap: spacing.md },
  previewHalfBtn: { flex: 1 },
});