import React from 'react';
import { View } from 'react-native';
import { Input, SegmentedInput } from '../../index';
import { FormSection } from '../FormSection';
import { EmployeeFormData } from '../../../types/EmployeeForm';
import { isValidNameInput, isValidAddressInput, allowOnlyNumbers } from '../../../utils/inputFilters';

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
}

export function AddressBankStep({ formData, updateField }: StepProps) {
  return (
    <View>
      <FormSection title="Address">
        <Input label="Permanent Address" value={formData.permanentAddress} onChangeText={(text) => { if (isValidAddressInput(text)) updateField('permanentAddress', text); }} multiline />
        <Input label="Current Address" value={formData.currentAddress} onChangeText={(text) => { if (isValidAddressInput(text)) updateField('currentAddress', text); }} multiline />
        <Input label="City" value={formData.city} onChangeText={(text) => { if (isValidNameInput(text)) updateField('city', text); }} />
        <Input label="State" value={formData.state} onChangeText={(text) => { if (isValidNameInput(text)) updateField('state', text); }} />
        <Input label="PIN Code" value={formData.pinCode} onChangeText={(text) => updateField('pinCode', allowOnlyNumbers(text))} keyboardType="numeric" maxLength={6} />
      </FormSection>

      <FormSection title="Bank Details">
        <Input 
          label="Bank Name" 
          value={formData.bankName} 
          onChangeText={(text) => { if (isValidNameInput(text)) updateField('bankName', text); }} 
        />
        
        <SegmentedInput
          label="Account Number"
          value={formData.accountNumber}
          onChange={(val) => updateField('accountNumber', val)}
          segments={[
            { length: 4, type: 'numeric' },
            { length: 4, type: 'numeric' },
            { length: 4, type: 'numeric' },
            { length: 4, type: 'numeric' },
          ]}
        />
        
        <SegmentedInput
          label="IFSC Code"
          value={formData.ifscCode}
          onChange={(val) => updateField('ifscCode', val)}
          segments={[
            { length: 4, type: 'alpha' },
            { length: 1, type: 'fixed', value: '0' },
            { length: 3, type: 'numeric' },
            { length: 3, type: 'numeric' },
          ]}
        />
        
        <Input 
          label="Branch" 
          value={formData.branch} 
          onChangeText={(text) => { if (isValidAddressInput(text)) updateField('branch', text); }} 
        />
        
        <SegmentedInput
          label="MICR Code"
          value={formData.micrCode}
          onChange={(val) => updateField('micrCode', val)}
          segments={[
            { length: 3, type: 'numeric' },
            { length: 3, type: 'numeric' },
            { length: 3, type: 'numeric' },
          ]}
        />
      </FormSection>
    </View>
  );
}