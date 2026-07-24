import React, { useRef } from "react";
import { View, TextInput } from "react-native";
import { Input, SearchableDropdown } from "../../index";
import { FormSection } from "../FormSection";
import { BloodGroupSelector } from "../BloodGroupSelector";
import { EmployeeFormData } from "../../../types/EmployeeForm";
import { isValidNameInput } from "../../../utils/inputFilters";
import { EDUCATION_OPTIONS } from '../../../constants/Education';
import { MARITAL_STATUS_OPTIONS } from '../../../constants/MaritalStatus';

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  errors: Partial<Record<keyof EmployeeFormData | string, string>>;
}

export function PersonalStep({ formData, updateField, errors }: StepProps) {
  const husbandNameRef = useRef<TextInput>(null);

  return (
    <View>
      <FormSection title="Personal Information">
        <Input
          label="Father's Name"
          value={formData.fatherName}
          error={errors.fatherName}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("fatherName", text); }}
          returnKeyType="next"
          onSubmitEditing={() => { if (formData.gender === "Female") husbandNameRef.current?.focus(); }}
        />

        {formData.gender === "Female" && (
          <Input
            ref={husbandNameRef}
            label="Husband's Name"
            value={formData.husbandName}
            error={errors.husbandName}
            onChangeText={(text) => { if (isValidNameInput(text)) updateField("husbandName", text); }}
            returnKeyType="done"
          />
        )}
        
        <BloodGroupSelector
          value={formData.bloodGroup}
          onChange={(val) => updateField("bloodGroup", val)}
        />
        {errors.bloodGroup && <Input label="" value="" error={errors.bloodGroup} editable={false} style={{display: 'none'}} />}

        <SearchableDropdown
          label="Marital Status"
          value={formData.maritalStatus}
          error={errors.maritalStatus}
          options={MARITAL_STATUS_OPTIONS}
          onSelect={(val) => updateField("maritalStatus", val)}
        />

        <SearchableDropdown
          label="Highest Education"
          value={formData.highestEducation}
          error={errors.highestEducation}
          options={EDUCATION_OPTIONS}
          onSelect={(val) => updateField("highestEducation", val)}
        />
      </FormSection>
    </View>
  );
}