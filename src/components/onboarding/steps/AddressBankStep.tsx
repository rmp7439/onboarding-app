import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { Input, SegmentedInput, SearchableDropdown } from '../../index';
import { FormSection } from '../FormSection';
import { EmployeeFormData } from '../../../types/EmployeeForm';
import { isValidNameInput, isValidAddressInput, allowOnlyNumbers } from '../../../utils/inputFilters';
import { useIndianLocations } from '../../../hooks/useIndianLocations';

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  onNextStep?: () => void;
  errors: Partial<Record<keyof EmployeeFormData, string>>;
}

export function AddressBankStep({ formData, updateField, onNextStep, errors }: StepProps) {
  const currAddressRef = useRef<TextInput>(null);
  const stateRef = useRef<any>(null);
  const cityRef = useRef<any>(null);
  const pinCodeRef = useRef<TextInput>(null);
  const bankNameRef = useRef<TextInput>(null);
  const accNumRef = useRef<any>(null);
  const ifscRef = useRef<any>(null);
  const branchRef = useRef<TextInput>(null);
  const micrRef = useRef<any>(null);

  // Consume the clean geographical API hook
  const { stateOptions, cityOptions } = useIndianLocations(formData.state);

  const handleStateChange = (newState: string) => {
    if (newState !== formData.state) {
      updateField('state', newState);
      updateField('city', ''); // Automatically clear city when state changes
    }
  };

  return (
    <View>
      <FormSection title="Address">
        <Input 
          label="Permanent Address" 
          value={formData.permanentAddress} 
          error={errors.permanentAddress}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField('permanentAddress', text); }} 
          multiline 
          returnKeyType="next"
          onSubmitEditing={() => currAddressRef.current?.focus()}
          submitBehavior="submit"
        />
        <Input 
          ref={currAddressRef}
          label="Current Address" 
          value={formData.currentAddress} 
          error={errors.currentAddress}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField('currentAddress', text); }} 
          multiline 
          returnKeyType="next"
          onSubmitEditing={() => stateRef.current?.focus()}
          submitBehavior="submit"
        />
        
        <SearchableDropdown
          ref={stateRef}
          label="State"
          placeholder="Select State"
          value={formData.state}
          error={errors.state}
          options={stateOptions}
          onSelect={handleStateChange}
        />

        <SearchableDropdown
          ref={cityRef}
          label="City"
          placeholder="Select City"
          value={formData.city}
          error={errors.city}
          options={cityOptions}
          onSelect={(val) => updateField('city', val)}
          disabled={!formData.state}
        />

        <Input 
          ref={pinCodeRef}
          label="PIN Code" 
          value={formData.pinCode} 
          error={errors.pinCode}
          onChangeText={(text) => updateField('pinCode', allowOnlyNumbers(text))} 
          keyboardType="numeric" 
          maxLength={6} 
          returnKeyType="next"
          onSubmitEditing={() => bankNameRef.current?.focus()}
          submitBehavior="submit"
        />
      </FormSection>

      <FormSection title="Bank Details">
        <Input 
          ref={bankNameRef}
          label="Bank Name" 
          value={formData.bankName} 
          error={errors.bankName}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField('bankName', text); }} 
          returnKeyType="next"
          onSubmitEditing={() => accNumRef.current?.focus()}
          submitBehavior="submit"
        />
        <SegmentedInput
          ref={accNumRef}
          label="Account Number"
          value={formData.accountNumber}
          error={errors.accountNumber}
          onChange={(val) => updateField('accountNumber', val)}
          segments={[
            { length: 4, type: 'numeric' }, { length: 4, type: 'numeric' },
            { length: 4, type: 'numeric' }, { length: 4, type: 'numeric' },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => ifscRef.current?.focus()}
        />
        <SegmentedInput
          ref={ifscRef}
          label="IFSC Code"
          value={formData.ifscCode}
          error={errors.ifscCode}
          onChange={(val) => updateField('ifscCode', val)}
          segments={[
            { length: 4, type: 'alpha' }, { length: 1, type: 'fixed', value: '0' },
            { length: 3, type: 'numeric' }, { length: 3, type: 'numeric' },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => branchRef.current?.focus()}
        />
        <Input 
          ref={branchRef}
          label="Branch" 
          value={formData.branch} 
          error={errors.branch}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField('branch', text); }} 
          returnKeyType="next"
          onSubmitEditing={() => micrRef.current?.focus()}
          submitBehavior="submit"
        />
        <SegmentedInput
          ref={micrRef}
          label="MICR Code"
          value={formData.micrCode}
          error={errors.micrCode}
          onChange={(val) => updateField('micrCode', val)}
          segments={[
            { length: 3, type: 'numeric' }, { length: 3, type: 'numeric' }, { length: 3, type: 'numeric' },
          ]}
          returnKeyType="done"
          onSubmitEditing={onNextStep}
        />
      </FormSection>
    </View>
  );
}