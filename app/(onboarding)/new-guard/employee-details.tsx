import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, SectionTitle, Input, Button } from '../../../src/components';
import { FormSection } from '../../../src/components/onboarding/FormSection';
import { GenderSelector } from '../../../src/components/onboarding/GenderSelector';
import { BloodGroupSelector } from '../../../src/components/onboarding/BloodGroupSelector';
import { useOnboarding } from '../../../src/context/OnboardingContext';
import { useEmployeeForm } from '../../../src/hooks/useEmployeeForm';
import { colors, spacing } from '../../../src/theme';
import { isValidNameInput, allowOnlyNumbers } from '../../../src/utils/inputFilters';
import { formatDate, formatAadhaar, formatMobile } from '../../../src/utils/formatters';

export default function EmployeeDetailsScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const { formData, updateField } = useEmployeeForm();

  const handleContinue = () => {
    updateData({
      employment: { joiningDate: formData.dateOfJoining, unit: formData.unitSite },
      personal: {
        firstName: formData.firstName,
        surname: formData.surname,
        fatherName: formData.fatherName,
        husbandName: formData.husbandName,
        gender: formData.gender,
        dob: formData.dateOfBirth,
        mobile: formData.mobileNumber,
        bloodGroup: formData.bloodGroup,
      },
      identity: {
        aadhaar: formData.aadhaarNumber,
        pan: formData.panNumber,
        uan: formData.uanNumber,
        esic: formData.esicNumber,
        pf: formData.pfNumber,
      },
      address: {
        permanent: formData.permanentAddress,
        current: formData.currentAddress,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
      },
      bank: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifscCode,
        branch: formData.branch,
        micr: formData.micrCode,
      },
      emergencyContacts: [
        { name: formData.em1Name, relation: formData.em1Relation, mobile: formData.em1Mobile },
        { name: formData.em2Name, relation: formData.em2Relation, mobile: formData.em2Mobile }
      ]
    });

    router.push('/(onboarding)/new-guard/capture-photo');
  };

  return (
    <Screen scrollable={false} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionTitle
          title="Employee Details"
          subtitle="Manually enter the employee's registration details"
          style={styles.mainHeader}
        />

        <FormSection title="Employment Details">
          <Input 
            label="Date of Joining" 
            value={formData.dateOfJoining} 
            onChangeText={(text) => updateField('dateOfJoining', formatDate(text))} 
            placeholder="DD/MM/YYYY" 
            keyboardType="number-pad" 
            maxLength={10} 
          />
          <Input 
            label="Unit / Site" 
            value={formData.unitSite} 
            onChangeText={(text) => updateField('unitSite', text)} 
            placeholder="Enter unit or site" 
          />
        </FormSection>

        <FormSection title="Personal Details">
          <Input 
            label="First Name" 
            value={formData.firstName} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('firstName', text);
            }} 
          />
          <Input 
            label="Surname" 
            value={formData.surname} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('surname', text);
            }} 
          />
          <Input 
            label="Father's Name" 
            value={formData.fatherName} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('fatherName', text);
            }} 
          />
          
          <GenderSelector value={formData.gender} onChange={(val) => updateField('gender', val)} />
          
          <Input 
            label="Husband's Name (Optional)" 
            value={formData.husbandName} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('husbandName', text);
            }} 
            // Only enabled when explicitly set to Female
            editable={formData.gender === 'Female'} 
          />
          
          <Input 
            label="Date of Birth" 
            value={formData.dateOfBirth} 
            onChangeText={(text) => updateField('dateOfBirth', formatDate(text))} 
            placeholder="DD/MM/YYYY" 
            keyboardType="number-pad" 
            maxLength={10} 
          />
          <Input 
            label="Mobile Number" 
            value={formData.mobileNumber} 
            onChangeText={(text) => updateField('mobileNumber', formatMobile(text))} 
            keyboardType="number-pad" 
            maxLength={10} 
          />
          
          <BloodGroupSelector value={formData.bloodGroup} onChange={(val) => updateField('bloodGroup', val)} />
        </FormSection>

        <FormSection title="Identity Details">
          <Input label="Aadhaar Number" value={formData.aadhaarNumber} onChangeText={(text) => updateField('aadhaarNumber', formatAadhaar(text))} keyboardType="numeric" maxLength={12} />
          <Input label="PAN Number" value={formData.panNumber} onChangeText={(text) => updateField('panNumber', text)} autoCapitalize="characters" maxLength={10} />
          <Input label="UAN Number" value={formData.uanNumber} onChangeText={(text) => updateField('uanNumber', allowOnlyNumbers(text))} keyboardType="numeric" maxLength={12} />
          <Input label="ESIC Number" value={formData.esicNumber} onChangeText={(text) => updateField('esicNumber', allowOnlyNumbers(text))} keyboardType="numeric" maxLength={17} />
          <Input label="PF Number" value={formData.pfNumber} onChangeText={(text) => updateField('pfNumber', text)} autoCapitalize="characters" />
        </FormSection>

        <FormSection title="Address">
          <Input label="Permanent Address" value={formData.permanentAddress} onChangeText={(text) => updateField('permanentAddress', text)} multiline />
          <Input label="Current Address" value={formData.currentAddress} onChangeText={(text) => updateField('currentAddress', text)} multiline />
          <Input label="City" value={formData.city} onChangeText={(text) => { if(isValidNameInput(text)) updateField('city', text); }} />
          <Input label="State" value={formData.state} onChangeText={(text) => { if(isValidNameInput(text)) updateField('state', text); }} />
          <Input label="PIN Code" value={formData.pinCode} onChangeText={(text) => updateField('pinCode', allowOnlyNumbers(text))} keyboardType="numeric" maxLength={6} />
        </FormSection>

        <FormSection title="Bank Details">
          <Input label="Bank Name" value={formData.bankName} onChangeText={(text) => { if(isValidNameInput(text)) updateField('bankName', text); }} />
          <Input label="Account Number" value={formData.accountNumber} onChangeText={(text) => updateField('accountNumber', allowOnlyNumbers(text))} keyboardType="numeric" />
          <Input label="IFSC Code" value={formData.ifscCode} onChangeText={(text) => updateField('ifscCode', text)} autoCapitalize="characters" maxLength={11} />
          <Input label="Branch" value={formData.branch} onChangeText={(text) => updateField('branch', text)} />
          <Input label="MICR Code" value={formData.micrCode} onChangeText={(text) => updateField('micrCode', allowOnlyNumbers(text))} keyboardType="numeric" maxLength={9} />
        </FormSection>

        <FormSection title="Emergency Contact 1">
          <Input 
            label="Name" 
            value={formData.em1Name} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('em1Name', text);
            }} 
          />
          <Input 
            label="Relation" 
            value={formData.em1Relation} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('em1Relation', text);
            }} 
          />
          <Input 
            label="Mobile Number" 
            value={formData.em1Mobile} 
            onChangeText={(text) => updateField('em1Mobile', formatMobile(text))} 
            keyboardType="number-pad" 
            maxLength={10} 
          />
        </FormSection>

        <FormSection title="Emergency Contact 2">
          <Input 
            label="Name" 
            value={formData.em2Name} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('em2Name', text);
            }} 
          />
          <Input 
            label="Relation" 
            value={formData.em2Relation} 
            onChangeText={(text) => {
              if (isValidNameInput(text)) updateField('em2Relation', text);
            }} 
          />
          <Input 
            label="Mobile Number" 
            value={formData.em2Mobile} 
            onChangeText={(text) => updateField('em2Mobile', formatMobile(text))} 
            keyboardType="number-pad" 
            maxLength={10} 
          />
        </FormSection>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} style={styles.fullButton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: spacing.md, paddingBottom: spacing['2xl'] },
  mainHeader: { marginBottom: spacing.lg },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fullButton: { width: '100%' },
});