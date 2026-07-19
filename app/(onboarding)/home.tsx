import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { Card, Screen, SectionTitle } from "../../src/components";
import { colors, radius, spacing, typography } from "../../src/theme";
import { lightImpact } from "../../src/utils/haptics";

export default function HomeScreen() {
  const router = useRouter();
  const [isOperationsExpanded, setIsOperationsExpanded] = useState(true);
  const animation = useRef(new Animated.Value(1)).current;

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

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 192], 
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
              onPress={() => {
                lightImpact();
                router.push("/(onboarding)/new-guard/employee-details");
              }}
            >
              <Text style={styles.menuItemIcon}>📝</Text>
              <Text style={styles.menuItemText}>Register New Employee</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                lightImpact();
                router.push("/(onboarding)/profile");
              }}
            >
              <Text style={styles.menuItemIcon}>👤</Text>
              <Text style={styles.menuItemText}>
                View Current Employee Profile
              </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: { marginBottom: spacing.lg },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerTitle: { marginBottom: 0 },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themeIcon: { fontSize: typography.fontSize.lg },
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
  accordionContent: {
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    height: 64,
  },
  menuItemPressed: {
    backgroundColor: colors.surface,
  },
  menuItemIcon: { fontSize: typography.fontSize.lg, marginRight: spacing.md },
  menuItemText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutText: {
    color: colors.error,
  },
});