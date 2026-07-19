import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { Input, SegmentedInput } from '../../index';
import { FormSection } from '../FormSection';
import { EmployeeFormData } from '../../../types/EmployeeForm';
import { allowOnlyNumbers } from '../../../utils/inputFilters';

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  onNextStep?: () => void;
  errors: Partial<Record<keyof EmployeeFormData, string>>;
}

export function IdentityStep({ formData, updateField, onNextStep, errors }: StepProps) {
  const panRef = useRef<{ focus: () => void }>(null);
  const uanRef = useRef<{ focus: () => void }>(null);
  const esicRef = useRef<TextInput>(null);

  return (
    <View>
      <FormSection title="Identity Details">
        <Input
          label="Aadhaar Number"
          value={formData.aadhaarNumber}
          error={errors.aadhaarNumber}
          onChangeText={(text) => updateField('aadhaarNumber', text)}
          maxLength={15}
          returnKeyType="next"
          onSubmitEditing={() => panRef.current?.focus()}
          submitBehavior="submit"
        />
        
        <SegmentedInput
          ref={panRef}
          label="PAN Number"
          value={formData.panNumber}
          error={errors.panNumber}
          onChange={(val) => updateField('panNumber', val)}
          segments={[
            { length: 5, type: 'alpha' },
            { length: 4, type: 'numeric' },
            { length: 1, type: 'alpha' },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => uanRef.current?.focus()}
        />
        
        <SegmentedInput
          ref={uanRef}
          label="UAN Number"
          value={formData.uanNumber}
          error={errors.uanNumber}
          onChange={(val) => updateField('uanNumber', val)}
          segments={[
            { length: 4, type: 'numeric' },
            { length: 4, type: 'numeric' },
            { length: 4, type: 'numeric' },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => esicRef.current?.focus()}
        />
        
        <Input 
          ref={esicRef}
          label="ESIC Number" 
          value={formData.esicNumber}
          error={errors.esicNumber} 
          onChangeText={(text) => updateField('esicNumber', allowOnlyNumbers(text))} 
          keyboardType="numeric" 
          maxLength={17} 
          returnKeyType="done"
          onSubmitEditing={onNextStep}
        />
      </FormSection>
    </View>
  );
}