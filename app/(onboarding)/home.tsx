import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen, Card, SectionTitle } from "../../src/components";
import { colors, spacing, typography } from "../../src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const [isOperationsExpanded, setIsOperationsExpanded] = useState(true);
  const animation = useRef(new Animated.Value(1)).current;

  const toggleOperations = () => {
    const toValue = isOperationsExpanded ? 0 : 1;
    setIsOperationsExpanded(!isOperationsExpanded);
    Animated.timing(animation, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 192], // Increased from 128 to accommodate 3 items (64px each)
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
              onPress={() =>
                router.push("/(onboarding)/new-guard/employee-details")
              }
            >
              <Text style={styles.menuItemIcon}>📝</Text>
              <Text style={styles.menuItemText}>Register New Employee</Text>
            </Pressable>

            {/* NEW: Employee Profiles Search Option */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => router.push("/(onboarding)/profiles-search")}
            >
              <Text style={styles.menuItemIcon}>🔍</Text>
              <Text style={styles.menuItemText}>Employee Profiles</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => router.replace("/login")}
            >
              <Text style={styles.menuItemIcon}>🚪</Text>
              <Text style={[styles.menuItemText, styles.logoutText]}>
                Logout
              </Text>
            </Pressable>
          </Animated.View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

// ... existing styles remain unchanged ...
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: { marginBottom: spacing.lg },
  accordionCard: {
    padding: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  accordionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  accordionIcon: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  accordionContent: { overflow: "hidden", backgroundColor: colors.background },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 64,
  },
  menuItemPressed: { backgroundColor: "rgba(0,0,0,0.02)" },
  menuItemIcon: { fontSize: typography.fontSize.lg, marginRight: spacing.md },
  menuItemText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  logoutText: { color: colors.error },
});