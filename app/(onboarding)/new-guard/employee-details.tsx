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
import { EmploymentStep } from "../../../src/components/onboarding/steps/EmploymentStep";
import { PersonalStep } from "../../../src/components/onboarding/steps/PersonalStep";
import { DocumentsStep } from "../../../src/components/onboarding/steps/DocumentsStep";
import { AddressStep } from "../../../src/components/onboarding/steps/AddressStep";
import { BankNomineeStep } from "../../../src/components/onboarding/steps/BankNomineeStep";
import { EmergencyContactStep } from "../../../src/components/onboarding/steps/EmergencyContactStep";
import { useOnboarding } from "../../../src/context/OnboardingContext";
import { useEmployeeForm } from "../../../src/hooks/useEmployeeForm";
import { colors, spacing } from "../../../src/theme";
import { lightImpact, warning } from "../../../src/utils/haptics";

const TOTAL_STEPS = 6;

export default function EmployeeDetailsScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  
  const { formData, updateField, updateNominee, errors, validateStep } = useEmployeeForm();

  const { width } = useWindowDimensions();
  const stepWidth = width - spacing.md * 2;

  const [currentStep, setCurrentStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleNextStep = useCallback(() => {
    // Validate only the current active step before allowing progression
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
        maritalStatus: formData.maritalStatus,
        highestEducation: formData.highestEducation,
      },
      identity: {
        aadhaar: formData.aadhaarNumber,
        pan: formData.panNumber,
        uan: formData.uanNumber,
        esic: formData.esicNumber,
        drivingLicence: formData.drivingLicence,
      },
      address: {
        permanent: formData.permanentAddress,
        current: formData.currentAddress,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        permanentPoliceStation: formData.permanentPoliceStation,
        currentCity: formData.currentCity,
        currentState: formData.currentState,
        currentPinCode: formData.currentPinCode,
      },
      bank: {
        bankName: formData.bankName,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifscCode,
        micr: formData.micrCode,
      },
      nomineesCount: formData.numberOfNominees,
      nominees: formData.nominees,
      emergencyContact: {
        name: formData.em1Name,
        relation: formData.em1Relation,
        mobile: formData.em1Mobile,
      },
    });
    // Move to the selfie capture / document upload screens
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
            {/* Step 1: Employment Details */}
            <View style={{ width: stepWidth }}>
              <EmploymentStep formData={formData} updateField={updateField} currentYear={currentYear} errors={errors} />
            </View>
            
            {/* Step 2: Personal Details */}
            <View style={{ width: stepWidth }}>
              <PersonalStep formData={formData} updateField={updateField} errors={errors} />
            </View>
            
            {/* Step 3: Documents (Identity) */}
            <View style={{ width: stepWidth }}>
              <DocumentsStep formData={formData} updateField={updateField} errors={errors} />
            </View>
            
            {/* Step 4: Address Details */}
            <View style={{ width: stepWidth }}>
              <AddressStep formData={formData} updateField={updateField} errors={errors} />
            </View>
            
            {/* Step 5: Bank Details & Nominees */}
            <View style={{ width: stepWidth }}>
              <BankNomineeStep formData={formData} updateField={updateField} updateNominee={updateNominee} errors={errors} />
            </View>
            
            {/* Step 6: Emergency Contact */}
            <View style={{ width: stepWidth }}>
              <EmergencyContactStep formData={formData} updateField={updateField} errors={errors} />
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
          title={currentStep === TOTAL_STEPS ? "Review Details" : "Continue"}
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