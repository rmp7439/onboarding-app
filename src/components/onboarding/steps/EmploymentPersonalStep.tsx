import React, { useRef } from "react";
import { View, TextInput } from "react-native";
import { Input, DateInput } from "../../index";
import { FormSection } from "../FormSection";
import { GenderSelector } from "../GenderSelector";
import { BloodGroupSelector } from "../BloodGroupSelector";
import { MIN_JOINING_YEAR, MIN_BIRTH_YEAR } from "../../../constants/App";
import { EmployeeFormData } from "../../../types/EmployeeForm";
import { isValidNameInput } from "../../../utils/inputFilters";
import { formatMobile } from "../../../utils/formatters";

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  currentYear: number;
  onNextStep?: () => void;
}

export function EmploymentPersonalStep({
  formData,
  updateField,
  currentYear,
  onNextStep,
}: StepProps) {
  const unitSiteRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const surnameRef = useRef<TextInput>(null);
  const fatherNameRef = useRef<TextInput>(null);
  const husbandNameRef = useRef<TextInput>(null);
  const mobileNumberRef = useRef<TextInput>(null);

  return (
    <View>
      <FormSection title="Employment Details">
        <DateInput
          label="Date of Joining"
          value={formData.dateOfJoining}
          onChange={(val) => updateField("dateOfJoining", val)}
          minYear={MIN_JOINING_YEAR}
          maxYear={currentYear}
        />
        <Input
          ref={unitSiteRef}
          label="Unit / Site"
          value={formData.unitSite}
          onChangeText={(text) => updateField("unitSite", text)}
          placeholder="Enter unit or site"
          returnKeyType="next"
          onSubmitEditing={() => firstNameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </FormSection>

      <FormSection title="Personal Details">
        <Input
          ref={firstNameRef}
          label="First Name"
          value={formData.firstName}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("firstName", text); }}
          returnKeyType="next"
          onSubmitEditing={() => surnameRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={surnameRef}
          label="Surname"
          value={formData.surname}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("surname", text); }}
          returnKeyType="next"
          onSubmitEditing={() => fatherNameRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={fatherNameRef}
          label="Father's Name"
          value={formData.fatherName}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("fatherName", text); }}
          returnKeyType="done"
        />

        <GenderSelector
          value={formData.gender}
          onChange={(val) => updateField("gender", val)}
        />

        <Input
          ref={husbandNameRef}
          label="Husband's Name (Optional)"
          value={formData.husbandName}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("husbandName", text); }}
          editable={formData.gender === "Female"}
          returnKeyType="next"
          onSubmitEditing={() => mobileNumberRef.current?.focus()}
          blurOnSubmit={false}
        />

        <DateInput
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(val) => updateField("dateOfBirth", val)}
          minYear={MIN_BIRTH_YEAR}
          maxYear={currentYear}
        />

        <Input
          ref={mobileNumberRef}
          label="Mobile Number"
          value={formData.mobileNumber}
          onChangeText={(text) => updateField("mobileNumber", formatMobile(text)) }
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="done"
        />
        <BloodGroupSelector
          value={formData.bloodGroup}
          onChange={(val) => updateField("bloodGroup", val)}
        />
      </FormSection>
    </View>
  );
}