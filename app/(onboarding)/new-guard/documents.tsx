import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Screen, Card, SectionTitle, Button } from "../../../src/components";
import { colors, spacing, typography, radius } from "../../../src/theme";
import { useOnboarding } from "../../../src/context/OnboardingContext";
import { scannerService } from "../../../src/services/scanner/ScannerService";
import { DocumentItem } from "../../../src/types/Document";
import { DOCUMENT_TYPES } from "../../../src/constants/App";
import { useImagePickerAction } from "../../../src/hooks/useImagePickerAction";

const INITIAL_DOCUMENTS: DocumentItem[] = DOCUMENT_TYPES.map((doc) => ({
  ...doc,
  uri: null,
  filename: null,
}));

export default function DocumentsScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const { openPicker, PickerComponent } = useImagePickerAction();
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

  const handlePickImage = async (id: string, source: "gallery" | "camera") => {
    try {
      const result =
        source === "gallery"
          ? await scannerService.pickFromGallery()
          : await scannerService.captureFromCamera();
      if (result) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === id
              ? { ...doc, uri: result.uri, filename: result.filename }
              : doc,
          ),
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong while attaching the document.",
      );
    }
  };

  const handleRemove = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, uri: null, filename: null } : doc,
      ),
    );
  };

  const handleContinue = () => {
    const uploadedDocs = documents
      .filter((doc) => doc.uri !== null)
      .map((doc) => doc.title);
    updateData({ uploadedDocuments: uploadedDocs });
    router.push("/(onboarding)/new-guard/review");
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle
          title="Supporting Documents"
          subtitle="Upload any available supporting documents."
          style={styles.header}
        />

        {documents.map((doc) => (
          <Card key={doc.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.docTitle}>{doc.title}</Text>
              {doc.uri && (
                <View style={styles.uploadedBadge}>
                  <Text style={styles.uploadedBadgeText}>✓ Attached</Text>
                </View>
              )}
            </View>

            {!doc.uri ? (
              <Button
                title="Upload Document"
                variant="outline"
                onPress={() =>
                  openPicker(
                    () => handlePickImage(doc.id, "camera"),
                    () => handlePickImage(doc.id, "gallery"),
                  )
                }
                style={styles.actionButton}
              />
            ) : (
              <View style={styles.attachmentContainer}>
                <View style={styles.fileInfoRow}>
                  <Image
                    source={{ uri: doc.uri }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.fileDetails}>
                    <Text
                      style={styles.filenameText}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {doc.filename}
                    </Text>
                    <Text style={styles.fileStatusText}>Ready for upload</Text>
                  </View>
                </View>

                <View style={styles.cardActionRow}>
                  <Button
                    title="Replace"
                    variant="outline"
                    onPress={() =>
                      openPicker(
                        () => handlePickImage(doc.id, "camera"),
                        () => handlePickImage(doc.id, "gallery"),
                      )
                    }
                    style={styles.halfBtn}
                  />
                  <View style={styles.actionSpacer} />
                  <Button
                    title="Remove"
                    variant="outline"
                    onPress={() => handleRemove(doc.id)}
                    style={styles.halfBtn}
                  />
                </View>
              </View>
            )}
          </Card>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.fullButton}
        />
      </View>

      <PickerComponent />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  content: { flex: 1 },
  header: { marginBottom: spacing.xl, marginTop: spacing.md },
  card: { marginBottom: spacing.md },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  docTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  uploadedBadge: {
    backgroundColor: "#E8F8EE",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  uploadedBadgeText: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  actionButton: { height: 44 },
  attachmentContainer: { marginTop: spacing.xs },
  fileInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  fileDetails: { flex: 1, marginLeft: spacing.md },
  filenameText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: 2,
  },
  fileStatusText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  cardActionRow: { flexDirection: "row", justifyContent: "space-between" },
  halfBtn: { flex: 1, height: 40 },
  actionSpacer: { width: spacing.sm },
  footer: { paddingVertical: spacing.md, marginTop: spacing.md },
  fullButton: { width: "100%" },
});