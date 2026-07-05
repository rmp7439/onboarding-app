import { View, Text, StyleSheet } from 'react-native';

export default function CapturePhotoScreen() {
  return (
    <View style={styles.container}>
      <Text>{'<Capture Live Photo Screen />'}</Text>
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