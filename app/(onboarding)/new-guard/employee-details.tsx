import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen, SectionTitle, Button } from "../../../src/components";
import { ProgressIndicator } from "../../../src/components/onboarding/ProgressIndicator";
import { EmploymentPersonalStep } from "../../../src/components/onboarding/steps/EmploymentPersonalStep";
import { IdentityStep } from "../../../src/components/onboarding/steps/IdentityStep";
import { AddressBankStep } from "../../../src/components/onboarding/steps/AddressBankStep";
import { EmergencyContactStep } from "../../../src/components/onboarding/steps/EmergencyContactStep";
import { useOnboarding } from "../../../src/context/OnboardingContext";
import { useEmployeeForm } from "../../../src/hooks/useEmployeeForm";
import { colors, spacing } from "../../../src/theme";
import { lightImpact, warning } from "../../../src/utils/haptics";

const TOTAL_STEPS = 4;

export default function EmployeeDetailsScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  
  const { formData, updateField, errors, validateStep } = useEmployeeForm();

  const { width } = useWindowDimensions();
  const stepWidth = width - spacing.md * 2;

  const [currentStep, setCurrentStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleNextStep = useCallback(() => {
    if (!validateStep(currentStep)) {
      warning();
      return; 
    }
    
    lightImpact();

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      Animated.timing(slideAnim, {
        toValue: -currentStep * stepWidth,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      handleFinalSubmit();
    }
  }, [currentStep, stepWidth, slideAnim, validateStep]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      lightImpact();
      setCurrentStep(currentStep - 1);
      Animated.timing(slideAnim, {
        toValue: -(currentStep - 2) * stepWidth,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, stepWidth, slideAnim]);

  const handleFinalSubmit = () => {
    updateData({
      employment: {
        joiningDate: formData.dateOfJoining,
        unit: formData.unitSite,
      },
      personal: {
        firstName: formData.firstName,
        surname: formData.surname,
        fatherName: formData.fatherName,
        husbandName: formData.husbandName,
        gender: formData.gender,
        dob: formData.dateOfBirth,
        mobile: formData.mobileNumber,
        bloodGroup: formData.bloodGroup,
      },
      identity: {
        aadhaar: formData.aadhaarNumber,
        pan: formData.panNumber,
        uan: formData.uanNumber,
        esic: formData.esicNumber,
      },
      address: {
        permanent: formData.permanentAddress,
        current: formData.currentAddress,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
      },
      bank: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifscCode,
        branch: formData.branch,
        micr: formData.micrCode,
      },
      emergencyContact: {
        name: formData.em1Name,
        relation: formData.em1Relation,
        mobile: formData.em1Mobile,
      },
    });
    router.push("/(onboarding)/new-guard/capture-photo");
  };

  return (
    <Screen scrollable={false} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle
          title="Employee Registration"
          subtitle={`Step ${currentStep} of ${TOTAL_STEPS}`}
          style={styles.mainHeader}
        />

        <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <View style={styles.sliderWrapper}>
          <Animated.View
            style={[
              styles.stepsContainer,
              {
                width: stepWidth * TOTAL_STEPS,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={{ width: stepWidth }}>
              <EmploymentPersonalStep
                formData={formData}
                updateField={updateField}
                currentYear={currentYear}
                errors={errors} 
              />
            </View>
            <View style={{ width: stepWidth }}>
              <IdentityStep 
                formData={formData} 
                updateField={updateField} 
                errors={errors}
                onNextStep={handleNextStep}
              />
            </View>
            <View style={{ width: stepWidth }}>
              <AddressBankStep 
                formData={formData} 
                updateField={updateField} 
                errors={errors}
                onNextStep={handleNextStep}
              />
            </View>
            <View style={{ width: stepWidth }}>
              <EmergencyContactStep
                formData={formData}
                updateField={updateField}
                errors={errors}
                onNextStep={handleNextStep}
              />
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <Button
            title="Back"
            variant="outline"
            onPress={handlePrevStep}
            style={[styles.actionBtn, styles.backBtn]}
          />
        )}
        <Button
          title="Continue"
          onPress={handleNextStep}
          style={styles.actionBtn}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  mainHeader: { marginBottom: spacing.xs },
  sliderWrapper: {
    flex: 1,
    overflow: "hidden", 
  },
  stepsContainer: {
    flexDirection: "row",
  },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === "ios" ? spacing.xl : spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: { flex: 1 },
  backBtn: { flex: 0.5 },
});