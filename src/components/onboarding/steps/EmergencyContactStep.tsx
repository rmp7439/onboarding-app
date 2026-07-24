import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { Input } from '../../index';
import { FormSection } from '../FormSection';
import { EmployeeFormData } from '../../../types/EmployeeForm';
import { useOnboarding } from '../../../context/OnboardingContext';

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  onNextStep?: () => void;
  errors: Partial<Record<keyof EmployeeFormData, string>>;
}

export function EmergencyContactStep({ formData, updateField, onNextStep, errors }: StepProps) {
  const { data } = useOnboarding();
  const isReq = (f: string) => data.unitConfig.requiredFields.includes(f);

  const relationRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);
  
  const nomNameRef = useRef<TextInput>(null);
  const nomRelRef = useRef<TextInput>(null);
  const nomMobileRef = useRef<TextInput>(null);
  const nomPercRef = useRef<TextInput>(null);

  return (
    <View>
      <FormSection title="Emergency Contact">
        <Input 
          label="Name" 
          value={formData.em1Name} 
          error={errors.em1Name}
          onChangeText={(text) => updateField('em1Name', text)} 
          returnKeyType="next"
          onSubmitEditing={() => relationRef.current?.focus()}
          submitBehavior="submit"
          required
        />
        <Input 
          ref={relationRef}
          label="Relation" 
          value={formData.em1Relation} 
          error={errors.em1Relation}
          onChangeText={(text) => updateField('em1Relation', text)} 
          returnKeyType="next"
          onSubmitEditing={() => mobileRef.current?.focus()}
          submitBehavior="submit"
          required
        />
        <Input 
          ref={mobileRef}
          label="Mobile Number" 
          value={formData.em1Mobile} 
          error={errors.em1Mobile}
          onChangeText={(text) => updateField('em1Mobile', text.replace(/\D/g, '').substring(0, 10))} 
          keyboardType="number-pad" 
          maxLength={10} 
          returnKeyType="next" 
          onSubmitEditing={() => nomNameRef.current?.focus()}
          required
        />
      </FormSection>

      <FormSection title="Nominee Details">
        <Input 
          ref={nomNameRef}
          label="Nominee Name" 
          value={formData.nomineeName} 
          error={errors.nomineeName}
          onChangeText={(text) => updateField('nomineeName', text)} 
          returnKeyType="next"
          onSubmitEditing={() => nomRelRef.current?.focus()}
          submitBehavior="submit"
          required={isReq('nomineeName')}
        />
        <Input 
          ref={nomRelRef}
          label="Relationship" 
          value={formData.nomineeRelation} 
          error={errors.nomineeRelation}
          onChangeText={(text) => updateField('nomineeRelation', text)} 
          returnKeyType="next"
          onSubmitEditing={() => nomMobileRef.current?.focus()}
          submitBehavior="submit"
          required={isReq('nomineeRelation')}
        />
        <Input 
          ref={nomMobileRef}
          label="Mobile Number" 
          value={formData.nomineeMobile} 
          error={errors.nomineeMobile}
          onChangeText={(text) => updateField('nomineeMobile', text.replace(/\D/g, '').substring(0, 10))} 
          keyboardType="number-pad" 
          maxLength={10} 
          returnKeyType="next"
          onSubmitEditing={() => nomPercRef.current?.focus()}
          required={isReq('nomineeMobile')}
        />
        <Input 
          ref={nomPercRef}
          label="Nominee Percentage (%)" 
          value={formData.nomineePercentage} 
          error={errors.nomineePercentage}
          onChangeText={(text) => updateField('nomineePercentage', text.replace(/\D/g, '').substring(0, 3))} 
          keyboardType="number-pad" 
          maxLength={3} 
          returnKeyType="done"
          onSubmitEditing={onNextStep}
          required={isReq('nomineePercentage')}
        />
      </FormSection>
    </View>
  );
}