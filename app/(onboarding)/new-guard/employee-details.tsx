import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  useWindowDimensions,
  Keyboard,
  Easing,
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

// High-performance wrapper: completely freezes off-screen steps to prevent DOM reconciliation 
// during keystrokes, reserving CPU strictly for the active step and the sliding animation.
const MemoizedStep = React.memo(
  ({ isActive, children, scrollRef, stepWidth }: any) => {
    return (
      <ScrollView
        ref={scrollRef}
        style={{ width: stepWidth }}
        contentContainerStyle={styles.stepScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  },
  (prev, next) => {
    if (!prev.isActive && !next.isActive) return true; // Freeze inactive steps
    if (prev.isActive !== next.isActive) return false; // Re-render when entering/leaving screen
    return false; // Always update the currently active step to reflect user input instantly
  }
);

export default function EmployeeDetailsScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const { formData, updateField, updateNominee, errors, validateStep } = useEmployeeForm();

  const { width } = useWindowDimensions();
  const stepWidth = width - spacing.md * 2; 

  const [currentStep, setCurrentStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const scrollRefs = useRef<Array<ScrollView | null>>([]);

  const handleNextStep = useCallback(() => {
    Keyboard.dismiss();
    
    if (!validateStep(currentStep)) {
      warning();
      return; 
    }
    
    lightImpact();

    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Reset scroll position for the incoming step seamlessly before the slide
      scrollRefs.current[nextStep - 1]?.scrollTo({ y: 0, animated: false });

      Animated.timing(slideAnim, {
        toValue: -(nextStep - 1) * stepWidth,
        duration: 350,
        easing: Easing.out(Easing.poly(3)), // Smooth, native-feeling easing curve
        useNativeDriver: true,
      }).start();
    } else {
      handleFinalSubmit();
    }
  }, [currentStep, stepWidth, slideAnim, validateStep]);

  const handlePrevStep = useCallback(() => {
    Keyboard.dismiss();
    
    if (currentStep > 1) {
      lightImpact();
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      Animated.timing(slideAnim, {
        toValue: -(prevStep - 1) * stepWidth,
        duration: 350,
        easing: Easing.out(Easing.poly(3)),
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, stepWidth, slideAnim]);

  const handleFinalSubmit = () => {
    updateData({
      employment: { joiningDate: formData.dateOfJoining, unit: formData.unitSite },
      personal: {
        firstName: formData.firstName, surname: formData.surname, fatherName: formData.fatherName,
        husbandName: formData.husbandName, gender: formData.gender, dob: formData.dateOfBirth,
        mobile: formData.mobileNumber, bloodGroup: formData.bloodGroup,
        maritalStatus: formData.maritalStatus, highestEducation: formData.highestEducation,
      },
      identity: {
        aadhaar: formData.aadhaarNumber, pan: formData.panNumber, uan: formData.uanNumber,
        esic: formData.esicNumber, drivingLicence: formData.drivingLicence,
      },
      address: {
        permanent: formData.permanentAddress, current: formData.currentAddress,
        city: formData.city, state: formData.state, pinCode: formData.pinCode,
        permanentPoliceStation: formData.permanentPoliceStation, currentCity: formData.currentCity,
        currentState: formData.currentState, currentPinCode: formData.currentPinCode,
      },
      bank: {
        bankName: formData.bankName, accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber, ifsc: formData.ifscCode, micr: formData.micrCode,
      },
      nomineesCount: formData.numberOfNominees,
      nominees: formData.nominees,
      emergencyContact: {
        name: formData.em1Name, relation: formData.em1Relation, mobile: formData.em1Mobile,
      },
    });
    
    // Bypass review details entirely, routing directly to the photo capture 
    router.push("/(onboarding)/new-guard/capture-photo");
  };

  const renderStep = (index: number, Component: React.ReactNode) => (
    <MemoizedStep
      key={index}
      isActive={currentStep === index + 1}
      scrollRef={(el: any) => { scrollRefs.current[index] = el; }}
      stepWidth={stepWidth}
    >
      {Component}
    </MemoizedStep>
  );

  return (
    <Screen scrollable={false} style={styles.container}>
      <View style={styles.headerContainer}>
        <SectionTitle
          title="Employee Registration"
          subtitle={`Step ${currentStep} of ${TOTAL_STEPS}`}
          style={styles.mainHeader}
        />
        <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </View>

      <View style={styles.sliderWrapper}>
        <Animated.View
          style={[
            styles.stepsContainer,
            { width: stepWidth * TOTAL_STEPS, transform: [{ translateX: slideAnim }] },
          ]}
        >
          {renderStep(0, <EmploymentStep formData={formData} updateField={updateField} currentYear={currentYear} errors={errors} />)}
          {renderStep(1, <PersonalStep formData={formData} updateField={updateField} errors={errors} />)}
          {renderStep(2, <DocumentsStep formData={formData} updateField={updateField} errors={errors} />)}
          {renderStep(3, <AddressStep formData={formData} updateField={updateField} errors={errors} />)}
          {renderStep(4, <BankNomineeStep formData={formData} updateField={updateField} updateNominee={updateNominee} errors={errors} />)}
          {renderStep(5, <EmergencyContactStep formData={formData} updateField={updateField} errors={errors} />)}
        </Animated.View>
      </View>

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
          title={currentStep === TOTAL_STEPS ? "Submit Details" : "Continue"}
          onPress={handleNextStep}
          style={styles.actionBtn}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { paddingBottom: spacing.sm },
  mainHeader: { marginBottom: spacing.xs },
  sliderWrapper: {
    flex: 1,
    overflow: "hidden", 
  },
  stepsContainer: {
    flexDirection: "row",
    flex: 1,
  },
  stepScrollContent: {
    flexGrow: 1,
    paddingBottom: spacing["2xl"],
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