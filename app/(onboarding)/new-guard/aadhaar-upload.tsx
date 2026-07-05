import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';

export default function AadhaarUploadScreen() {
  const router = useRouter();
  
  const [frontImage, setFrontImage] = useState<boolean>(false);
  const [backImage, setBackImage] = useState<boolean>(false);
  
  // Loading state and animation variables
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('');
  const progress = useRef(new Animated.Value(0)).current;

  // Cleanup timeouts on unmount to prevent memory leaks
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleContinue = () => {
    setIsProcessing(true);
    setStatusText('Uploading Aadhaar...');
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false, // Must be false for width animation
    }).start();

    // Sequence of mocked processing steps
    timeoutRefs.current.push(setTimeout(() => setStatusText('Analyzing Document...'), 600));
    timeoutRefs.current.push(setTimeout(() => setStatusText('Extracting Personal Details...'), 1200));
    timeoutRefs.current.push(setTimeout(() => setStatusText('Reading Address...'), 1800));
    timeoutRefs.current.push(setTimeout(() => setStatusText('Completed ✓'), 2400));

    // Navigate to next screen
    timeoutRefs.current.push(setTimeout(() => {
      setIsProcessing(false);
      router.push('/(onboarding)/new-guard/review-details');
    }, 3000));
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

      {/* Full Screen Loading Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <Text style={styles.processingText}>{statusText}</Text>
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
        </View>
      )}
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
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  uploadCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  buttonGroup: {
    width: '100%',
  },
  actionButton: {
    width: '100%',
  },
  buttonSpacer: {
    height: spacing.sm,
  },
  previewContainer: {
    width: '100%',
  },
  previewBox: {
    height: 140,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  previewText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  infoCard: {
    backgroundColor: colors.background,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
    marginBottom: spacing.sm,
  },
  bulletPoints: {
    paddingLeft: spacing.sm,
  },
  bulletText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footer: {
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  button: {
    width: '100%',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  processingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
});