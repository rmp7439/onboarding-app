import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, SectionTitle, Button, Card } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useOnboarding } from '../../../src/context/OnboardingContext';

export default function CapturePhotoScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [photo, setPhoto] = useState<string | null>(null);

  const flashAnim = useRef(new Animated.Value(0)).current;

  const handleCapture = () => {
    // 1. Trigger realistic camera flash animation
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      // 2. Set mock URI to trigger preview state
      setPhoto(`capture_${Date.now()}`); 
    });
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  const handleContinue = () => {
    if (photo) {
      updateData({ selfieUri: photo });
      router.push('/(onboarding)/new-guard/documents');
    }
  };

  // ---------------------------------------------------------------------------
  // PREVIEW STATE
  // ---------------------------------------------------------------------------
  if (photo) {
    return (
      <Screen style={styles.container}>
        <View style={styles.content}>
          <SectionTitle
            title="Review Photo"
            subtitle="Ensure your face is clearly visible, well-lit, and directly facing the camera."
            style={styles.header}
          />
          <Card style={styles.previewCard}>
            <View style={styles.capturedPlaceholder}>
              <Text style={styles.capturedIcon}>👤</Text>
            </View>
          </Card>
        </View>

        <View style={styles.footer}>
          <Button
            title="Use Photo"
            onPress={handleContinue}
            style={styles.fullButton}
          />
          <Button
            title="Retake"
            variant="outline"
            onPress={handleRetake}
            style={[styles.fullButton, styles.secondaryButton]}
          />
        </View>
      </Screen>
    );
  }

  // ---------------------------------------------------------------------------
  // CAMERA CAPTURE STATE
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.cameraHeader}>
        <Text style={styles.cameraTitle}>Face Capture</Text>
        <Text style={styles.cameraSubtitle}>Position your face inside the circle</Text>
      </View>

      <View style={styles.cameraPreview}>
        {/* Dark Preview Background to emulate inactive camera lens */}
        <View style={styles.darkPreviewBackground}>
          {/* Circular Face Guide Overlay */}
          <View style={styles.faceGuide} />
        </View>
      </View>

      <View style={styles.cameraFooter}>
        <Pressable 
          style={({ pressed }) => [
            styles.shutterButton,
            pressed && styles.shutterButtonPressed
          ]}
          onPress={handleCapture}
        >
          <View style={styles.shutterInner} />
        </Pressable>
      </View>

      {/* Camera Flash Overlay */}
      <Animated.View 
        style={[styles.flashOverlay, { opacity: flashAnim }]} 
        pointerEvents="none" 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Preview State Styles
  container: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  content: { 
    flex: 1 
  },
  header: { 
    marginBottom: spacing.xl, 
    marginTop: spacing.md 
  },
  previewCard: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedPlaceholder: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  capturedIcon: {
    fontSize: 80,
    opacity: 0.5,
  },
  footer: { 
    paddingVertical: spacing.md, 
    marginTop: spacing.md 
  },
  fullButton: { 
    width: '100%' 
  },
  secondaryButton: { 
    marginTop: spacing.md 
  },

  // Camera State Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFF',
    marginBottom: spacing.xs,
  },
  cameraSubtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  darkPreviewBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderStyle: 'dashed',
  },
  cameraFooter: {
    paddingBottom: 60,
    paddingTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    zIndex: 100,
  }
});