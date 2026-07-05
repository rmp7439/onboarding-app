import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, SectionTitle } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';

const RECENT_EMPLOYEES = [
  { id: '1', name: 'Vikram Sharma', status: 'Pending', time: '10:30 AM' },
  { id: '2', name: 'Suresh Singh', status: 'Completed', time: '09:15 AM' },
  { id: '3', name: 'Amit Kumar', status: 'Rejected', time: 'Yesterday' },
  { id: '4', name: 'Rahul Verma', status: 'Completed', time: 'Yesterday' },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleStartRegistration = () => {
    router.push('/(onboarding)/new-guard/aadhaar-upload');
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return { backgroundColor: '#E8F8EE', color: colors.success }; // Light green
      case 'Pending':
        return { backgroundColor: '#FFF3E0', color: colors.warning }; // Light orange
      case 'Rejected':
        return { backgroundColor: '#FFEBEE', color: colors.error };   // Light red
      default:
        return { backgroundColor: colors.background, color: colors.textSecondary };
    }
  };

  return (
    <Screen style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>Welcome back,</Text>
        <Text style={styles.roleText}>Site Incharge</Text>
      </View>

      {/* Quick Action */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleStartRegistration}>
        <Card style={styles.actionCard}>
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>+</Text>
          </View>
          <View>
            <Text style={styles.actionTitle}>Register New Employee</Text>
            <Text style={styles.actionSubtitle}>Start the onboarding process</Text>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Statistics */}
      <SectionTitle title="Overview" style={styles.sectionHeader} />
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]}>12</Text>
            <Text style={styles.statLabel}>Today's</Text>
            <Text style={styles.statLabel}>Registrations</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warning }]}>3</Text>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statLabel}>Verification</Text>
          </Card>
        </View>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statLabel}>Today</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.error }]}>1</Text>
            <Text style={styles.statLabel}>Rejected</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </Card>
        </View>
      </View>

      {/* Recent Employees */}
      <SectionTitle title="Recent Employees" style={styles.sectionHeader} />
      <View style={styles.activityContainer}>
        {RECENT_EMPLOYEES.map((employee) => {
          const badgeTheme = getBadgeStyle(employee.status);
          return (
            <Card key={employee.id} style={styles.employeeCard}>
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{employee.name}</Text>
                <View style={[styles.badge, { backgroundColor: badgeTheme.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: badgeTheme.color }]}>
                    {employee.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.employeeTime}>{employee.time}</Text>
            </Card>
          );
        })}
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
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  actionCard: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
    borderRadius: radius.lg,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionIcon: {
    color: colors.white,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  actionTitle: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSize.sm,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  statsContainer: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  activityContainer: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  employeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  employeeTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});