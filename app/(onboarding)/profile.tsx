import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  RefreshControl, 
  AppState 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Screen, Card, SectionTitle, Button } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { api } from '../../src/api/apiClient';

interface EmployeeProfile {
  id: string;
  firstName: string;
  surname: string;
  employeeCode: string | null;
  status: string;
  mobile: string;
  joiningDate: string;
  gender: string;
  bloodGroup: string;
  selfieUrl: string | null;
}

export default function ProfileScreen() {
  const router = useRouter();
  
  // State
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Concurrency and UI Locks
  const fetchInProgress = useRef(false);
  const hasProfileLoaded = useRef(false);

  const fetchProfile = useCallback(async (isPullToRefresh = false) => {
    // Prevent duplicate concurrent requests
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;

    try {
      // Only show full-screen spinner if we have NO data and aren't pull-refreshing
      if (!hasProfileLoaded.current && !isPullToRefresh) {
        setIsLoading(true);
      }
      if (isPullToRefresh) setIsRefreshing(true);
      setError(null);
      
      const storedId = await AsyncStorage.getItem('employeeId');
      if (!storedId) {
        throw new Error("Employee session not found.");
      }

      const data = await api.getEmployeeProfile(storedId);
      setProfile(data);
      hasProfileLoaded.current = true;
    } catch (err: any) {
      setError(err.message || "Failed to load profile.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      fetchInProgress.current = false;
    }
  }, []);

  // 1. Fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  // 2. Fetch when app returns from background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchProfile();
      }
    });
    return () => subscription.remove();
  }, [fetchProfile]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('employeeId');
    router.replace('/(auth)/login');
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return { bg: '#DCFCE7', text: colors.success };
      case 'REJECTED':
        return { bg: '#FEE2E2', text: colors.error };
      case 'PENDING':
      default:
        return { bg: '#FEF3C7', text: colors.warning };
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={() => fetchProfile()} style={styles.retryButton} />
        <Button title="Logout" variant="outline" onPress={handleLogout} style={styles.retryButton} />
      </View>
    );
  }

  const badgeStyle = getStatusBadgeStyle(profile.status);

  return (
    <Screen 
      style={styles.container}
      // 3. Add Pull-to-Refresh
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={() => fetchProfile(true)} 
          tintColor={colors.primary} 
          colors={[colors.primary]} 
        />
      }
    >
      <SectionTitle title="My Profile" style={styles.header} />

      <Card style={styles.identityCard}>
        <View style={styles.photoContainer}>
          {profile.selfieUrl ? (
            <Image 
              source={{ uri: profile.selfieUrl }} 
              style={styles.photo} 
              resizeMode="cover" 
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {profile.firstName.charAt(0)}{profile.surname.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.nameText}>
          {profile.firstName} {profile.surname}
        </Text>
        
        <Text style={styles.codeText}>
          {profile.employeeCode || "Pending Assignment"}
        </Text>

        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
            {profile.status}
          </Text>
        </View>
      </Card>

      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mobile Number</Text>
          <Text style={styles.detailValue}>+91 {profile.mobile}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Joining Date</Text>
          <Text style={styles.detailValue}>{formatDate(profile.joiningDate)}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailValue}>{profile.gender}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Blood Group</Text>
          <Text style={styles.detailValue}>{profile.bloodGroup}</Text>
        </View>
      </Card>
      
      <View style={styles.footer}>
        <Button title="Log Out" variant="outline" onPress={handleLogout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: spacing.md, marginBottom: spacing.lg },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
  },
  errorIcon: { fontSize: 48, marginBottom: spacing.md },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  retryButton: { width: '100%', marginBottom: spacing.md },
  
  identityCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: radius.full,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  nameText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  codeText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  detailsCard: { padding: spacing.lg, marginBottom: spacing.xl },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.3,
  },
  footer: { paddingBottom: spacing.xl },
});