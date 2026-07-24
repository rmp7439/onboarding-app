import React, { useRef, useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import { Input, SegmentedInput, SearchableDropdown } from "../../index";
import { FormSection } from "../FormSection";
import { EmployeeFormData } from "../../../types/EmployeeForm";
import { isValidNameInput, isValidAddressInput, allowOnlyNumbers } from "../../../utils/inputFilters";
import { useIndianLocations } from "../../../hooks/useIndianLocations";
import { api } from "../../../api/apiClient";
import { useOnboarding } from "../../../context/OnboardingContext";

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  onNextStep?: () => void;
  errors: Partial<Record<keyof EmployeeFormData, string>>;
}

export function AddressBankStep({ formData, updateField, onNextStep, errors }: StepProps) {
  const { data } = useOnboarding();
  const isReq = (f: string) => data.unitConfig.requiredFields.includes(f);

  const [bankOptions, setBankOptions] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    let isActive = true;
    api.getActiveBanks()
      .then((banks: any) => {
        if (isActive) {
          setBankOptions(banks.map((b: any) => ({ label: b.name, value: b.name })));
        }
      })
      .catch((err: any) => console.error("Failed to load active banks", err));
      
    return () => { isActive = false; };
  }, []);

  const currentBankOptions = [...bankOptions];
  if (formData.bankName && !currentBankOptions.find(o => o.value === formData.bankName)) {
    currentBankOptions.push({ label: formData.bankName, value: formData.bankName });
  }

  const accHolderRef = useRef<TextInput>(null);
  const accNumRef = useRef<any>(null);
  const ifscRef = useRef<any>(null);
  const micrRef = useRef<any>(null);

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
          required
        />

        <SearchableDropdown
          label="State"
          placeholder="Select State"
          value={formData.state}
          error={errors.state}
          options={permStateOptions}
          onSelect={handlePermStateChange}
          required
        />

        <SearchableDropdown
          label="City"
          placeholder="Select City"
          value={formData.city}
          error={errors.city}
          options={permCityOptions}
          onSelect={(val) => updateField("city", val)}
          disabled={!formData.state}
          required
        />

        <Input
          label="PIN Code"
          value={formData.pinCode}
          error={errors.pinCode}
          onChangeText={(text) => updateField("pinCode", allowOnlyNumbers(text))}
          keyboardType="numeric"
          maxLength={6}
          required
        />

        <Input
          label="Police Station"
          value={formData.permanentPoliceStation}
          error={errors.permanentPoliceStation}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField("permanentPoliceStation", text); }}
          required
        />
      </FormSection>

      <FormSection title="Current Address">
        <Input
          label="Address"
          value={formData.currentAddress}
          error={errors.currentAddress}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField("currentAddress", text); }}
          multiline
          required
        />

        <SearchableDropdown
          label="State"
          placeholder="Select State"
          value={formData.currentState}
          error={errors.currentState}
          options={currStateOptions}
          onSelect={handleCurrStateChange}
          required
        />

        <SearchableDropdown
          label="City"
          placeholder="Select City"
          value={formData.currentCity}
          error={errors.currentCity}
          options={currCityOptions}
          onSelect={(val) => updateField("currentCity", val)}
          disabled={!formData.currentState}
          required
        />

        <Input
          label="PIN Code"
          value={formData.currentPinCode}
          error={errors.currentPinCode}
          onChangeText={(text) => updateField("currentPinCode", allowOnlyNumbers(text))}
          keyboardType="numeric"
          maxLength={6}
          required
        />
      </FormSection>

      <FormSection title="Bank Details">
        <Input
          ref={accHolderRef}
          label="Account Holder Name"
          value={formData.accountHolderName}
          error={errors.accountHolderName}
          onChangeText={(text) => {
            if (isValidNameInput(text)) updateField("accountHolderName", text);
          }}
          returnKeyType="next"
          submitBehavior="submit"
          required={isReq('accountHolderName')}
        />

        <SearchableDropdown
          label="Bank Name"
          placeholder="Select Bank"
          value={formData.bankName}
          error={errors.bankName}
          options={currentBankOptions}
          onSelect={(val) => updateField("bankName", val)}
          required={isReq('bankName')}
        />

        <SegmentedInput
          ref={accNumRef}
          label="Account Number"
          value={formData.accountNumber}
          error={errors.accountNumber}
          onChange={(val) => updateField("accountNumber", val)}
          segments={[
            { length: 4, type: "numeric" },
            { length: 4, type: "numeric" },
            { length: 4, type: "numeric" },
            { length: 4, type: "numeric" },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => ifscRef.current?.focus()}
          required={isReq('accountNumber')}
        />

        <SegmentedInput
          ref={ifscRef}
          label="IFSC Code"
          value={formData.ifscCode}
          error={errors.ifscCode}
          onChange={(val) => updateField("ifscCode", val)}
          segments={[
            { length: 4, type: "alpha" },
            { length: 1, type: "fixed", value: "0" },
            { length: 3, type: "numeric" },
            { length: 3, type: "numeric" },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => micrRef.current?.focus()}
          required={isReq('ifsc')}
        />

        <SegmentedInput
          ref={micrRef}
          label="MICR Code"
          value={formData.micrCode}
          error={errors.micrCode}
          onChange={(val) => updateField("micrCode", val)}
          segments={[
            { length: 3, type: "numeric" },
            { length: 3, type: "numeric" },
            { length: 3, type: "numeric" },
          ]}
          returnKeyType="done"
          onSubmitEditing={onNextStep}
          required={isReq('micr')}
        />
      </FormSection>
    </View>
  );
}