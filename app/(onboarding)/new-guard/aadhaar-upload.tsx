import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useOnboarding } from '../../../src/context/OnboardingContext';

const OCR_STEPS = [
  'Uploading Aadhaar...',
  'Detecting Document...',
  'Reading Text...',
  'Extracting Name...',
  'Extracting Date of Birth...',
  'Extracting Address...',
  'Validating Aadhaar...',
  'OCR Complete'
];

export default function AadhaarUploadScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  
  const [frontImage, setFrontImage] = useState<boolean>(false);
  const [backImage, setBackImage] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Animation values
  const progress = useRef(new Animated.Value(0)).current;
  const stepAnimations = useRef(OCR_STEPS.map(() => new Animated.Value(0))).current;
  const stepTranslateY = useRef(OCR_STEPS.map(() => new Animated.Value(10))).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      progress.stopAnimation();
      stepAnimations.forEach(anim => anim.stopAnimation());
      stepTranslateY.forEach(anim => anim.stopAnimation());
    };
  }, []);

  const handleContinue = () => {
    setIsProcessing(true);
    
    // Reset animations
    progress.setValue(0);
    stepAnimations.forEach(anim => anim.setValue(0));
    stepTranslateY.forEach(anim => anim.setValue(10));

    const staggerDelay = 400; // ms between each step showing up
    const stepDuration = 300; // ms for the fade/slide animation
    const totalDuration = staggerDelay * OCR_STEPS.length;

    // Run progress bar and sequence of steps concurrently
    Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: totalDuration,
        useNativeDriver: false, // width cannot use native driver
      }),
      Animated.stagger(
        staggerDelay,
        stepAnimations.map((anim, index) => 
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: stepDuration,
              useNativeDriver: true,
            }),
            Animated.timing(stepTranslateY[index], {
              toValue: 0,
              duration: stepDuration,
              useNativeDriver: true,
            })
          ])
        )
      )
    ]).start(() => {
      // Small pause after sequence finishes before navigating
      setTimeout(() => {
        updateData({
          fullName: 'Vikram Sharma',
          dateOfBirth: '15/08/1995',
          gender: 'Male',
          aadhaarNumber: '[Aadhaar Redacted]', 
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
        });
        setIsProcessing(false);
        router.push('/(onboarding)/new-guard/review-details');
      }, 600);
    });
  };

  const renderUploadSection = (
    title: string,
    isUploaded: boolean,
    onUpload: () => void,
    onRemove: () => void
  ) => (
    <Card style={styles.uploadCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {isUploaded ? (
        <View style={styles.previewContainer}>
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>Image Uploaded (Preview)</Text>
          </View>
          <Button 
            title="Remove" 
            variant="outline" 
            onPress={onRemove} 
            style={styles.actionButton}
            disabled={isProcessing}
          />
        </View>
      ) : (
        <View style={styles.buttonGroup}>
          <Button 
            title="Upload from Gallery" 
            variant="outline" 
            onPress={onUpload} 
            style={styles.actionButton}
            disabled={isProcessing}
          />
          <View style={styles.buttonSpacer} />
          <Button 
            title="Capture using Camera" 
            variant="secondary" 
            onPress={onUpload} 
            style={styles.actionButton}
            disabled={isProcessing}
          />
        </View>
      )}
    </Card>
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle
          title="Upload Aadhaar"
          subtitle="Upload both sides of the Aadhaar card for automatic information extraction."
          style={styles.header}
        />

        {renderUploadSection(
          'Front Side',
          frontImage,
          () => setFrontImage(true),
          () => setFrontImage(false)
        )}

        {renderUploadSection(
          'Back Side',
          backImage,
          () => setBackImage(true),
          () => setBackImage(false)
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>✓ OCR will automatically extract:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletText}>• Full Name</Text>
            <Text style={styles.bulletText}>• Date of Birth</Text>
            <Text style={styles.bulletText}>• Gender</Text>
            <Text style={styles.bulletText}>• Address</Text>
            <Text style={styles.bulletText}>• Aadhaar Number</Text>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={!frontImage || !backImage || isProcessing}
          onPress={handleContinue}
          style={styles.button}
        />
      </View>

      {/* OCR Processing Animated Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <Text style={styles.processingTitle}>Analyzing Document</Text>
          
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]} 
            />
          </View>

          <View style={styles.stepsContainer}>
            {OCR_STEPS.map((step, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.stepRow,
                  {
                    opacity: stepAnimations[index],
                    transform: [{ translateY: stepTranslateY[index] }]
                  }
                ]}
              >
                <View style={styles.stepCheckCircle}>
                  <Text style={styles.stepCheckText}>✓</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  content: { flex: 1 },
  header: { marginBottom: spacing.lg, marginTop: spacing.md },
  uploadCard: { marginBottom: spacing.lg },
  cardTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.text, marginBottom: spacing.md },
  buttonGroup: { width: '100%' },
  actionButton: { width: '100%' },
  buttonSpacer: { height: spacing.sm },
  previewContainer: { width: '100%' },
  previewBox: { height: 140, backgroundColor: colors.background, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  previewText: { color: colors.textSecondary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
  infoCard: { backgroundColor: colors.background, marginTop: spacing.xs, marginBottom: spacing.xl },
  infoTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, color: colors.success, marginBottom: spacing.sm },
  bulletPoints: { paddingLeft: spacing.sm },
  bulletText: { fontSize: typography.fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  footer: { paddingVertical: spacing.md, marginTop: spacing.md },
  button: { width: '100%' },
  
  // Processing Overlay Styles
  processingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: colors.surface, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: spacing.xl, 
    zIndex: 10 
  },
  processingTitle: { 
    fontSize: typography.fontSize.xl, 
    fontWeight: typography.fontWeight.bold, 
    color: colors.text, 
    marginBottom: spacing.xl, 
    textAlign: 'center' 
  },
  progressBarBackground: { 
    width: '100%', 
    height: 8, 
    backgroundColor: colors.background, 
    borderRadius: radius.full, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: colors.primary, 
    borderRadius: radius.full 
  },
  stepsContainer: {
    width: '100%',
    marginTop: spacing['3xl'],
    paddingHorizontal: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stepCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepCheckText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  stepText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
});