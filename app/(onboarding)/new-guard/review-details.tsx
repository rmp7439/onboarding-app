import { View, Text, StyleSheet } from 'react-native';

export default function ReviewDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text>{'<Review Extracted Information Screen />'}</Text>
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