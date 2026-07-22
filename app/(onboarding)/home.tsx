import { useRouter, useFocusEffect } from "expo-router";
import React, { useRef, useState, useCallback } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, Screen, SectionTitle } from "../../src/components";
import { colors, spacing, typography, radius } from "../../src/theme";
import { lightImpact } from "../../src/utils/haptics";
import { useOnboarding } from "../../src/context/OnboardingContext";
import { api } from "../../src/api/apiClient";

export default function HomeScreen() {
  const router = useRouter();
  const { resetData } = useOnboarding();

  const [isOperationsExpanded, setIsOperationsExpanded] = useState(true);
  const [actionableCount, setActionableCount] = useState(0);
  const animation = useRef(new Animated.Value(1)).current;

  // Refresh actionable application count whenever the Dashboard comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchActionableCount = async () => {
        try {
          const data = await api.getMyApplications();
          if (isActive) {
            const count = data.filter((app: any) =>
              ["RETURNED_FOR_CORRECTION", "REJECTED"].includes(
                app.status.toUpperCase()
              )
            ).length;
            setActionableCount(count);
          }
        } catch (error) {
          console.error("Failed to fetch applications for badge", error);
        }
      };

      fetchActionableCount();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const toggleOperations = () => {
    lightImpact();
    const toValue = isOperationsExpanded ? 0 : 1;
    setIsOperationsExpanded(!isOperationsExpanded);
    Animated.timing(animation, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleRegisterNew = () => {
    lightImpact();
    resetData(); // Ensure context is clean for a new registration
    router.push("/(onboarding)/new-guard/employee-details");
  };

  // Adjusted height for 5 menu items (64px each = 320px total)
  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  const iconRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Screen style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SectionTitle title="Dashboard" style={styles.header} />

        <Card style={styles.accordionCard}>
          <Pressable style={styles.accordionHeader} onPress={toggleOperations}>
            <Text style={styles.accordionTitle}>Operations</Text>
            <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
              <Text style={styles.accordionIcon}>▼</Text>
            </Animated.View>
          </Pressable>

          <Animated.View
            style={[
              styles.accordionContent,
              { height: contentHeight, opacity: animation },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={handleRegisterNew}
            >
              <Text style={styles.menuItemIcon}>📝</Text>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemText}>Register New Employee</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                lightImpact();
                router.push("/(onboarding)/my-applications");
              }}
            >
              <Text style={styles.menuItemIcon}>📋</Text>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemText}>My Applications</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                lightImpact();
                router.push("/(onboarding)/edit-applications");
              }}
            >
              <Text style={styles.menuItemIcon}>✏️</Text>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemText}>Edit Applications</Text>
              </View>
              {/* Notification Badge */}
              {actionableCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {actionableCount > 99 ? "99+" : actionableCount}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                lightImpact();
                router.push("/(onboarding)/my-profile");
              }}
            >
              <Text style={styles.menuItemIcon}>👤</Text>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemText}>My Profile</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                lightImpact();
                router.replace("/login");
              }}
            >
              <Text style={styles.menuItemIcon}>🚪</Text>
              <View style={styles.menuItemTextContainer}>
                <Text style={[styles.menuItemText, styles.logoutText]}>
                  Logout
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: { marginBottom: spacing.lg },
  accordionCard: { padding: 0, overflow: "hidden", borderWidth: 1 },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
  },
  accordionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  accordionIcon: { fontSize: typography.fontSize.sm },
  accordionContent: { overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    height: 64,
  },
  menuItemPressed: { backgroundColor: colors.surface },
  menuItemIcon: { fontSize: typography.fontSize.lg, marginRight: spacing.md },
  menuItemTextContainer: { flex: 1 },
  menuItemText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutText: { color: colors.error },
  badge: {
    backgroundColor: "#F97316", // Vibrant orange
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});