import React, { useRef } from "react";
import { View, TextInput } from "react-native";
import { Input, SegmentedInput } from "../../index";
import { FormSection } from "../FormSection";
import { EmployeeFormData, NomineeForm } from "../../../types/EmployeeForm";
import { isValidNameInput } from "../../../utils/inputFilters";

interface StepProps {
  formData: EmployeeFormData;
  updateField: (field: keyof EmployeeFormData, value: string) => void;
  updateNominee: (index: number, field: keyof NomineeForm, value: string) => void;
  errors: Partial<Record<keyof EmployeeFormData | string, string>>;
}

export function BankNomineeStep({ formData, updateField, updateNominee, errors }: StepProps) {
  const bankNameRef = useRef<TextInput>(null);
  const accNumRef = useRef<any>(null);
  const ifscRef = useRef<any>(null);
  const micrRef = useRef<any>(null);

  return (
    <View>
      <FormSection title="Bank Details">
        <Input
          label="Account Holder Name"
          value={formData.accountHolderName}
          error={errors.accountHolderName}
          onChangeText={(text) => { if (isValidNameInput(text)) updateField("accountHolderName", text); }}
          returnKeyType="next"
          onSubmitEditing={() => bankNameRef.current?.focus()}
          submitBehavior="submit"
        />

        <Input
          ref={bankNameRef}
          label="Bank Name"
          value={formData.bankName}
          error={errors.bankName}
          onChangeText={(text) => updateField("bankName", text)}
          returnKeyType="next"
          onSubmitEditing={() => accNumRef.current?.focus()}
          submitBehavior="submit"
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
        />
      </FormSection>

      <FormSection title="Nominee Allocation">
        <Input
          label="Number of Nominees"
          value={formData.numberOfNominees}
          error={errors.numberOfNominees}
          onChangeText={(text) => {
            const val = text.replace(/[^0-9]/g, '').replace(/^0+/, '');
            updateField("numberOfNominees", val);
          }}
          keyboardType="number-pad"
          maxLength={2}
        />
      </FormSection>

      {formData.nominees.map((nominee, index) => (
        <FormSection key={index} title={`Nominee ${index + 1}`}>
          <Input
            label="Nominee Name"
            value={nominee.name}
            error={(errors as any)[`nominee_${index}_name`]}
            onChangeText={(text) => updateNominee(index, 'name', text)}
          />
          <Input
            label="Relationship"
            value={nominee.relation}
            error={(errors as any)[`nominee_${index}_relation`]}
            onChangeText={(text) => updateNominee(index, 'relation', text)}
          />
          <Input
            label="Mobile Number"
            value={nominee.mobile}
            error={(errors as any)[`nominee_${index}_mobile`]}
            onChangeText={(text) => updateNominee(index, 'mobile', text.replace(/\D/g, '').substring(0, 10))}
            keyboardType="number-pad"
            maxLength={10}
          />
          {formData.nominees.length >= 2 && (
            <Input
              label="Percentage Allocation (%)"
              value={nominee.percentage}
              error={(errors as any)[`nominee_${index}_percentage`]}
              onChangeText={(text) => updateNominee(index, 'percentage', text.replace(/[^0-9]/g, '').replace(/^0+/, '').substring(0, 3))}
              keyboardType="number-pad"
              maxLength={3}
            />
          )}
        </FormSection>
      ))}
    </View>
  );
}