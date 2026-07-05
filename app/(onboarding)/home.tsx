import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';

export default function HomeScreen() {
  const router = useRouter();

  const handleStartRegistration = () => {
    router.push('/(onboarding)/new-guard');
  };

  const recentActivity = [
    { id: '1', name: 'Ramesh Kumar', status: 'Pending Review', time: '10:30 AM' },
    { id: '2', name: 'Suresh Singh', status: 'Completed', time: '09:15 AM' },
    { id: '3', name: 'Amit Sharma', status: 'Aadhaar Missing', time: 'Yesterday' },
  ];

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>Good Morning,</Text>
        <Text style={styles.roleText}>Site Incharge</Text>
      </View>

      {/* Primary Card */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleStartRegistration}>
        <Card style={styles.primaryCard}>
          <Text style={styles.primaryCardText}>+ Register New Employee</Text>
        </Card>
      </TouchableOpacity>

      {/* Quick Stats */}
      <SectionTitle title="Quick Stats" style={styles.sectionHeader} />
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Today's</Text>
          <Text style={styles.statLabel}>Registrations</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statLabel}>Today</Text>
        </Card>
      </View>

      {/* Recent Activity */}
      <SectionTitle title="Recent Activity" style={styles.sectionHeader} />
      <View style={styles.activityContainer}>
        {recentActivity.map((item) => (
          <Card key={item.id} style={styles.activityCard}>
            <View>
              <Text style={styles.activityName}>{item.name}</Text>
              <Text style={styles.activityStatus}>{item.status}</Text>
            </View>
            <Text style={styles.activityTime}>{item.time}</Text>
          </Card>
        ))}
      </View>

      {/* Primary CTA */}
      <View style={styles.footer}>
        <Button 
          title="Start New Registration" 
          onPress={handleStartRegistration} 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  greetingText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  roleText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  primaryCard: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  primaryCardText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activityContainer: {
    marginBottom: spacing['2xl'],
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  activityName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activityStatus: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  activityTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: spacing.md,
  },
});