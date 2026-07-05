import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  ViewStyle, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  safeAreaEdges?: Edge[];
}

export function Screen({
  children,
  scrollable = true,
  style,
  safeAreaEdges = ['top', 'bottom', 'left', 'right'],
}: ScreenProps) {
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.nonScrollContent, style]}>{children}</View>
  );

  return (
    <SafeAreaView edges={safeAreaEdges} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  nonScrollContent: {
    flex: 1,
    padding: spacing.md,
  },
});