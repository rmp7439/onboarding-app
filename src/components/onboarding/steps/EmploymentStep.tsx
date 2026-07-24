import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, ActivityIndicator, Text } from "react-native";
import { Input, DateInput } from "../../index";
import { FormSection } from "../FormSection";
import { GenderSelector } from "../GenderSelector";
import { OptionSelector } from "../OptionSelector";
import { api } from "../../../api/apiClient";
import { MIN_JOINING_YEAR, MIN_BIRTH_YEAR } from "../../../constants/App";
import { EmployeeFormData } from "../../../types/EmployeeForm";
import { isValidNameInput } from "../../../utils/inputFilters";
import { formatMobile } from "../../../utils/formatters";
import { colors, spacing, typography } from "../../../theme";
import { useOnboarding } from "../../../context/OnboardingContext";

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  currentYear: number;
  errors: Partial<Record<keyof EmployeeFormData | string, string>>;
}

export function EmploymentStep({ formData, updateField, currentYear, errors }: StepProps) {
  const { updateData } = useOnboarding();
  const firstNameRef = useRef<TextInput>(null);
  const surnameRef = useRef<TextInput>(null);
  const mobileNumberRef = useRef<TextInput>(null);

  const [units, setUnits] = useState<any[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);

  useEffect(() => {
    let isActive = true;
    Promise.all([api.getUnits(), api.getMyUnits()])
      .then(([allUnits, myUnits]) => {
        if (!isActive) return;
        const assignedUnits = allUnits.filter((u: any) => myUnits.includes(u.name));
        setUnits(assignedUnits);
        if (formData.unitSite) {
          const matched = assignedUnits.find((u: any) => u.name === formData.unitSite);
          if (matched) updateData({ unitConfig: { requiredFields: matched.requiredFields || [] } });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => { if (isActive) setLoadingUnits(false); });
    
    return () => { isActive = false; };
  }, []);

  const handleUnitSelect = (val: string) => {
    updateField("unitSite", val);
    const selected = units.find((u) => u.name === val);
    if (selected) {
      updateData({ unitConfig: { requiredFields: selected.requiredFields || [] } });
    }
  };

  return (
    <View>
      <FormSection title="Employment Details">
        <DateInput
          label="Date of Joining"
          value={formData.dateOfJoining}
          error={errors.dateOfJoining}
          onChange={(val) => updateField("dateOfJoining", val)}
          minYear={MIN_JOINING_YEAR}
          maxYear={currentYear}
        />
        
        <View style={{ marginBottom: spacing.md }}>
          {loadingUnits ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ alignSelf: 'flex-start', marginTop: spacing.sm }} />
          ) : units.length > 0 ? (
            <OptionSelector
              label="Unit / Site"
              options={units.map((u) => u.name)}
              selectedValue={formData.unitSite}
              onSelect={handleUnitSelect}
            />
          ) : (
            <Text style={{ color: colors.error, fontSize: typography.fontSize.sm }}>
              No units assigned. Please contact Admin.
            </Text>
          )}
          {!!errors.unitSite && (
            <Text style={{ color: colors.error, fontSize: typography.fontSize.xs, marginTop: -spacing.sm }}>
              {errors.unitSite}
            </Text>
          )}
        </View>

        <Input
          ref={firstNameRef}
          label="First Name"
          value={formData.firstName}
          error={errors.firstName}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("firstName", text); }}
          returnKeyType="next"
          onSubmitEditing={() => surnameRef.current?.focus()}
          submitBehavior="submit"
        />
        
        <Input
          ref={surnameRef}
          label="Surname"
          value={formData.surname}
          error={errors.surname}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("surname", text); }}
          returnKeyType="next"
          onSubmitEditing={() => mobileNumberRef.current?.focus()}
          submitBehavior="submit"
        />

        <Input
          ref={mobileNumberRef}
          label="Mobile Number"
          value={formData.mobileNumber}
          error={errors.mobileNumber}
          onChangeText={(text) => updateField("mobileNumber", formatMobile(text)) }
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="done"
        />

        <GenderSelector
          value={formData.gender}
          onChange={(val) => updateField("gender", val)}
        />
        {errors.gender && <Input label="" value="" error={errors.gender} editable={false} style={{display: 'none'}} />}

        <DateInput
          label="Date of Birth"
          value={formData.dateOfBirth}
          error={errors.dateOfBirth}
          onChange={(val) => updateField("dateOfBirth", val)}
          minYear={MIN_BIRTH_YEAR}
          maxYear={currentYear}
        />
      </FormSection>
    </View>
  );
}