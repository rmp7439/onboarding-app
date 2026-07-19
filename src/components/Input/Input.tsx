import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { colors, spacing, radius, typography } from "../../theme";

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  ref?: React.Ref<TextInput>;
}

export function Input({
  label,
  error,
  required,
  style,
  editable = true,
  multiline,
  ref,
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          !editable && styles.disabledInput,
          !!error && styles.errorInput,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        editable={editable}
        multiline={multiline}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  requiredAsterisk: { color: colors.error },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  multilineInput: { minHeight: 100, textAlignVertical: "top" },
  disabledInput: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  errorInput: { borderColor: colors.error },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
});