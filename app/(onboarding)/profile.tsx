import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Screen, Card, SectionTitle, Button } from "../../src/components";
import { colors, spacing, typography, radius } from "../../src/theme";
import { api } from "../../src/api/apiClient";
import { RecentEmployeeStore } from "../../src/utils/RecentEmployeeStore";

// ... Keep existing EmployeeProfile interface ...
interface EmployeeProfile {
  id: string;
  firstName: string;
  surname: string;
  employeeCode: string | null;
  status: string;
  mobile: string;
  joiningDate: string;
  gender: string;
  bloodGroup: string;
  selfieUrl: string | null;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const recentId = await RecentEmployeeStore.getId();

      if (!recentId) {
        setError("No recent employee has been registered on this device yet.");
        setIsLoading(false);
        return;
      }

      const data = await api.getEmployeeProfile(recentId);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch fresh data every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile]),
  );

  // ... Keep getStatusBadgeStyle and formatDate ...

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return { bg: "#DCFCE7", text: colors.success };
      case "REJECTED":
        return { bg: "#FEE2E2", text: colors.error };
      case "PENDING":
      default:
        return { bg: "#FEF3C7", text: colors.warning };
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading && !profile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Back to Dashboard"
          onPress={() => router.back()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  const badgeStyle = getStatusBadgeStyle(profile.status);

  return (
    <Screen style={styles.container}>
      <SectionTitle title="Employee Profile" style={styles.header} />

      {/* ... Keep all existing Card and Profile UI structures intact ... */}

      <View style={styles.footer}>
        <Button
          title="Back to Dashboard"
          variant="outline"
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}

// ... existing styles ...
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: spacing.md, marginBottom: spacing.lg },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorIcon: { fontSize: 48, marginBottom: spacing.md },
  errorText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  retryButton: { width: "100%", marginBottom: spacing.md },

  identityCard: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  photo: { width: "100%", height: "100%", borderRadius: radius.full },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: "#E6F4FE",
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  nameText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  codeText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  detailsCard: { padding: spacing.lg, marginBottom: spacing.xl },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  divider: { height: 1, backgroundColor: colors.border, opacity: 0.3 },
  footer: { paddingBottom: spacing.xl },
});