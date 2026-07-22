import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Screen, Card, SectionTitle, Button } from "../../src/components";
import { colors, spacing, typography, radius } from "../../src/theme";
import { lightImpact } from "../../src/utils/haptics";

export default function LoginScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState("");

  const trimmedUserId = userId.trim();
  const isCorrect = trimmedUserId.length > 0;

  const handleContinue = () => {
    if (isCorrect) {
      lightImpact();
      // Pass userId to the next screen instead of mobile
      router.push({ pathname: "/otp", params: { userId: trimmedUserId } });
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <SectionTitle title="Sign In" style={styles.header} />
        <Card style={styles.card}>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            placeholder="User ID"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={colors.textSecondary}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </Card>
      </View>
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isCorrect}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  header: { marginVertical: spacing.xl },
  card: { padding: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  footer: { paddingVertical: spacing.md, marginTop: spacing.md },
  button: { width: "100%" },
});