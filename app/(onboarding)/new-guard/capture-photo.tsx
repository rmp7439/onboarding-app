import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, SectionTitle, Button } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';

export default function CapturePhotoScreen() {
  const router = useRouter();
  const [isCaptured, setIsCaptured] = useState(false);

  const handleCapture = () => {
    setIsCaptured(true);
  };

  const handleRetake = () => {
    setIsCaptured(false);
  };

  const handleUsePhoto = () => {
    router.push('/(onboarding)/new-guard/documents');
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle
          title="Capture Employee Photo"
          subtitle="Ensure the employee's face is clearly visible."
          style={styles.header}
        />

        <View style={styles.cameraWrapper}>
          {isCaptured ? (
            <View style={styles.capturedContainer}>
              {/* Dummy Employee Photo Placeholder */}
              <View style={styles.dummyAvatar}>
                <View style={styles.dummyHead} />
                <View style={styles.dummyBody} />
              </View>
              <Text style={styles.capturedText}>Photo Captured</Text>
            </View>
          ) : (
            <View style={styles.viewfinderContainer}>
              {/* Camera Frame Corners */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              <Text style={styles.viewfinderText}>Camera Feed Active</Text>
              <Text style={styles.viewfinderSubtext}>(Simulated)</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        {isCaptured ? (
          <View style={styles.buttonRow}>
            <Button
              title="Retake"
              variant="outline"
              onPress={handleRetake}
              style={styles.halfButton}
            />
            <Button
              title="Use Photo"
              onPress={handleUsePhoto}
              style={styles.halfButton}
            />
          </View>
        ) : (
          <Button
            title="Capture Photo"
            onPress={handleCapture}
            style={styles.fullButton}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  cameraWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  viewfinderContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#1C1C1E', // Dark camera background
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.white,
  },
  topLeft: {
    top: spacing.lg,
    left: spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: spacing.lg,
    right: spacing.lg,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: spacing.lg,
    left: spacing.lg,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: spacing.lg,
    right: spacing.lg,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  viewfinderText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
  },
  viewfinderSubtext: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  capturedContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dummyAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  dummyHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  dummyBody: {
    width: 140,
    height: 100,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: colors.border,
  },
  capturedText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.md,
  },
  footer: {
    paddingVertical: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfButton: {
    flex: 1,
  },
  fullButton: {
    width: '100%',
  },
});