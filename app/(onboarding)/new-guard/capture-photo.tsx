import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useRouter } from "expo-router";
import { Screen, Card, SectionTitle, Button } from "../../../src/components";
import { useImagePickerAction } from "../../../src/hooks/useImagePickerAction";
import { useOnboarding } from "../../../src/context/OnboardingContext";
import { colors, radius, spacing, typography } from "../../../src/theme";
import { lightImpact } from "../../../src/utils/haptics";

export default function CapturePhotoScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const { openPicker, PickerComponent } = useImagePickerAction();
  
  const [localPhoto, setLocalPhoto] = useState<string | null>(
    data.selfieUri && data.selfieUri !== 'EXISTING' ? data.selfieUri : null
  );

  const handleSelect = (uri: string) => {
    setLocalPhoto(uri);
    updateData({ selfieUri: uri });
  };

  const handleContinue = () => {
    if (localPhoto || data.selfieUri === 'EXISTING') {
      lightImpact();
      router.push("/(onboarding)/new-guard/documents");
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle 
          title="Employee Photo" 
          style={styles.header} 
        />
        
        <Card style={styles.previewCard}>
          {localPhoto ? (
            <View style={styles.capturedPlaceholder}>
              <Image source={{ uri: localPhoto }} style={styles.capturedImage} resizeMode="cover" />
            </View>
          ) : data.selfieUri === 'EXISTING' ? (
            <View style={styles.capturedPlaceholder}>
              <Text style={styles.existingText}>Previously Uploaded</Text>
            </View>
          ) : (
            <View style={styles.emptyPlaceholder}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyText}>No photo selected</Text>
            </View>
          )}
        </Card>
      </View>

      <View style={styles.footer}>
        {localPhoto || data.selfieUri === 'EXISTING' ? (
          <>
            <Button 
              title="Continue" 
              onPress={handleContinue} 
              style={styles.fullButton} 
            />
            <Button 
              title="Replace Photo" 
              variant="outline" 
              onPress={() => openPicker('profile', handleSelect)} 
              style={[styles.fullButton, styles.secondaryButton]} 
            />
          </>
        ) : (
          <Button 
            title="Select Photo" 
            onPress={() => openPicker('profile', handleSelect)} 
            style={styles.fullButton} 
          />
        )}
      </View>

      <PickerComponent />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  header: { marginBottom: spacing.xl, marginTop: spacing.md },
  previewCard: {
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  capturedPlaceholder: {
    width: "100%",
    aspectRatio: 1 / 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  capturedImage: { width: "100%", height: "100%" },
  emptyPlaceholder: {
    width: "100%",
    aspectRatio: 1 / 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  existingText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.bold,
    fontStyle: 'italic',
  },
  footer: { paddingVertical: spacing.md, marginTop: spacing.md },
  fullButton: { width: "100%" },
  secondaryButton: { marginTop: spacing.md },
});