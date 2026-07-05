import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Input, Button, SectionTitle } from '../../../src/components';
import { spacing } from '../../../src/theme';

export default function ReviewDetailsScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: 'Rahul Kumar',
    dob: '12/03/1998',
    gender: 'Male',
    aadhaarNumber: '[Aadhaar Redacted]', // Redacted per strict privacy guidelines
    address: 'Sample Address',
    city: 'Bangalore',
    state: 'Karnataka',
    pin: '560001',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLooksGood = () => {
    router.push('/(onboarding)/new-guard/capture-photo');
  };

  const handleEditLater = () => {
    router.back();
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle
          title="Review Extracted Information"
          subtitle="Verify the details before continuing."
          style={styles.header}
        />

        <Input
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Date of Birth"
              value={formData.dob}
              onChangeText={(text) => handleChange('dob', text)}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Gender"
              value={formData.gender}
              onChangeText={(text) => handleChange('gender', text)}
            />
          </View>
        </View>

        <Input
          label="Aadhaar Number"
          value={formData.aadhaarNumber}
          onChangeText={(text) => handleChange('aadhaarNumber', text)}
        />

        <Input
          label="Address"
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
          multiline
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="City"
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="State"
              value={formData.state}
              onChangeText={(text) => handleChange('state', text)}
            />
          </View>
        </View>

        <Input
          label="PIN Code"
          keyboardType="numeric"
          maxLength={6}
          value={formData.pin}
          onChangeText={(text) => handleChange('pin', text)}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Button
            title="Edit Later"
            variant="outline"
            onPress={handleEditLater}
            style={styles.button}
          />
          <Button
            title="Looks Good"
            onPress={handleLooksGood}
            style={styles.button}
          />
        </View>
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
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});