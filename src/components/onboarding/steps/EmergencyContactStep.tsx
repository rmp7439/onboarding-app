import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { Input } from '../../index';
import { FormSection } from '../FormSection';
import { EmployeeFormData } from '../../../types/EmployeeForm';

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  onNextStep?: () => void;
}

export function EmergencyContactStep({ formData, updateField, onNextStep }: StepProps) {
  const relationRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);

  return (
    <View>
      <FormSection title="Emergency Contact">
        <Input 
          label="Name" 
          value={formData.em1Name} 
          onChangeText={(text) => updateField('em1Name', text)} 
          returnKeyType="next"
          onSubmitEditing={() => relationRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input 
          ref={relationRef}
          label="Relation" 
          value={formData.em1Relation} 
          onChangeText={(text) => updateField('em1Relation', text)} 
          returnKeyType="next"
          onSubmitEditing={() => mobileRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input 
          ref={mobileRef}
          label="Mobile Number" 
          value={formData.em1Mobile} 
          onChangeText={(text) => updateField('em1Mobile', text.replace(/\D/g, '').substring(0, 10))} 
          keyboardType="number-pad" 
          maxLength={10} 
          returnKeyType="done"
          onSubmitEditing={onNextStep}
        />
      </FormSection>
    </View>
  );
}