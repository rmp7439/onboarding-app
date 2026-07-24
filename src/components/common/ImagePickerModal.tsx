import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { colors, spacing, typography, radius } from "../../theme";

interface ImagePickerModalProps {
  visible: boolean;
  uploadType: 'profile' | 'document';
  onClose: () => void;
  onFrontCamera: () => void;
  onRearCamera: () => void;
  onGallery: () => void;
}

export default function ImagePickerModal({
  visible,
  uploadType,
  onClose,
  onFrontCamera,
  onRearCamera,
  onGallery,
}: ImagePickerModalProps) {
  if (Platform.OS === "ios") return null; 

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>
            {uploadType === 'profile' ? "Select Image" : "Select Document"}
          </Text>
          
          {uploadType === 'profile' && (
            <Pressable
              style={styles.sheetButton}
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              onPress={onFrontCamera}
            >
              <Text style={styles.sheetButtonText}>📷 Take Selfie</Text>
            </Pressable>
          )}
          
          <Pressable
            style={styles.sheetButton}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            onPress={onRearCamera}
          >
            <Text style={styles.sheetButtonText}>📸 Take Photo</Text>
          </Pressable>
          
          <Pressable
            style={styles.sheetButton}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            onPress={onGallery}
          >
            <Text style={styles.sheetButtonText}>🖼 Choose from Gallery</Text>
          </Pressable>
          
          <Pressable
            style={[styles.sheetButton, styles.sheetCancelButton]}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            onPress={onClose}
          >
            <Text style={[styles.sheetButtonText, styles.sheetCancelText]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing["2xl"],
  },
  sheetTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  sheetButton: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  sheetButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    textAlign: "center",
    fontWeight: typography.fontWeight.medium,
  },
  sheetCancelButton: { borderBottomWidth: 0, marginTop: spacing.sm },
  sheetCancelText: {
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
  },
});