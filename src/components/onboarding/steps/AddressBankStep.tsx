import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { Input, SegmentedInput } from '../../index';
import { FormSection } from '../FormSection';
import { EmployeeFormData } from '../../../types/EmployeeForm';
import { isValidNameInput, isValidAddressInput, allowOnlyNumbers } from '../../../utils/inputFilters';

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  onNextStep?: () => void;
  errors: Partial<Record<keyof EmployeeFormData, string>>;
}

export function AddressBankStep({ formData, updateField, onNextStep, errors }: StepProps) {
  const currAddressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const pinCodeRef = useRef<TextInput>(null);
  const bankNameRef = useRef<TextInput>(null);
  const accNumRef = useRef<{ focus: () => void }>(null);
  const ifscRef = useRef<{ focus: () => void }>(null);
  const branchRef = useRef<TextInput>(null);
  const micrRef = useRef<{ focus: () => void }>(null);

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
          blurOnSubmit={false}
        />
        <Input 
          ref={currAddressRef}
          label="Current Address" 
          value={formData.currentAddress} 
          error={errors.currentAddress}
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField('currentAddress', text); }} 
          multiline 
          returnKeyType="next"
          onSubmitEditing={() => cityRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input 
          ref={cityRef}
          label="City" 
          value={formData.city} 
          error={errors.city}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField('city', text); }} 
          returnKeyType="next"
          onSubmitEditing={() => stateRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input 
          ref={stateRef}
          label="State" 
          value={formData.state} 
          error={errors.state}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField('state', text); }} 
          returnKeyType="next"
          onSubmitEditing={() => pinCodeRef.current?.focus()}
          blurOnSubmit={false}
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
          blurOnSubmit={false}
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
          blurOnSubmit={false}
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
          blurOnSubmit={false}
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