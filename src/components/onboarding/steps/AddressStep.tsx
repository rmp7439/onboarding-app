import React from "react";
import { View } from "react-native";
import { Input, SearchableDropdown } from "../../index";
import { FormSection } from "../FormSection";
import { EmployeeFormData } from "../../../types/EmployeeForm";
import { isValidAddressInput, allowOnlyNumbers } from "../../../utils/inputFilters";
import { useIndianLocations } from "../../../hooks/useIndianLocations";

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  errors: Partial<Record<keyof EmployeeFormData | string, string>>;
}

export function AddressStep({ formData, updateField, errors }: StepProps) {
  const { stateOptions: permStateOptions, cityOptions: permCityOptions } = useIndianLocations(formData.state);
  const { stateOptions: currStateOptions, cityOptions: currCityOptions } = useIndianLocations(formData.currentState);

  const handlePermStateChange = (newState: string) => {
    if (newState !== formData.state) {
      updateField("state", newState);
      updateField("city", ""); 
    }
  };

  const handleCurrStateChange = (newState: string) => {
    if (newState !== formData.currentState) {
      updateField("currentState", newState);
      updateField("currentCity", ""); 
    }
  };

  return (
    <View>
      <FormSection title="Permanent Address">
        <Input
          label="Address"
          value={formData.permanentAddress}
          error={errors.permanentAddress}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField("permanentAddress", text); }}
          multiline
        />

        <SearchableDropdown
          label="State"
          placeholder="Select State"
          value={formData.state}
          error={errors.state}
          options={permStateOptions}
          onSelect={handlePermStateChange}
        />

        <SearchableDropdown
          label="City"
          placeholder="Select City"
          value={formData.city}
          error={errors.city}
          options={permCityOptions}
          onSelect={(val) => updateField("city", val)}
          disabled={!formData.state}
        />

        <Input
          label="PIN Code"
          value={formData.pinCode}
          error={errors.pinCode}
          onChangeText={(text) => updateField("pinCode", allowOnlyNumbers(text))}
          keyboardType="numeric"
          maxLength={6}
        />

        <Input
          label="Police Station"
          value={formData.permanentPoliceStation}
          error={errors.permanentPoliceStation}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField("permanentPoliceStation", text); }}
        />
      </FormSection>

      <FormSection title="Current Address">
        <Input
          label="Address"
          value={formData.currentAddress}
          error={errors.currentAddress}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField("currentAddress", text); }}
          multiline
        />

        <SearchableDropdown
          label="State"
          placeholder="Select State"
          value={formData.currentState}
          error={errors.currentState}
          options={currStateOptions}
          onSelect={handleCurrStateChange}
        />

        <SearchableDropdown
          label="City"
          placeholder="Select City"
          value={formData.currentCity}
          error={errors.currentCity}
          options={currCityOptions}
          onSelect={(val) => updateField("currentCity", val)}
          disabled={!formData.currentState}
        />

        <Input
          label="PIN Code"
          value={formData.currentPinCode}
          error={errors.currentPinCode}
          onChangeText={(text) => updateField("currentPinCode", allowOnlyNumbers(text))}
          keyboardType="numeric"
          maxLength={6}
        />
      </FormSection>
    </View>
  );
}