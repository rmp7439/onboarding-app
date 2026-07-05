import { View, Text, StyleSheet } from 'react-native';

export default function AadhaarUploadScreen() {
  return (
    <View style={styles.container}>
      <Text>{'<Upload Aadhaar Screen />'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});