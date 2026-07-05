import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Input, Button, SectionTitle } from '../../../src/components';
import { spacing } from '../../../src/theme';

export default function NewGuardIndexScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    mobileNumber: '',
    alternateMobile: '',
    email: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    router.push('/(onboarding)/new-guard/aadhaar-upload');
  };

  // Basic required fields check to enable the Next button
  const isNextDisabled = !formData.fullName.trim() || !formData.mobileNumber.trim();

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle 
          title="Employee Details" 
          subtitle="Enter personal information to start registration."
          style={styles.header}
        />

        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
          required
        />

        <Input
          label="Father's Name"
          placeholder="Enter father's name"
          value={formData.fatherName}
          onChangeText={(text) => handleChange('fatherName', text)}
        />

        <Input
          label="Mobile Number"
          placeholder="Enter 10-digit mobile number"
          keyboardType="numeric"
          maxLength={10}
          value={formData.mobileNumber}
          onChangeText={(text) => handleChange('mobileNumber', text)}
          required
        />

        <Input
          label="Alternate Mobile Number"
          placeholder="Enter alternate mobile number"
          keyboardType="numeric"
          maxLength={10}
          value={formData.alternateMobile}
          onChangeText={(text) => handleChange('alternateMobile', text)}
        />

        <Input
          label="Email Address"
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Gender"
              placeholder="e.g., Male, Female"
              value={formData.gender}
              onChangeText={(text) => handleChange('gender', text)}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Date of Birth"
              placeholder="DD/MM/YYYY"
              value={formData.dob}
              onChangeText={(text) => handleChange('dob', text)}
            />
          </View>
        </View>

        <Input
          label="Blood Group"
          placeholder="e.g., O+, A-"
          value={formData.bloodGroup}
          onChangeText={(text) => handleChange('bloodGroup', text)}
        />

        <Input
          label="Address"
          placeholder="Enter complete address"
          multiline
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="City"
              placeholder="Enter city"
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="State"
              placeholder="Enter state"
              value={formData.state}
              onChangeText={(text) => handleChange('state', text)}
            />
          </View>
        </View>

        <Input
          label="PIN Code"
          placeholder="Enter 6-digit PIN code"
          keyboardType="numeric"
          maxLength={6}
          value={formData.pinCode}
          onChangeText={(text) => handleChange('pinCode', text)}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={isNextDisabled}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
  },
  button: {
    width: '100%',
  },
});