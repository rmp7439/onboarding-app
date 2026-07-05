import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';

type DocStatus = 'idle' | 'uploading' | 'uploaded';

interface DocumentItem {
  id: string;
  title: string;
  status: DocStatus;
  progress: number;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: 'pan', title: 'PAN Card', status: 'idle', progress: 0 },
  { id: 'police', title: 'Police Verification', status: 'idle', progress: 0 },
  { id: 'bank', title: 'Bank Passbook', status: 'idle', progress: 0 },
  { id: 'driving', title: 'Driving Licence', status: 'idle', progress: 0 },
  { id: 'education', title: 'Educational Certificate', status: 'idle', progress: 0 },
  { id: 'photo', title: 'Passport Photo', status: 'idle', progress: 0 },
];

export default function DocumentsScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const handleUpload = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: 'uploading', progress: 0 } : doc))
    );

    let currentProgress = 0;
    const simulateProgress = () => {
      currentProgress += Math.floor(Math.random() * 30) + 15;
      
      if (currentProgress >= 100) {
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === id ? { ...doc, status: 'uploaded', progress: 100 } : doc))
        );
      } else {
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === id ? { ...doc, progress: currentProgress } : doc))
        );
        const nextTimeout = setTimeout(simulateProgress, 300);
        timeouts.current.push(nextTimeout);
      }
    };

    const initialTimeout = setTimeout(simulateProgress, 300);
    timeouts.current.push(initialTimeout);
  };

  const handleRemove = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: 'idle', progress: 0 } : doc))
    );
  };

  const handleContinue = () => {
    router.push('/(onboarding)/new-guard/review');
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
              {doc.status === 'uploaded' && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </View>

            {doc.status === 'idle' && (
              <Button
                title="Upload"
                variant="outline"
                onPress={() => handleUpload(doc.id)}
                style={styles.actionButton}
              />
            )}

            {doc.status === 'uploading' && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[styles.progressBarFill, { width: `${doc.progress}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>Uploading... {doc.progress}%</Text>
              </View>
            )}

            {doc.status === 'uploaded' && (
              <View style={styles.uploadedContainer}>
                <Text style={styles.uploadedText}>Document attached</Text>
                <Button
                  title="Remove"
                  variant="outline"
                  onPress={() => handleRemove(doc.id)}
                  style={styles.removeButton}
                />
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
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  docTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  actionButton: {
    height: 40,
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  uploadedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  uploadedText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  removeButton: {
    height: 32,
    paddingHorizontal: spacing.md,
    borderColor: colors.error,
  },
  footer: {
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  fullButton: {
    width: '100%',
  },
});