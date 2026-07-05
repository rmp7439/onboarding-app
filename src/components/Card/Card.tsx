import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, spacing, radius, shadows } from '../../theme';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
});