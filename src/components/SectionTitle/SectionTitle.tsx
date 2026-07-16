import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export interface SectionTitleProps extends ViewProps {
  title: string;
  subtitle?: string;
}

export function SectionTitle({ title, subtitle, style, ...props }: SectionTitleProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  title: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text },
  subtitle: { fontSize: typography.fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
});