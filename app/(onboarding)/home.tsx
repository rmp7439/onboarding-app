import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import { Card, Screen, SectionTitle } from "../../src/components";
import { colors, radius, spacing, typography } from "../../src/theme";
import { lightImpact } from "../../src/utils/haptics";
import { api } from "../../src/api/apiClient";
import { RecentEmployeeStore } from "../../src/utils/RecentEmployeeStore";
import { useOnboarding } from "../../src/context/OnboardingContext";
import {
  formatDateForForm,
  mapBloodGroupFromBackend,
} from "../../src/utils/dataMappers";

export default function HomeScreen() {
  const router = useRouter();
  const { updateData, resetData } = useOnboarding();

  const [isOperationsExpanded, setIsOperationsExpanded] = useState(true);
  const [isFetchingEdit, setIsFetchingEdit] = useState(false);
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

  const handleEditApplication = async () => {
    lightImpact();
    setIsFetchingEdit(true);
    
    try {
      const recentId = await RecentEmployeeStore.getId();
      if (!recentId) {
        Alert.alert("Notice", "You have no applications available for editing.");
        setIsFetchingEdit(false);
        return;
      }
      
      const profile = await api.getEmployeeProfile(recentId);
      
      if (profile.status !== 'RETURNED_FOR_CORRECTION' && profile.status !== 'REJECTED') {
        Alert.alert("Notice", "You have no applications available for editing.");
        setIsFetchingEdit(false);
        return;
      }

      // Pre-fill Context. Because the backend now sends the FULL object,
      // ALL fields including Aadhaar, PAN, Bank, and Unit will be populated perfectly.
      updateData({
        isEditMode: true,
        editEmployeeId: profile.id,
        employment: {
          joiningDate: formatDateForForm(profile.joiningDate),
          unit: profile.unit || "", // FIX: Populate from backend
        },
        personal: {
          firstName: profile.firstName || "",
          surname: profile.surname || "",
          fatherName: profile.fatherName || "",
          husbandName: profile.husbandName || "",
          gender: profile.gender === 'FEMALE' ? 'Female' : 'Male',
          dob: formatDateForForm(profile.dateOfBirth),
          mobile: profile.mobile || "",
          bloodGroup: mapBloodGroupFromBackend(profile.bloodGroup),
        },
        identity: {
          aadhaar: profile.aadhaar || "",
          pan: profile.pan || "",
          uan: profile.uan || "",
          esic: profile.esic || "",
        },
        address: {
          permanent: profile.permanentAddress || "",
          current: profile.currentAddress || "",
          city: profile.city || "",
          state: profile.state || "",
          pinCode: profile.pinCode || "",
        },
        bank: {
          bankName: profile.bankName || "",
          accountNumber: profile.accountNumber || "",
          ifsc: profile.ifsc || "",
          branch: profile.branch || "",
          micr: profile.micr || "",
        },
        emergencyContact: {
          name: profile.emergencyName || "",
          relation: profile.emergencyRelation || "",
          mobile: profile.emergencyPhone || "",
        },
        selfieUri: profile.selfieFilename ? "EXISTING" : null,
        existingDocuments: profile.documents?.map((d: any) => d.type) || []
      });

      router.push("/(onboarding)/new-guard/employee-details");
    } catch (error) {
      Alert.alert("Error", "Failed to fetch application details. Please check your connection.");
    } finally {
      setIsFetchingEdit(false);
    }
  };

  const handleRegisterNew = () => {
    lightImpact();
    resetData(); // Ensure context is clean for a new registration
    router.push("/(onboarding)/new-guard/employee-details");
  };

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 256],
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
              <Text style={styles.menuItemText}>Register New Employee</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
                isFetchingEdit && styles.menuItemDisabled,
              ]}
              onPress={handleEditApplication}
              disabled={isFetchingEdit}
            >
              <Text style={styles.menuItemIcon}>✏️</Text>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemText}>
                  Edit Existing Application
                </Text>
              </View>
              {isFetchingEdit && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
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
  menuItemDisabled: { opacity: 0.6 },
  menuItemIcon: { fontSize: typography.fontSize.lg, marginRight: spacing.md },
  menuItemTextContainer: { flex: 1 },
  menuItemText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutText: { color: colors.error },
});