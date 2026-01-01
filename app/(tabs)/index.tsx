// Home Dashboard Screen

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { storageService } from '@/services/storage/asyncStorage';

export default function HomeScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [todayCheckIn, setTodayCheckIn] = useState(false);
  const [todayWorkout, setTodayWorkout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all dashboard data from storage
      const [checkIn, workout, currentStreak, weekly, monthly] = await Promise.all([
        storageService.getTodayCheckIn(),
        storageService.getTodayWorkout(),
        storageService.getUserStreak(),
        storageService.getWeeklyWorkoutCount(),
        storageService.getMonthlyWorkoutCount(),
      ]);

      setTodayCheckIn(checkIn !== null);
      setTodayWorkout(workout !== null && workout.completed);
      setStreak(currentStreak);
      setWeeklyCount(weekly);
      setMonthlyCount(monthly);

      console.log('Dashboard data loaded:', {
        hasCheckIn: checkIn !== null,
        hasWorkout: workout !== null,
        streak: currentStreak,
        weekly,
        monthly,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default values on error
      setTodayCheckIn(false);
      setTodayWorkout(false);
      setStreak(0);
      setWeeklyCount(0);
      setMonthlyCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            <Text style={styles.greetingIcon}>⚡</Text> STRONGHOLD
          </Text>
          <Text style={styles.subtitle}>
            <Text style={styles.aiLabel}>AI </Text>
            <Text>Workout Coach</Text>
          </Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>DAY STREAK</Text>
        </View>
      </View>

      {/* Today's Status */}
      <Card style={styles.statusCard} elevated>
        <Text style={styles.cardTitle}>Today's Status</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusEmoji}>{todayCheckIn ? '✅' : '⏳'}</Text>
            <Text style={styles.statusText}>Check-In</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusEmoji}>{todayWorkout ? '✅' : '⏳'}</Text>
            <Text style={styles.statusText}>Workout</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusEmoji}>💪</Text>
            <Text style={styles.statusText}>
              {todayCheckIn && todayWorkout ? 'Complete!' : 'In Progress'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Main Action */}
      {!todayCheckIn ? (
        <Card style={styles.actionCard}>
          <Text style={styles.actionTitle}>🌅 Start Your Day</Text>
          <Text style={styles.actionDescription}>
            Begin with your morning check-in. I'll analyze how you're feeling and create the perfect workout for today.
          </Text>
          <Button
            title="Start Check-In"
            onPress={() => router.push('/check-in')}
            size="large"
            fullWidth
          />
        </Card>
      ) : !todayWorkout ? (
        <Card style={styles.actionCard}>
          <Text style={styles.actionTitle}>🏋️ Ready to Work Out?</Text>
          <Text style={styles.actionDescription}>
            Your personalized workout is ready based on this morning's check-in.
          </Text>
          <Button
            title="View Today's Workout"
            onPress={() => router.push('/workout')}
            size="large"
            fullWidth
          />
        </Card>
      ) : (
        <Card style={styles.actionCard}>
          <Text style={styles.actionTitle}>🎉 Workout Complete!</Text>
          <Text style={styles.actionDescription}>
            Great job today! You're building real consistency. See you tomorrow!
          </Text>
          <Text style={styles.streakCelebration}>
            {streak + 1} day streak! Keep it going! 🔥
          </Text>
        </Card>
      )}

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{loading ? '...' : streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{loading ? '...' : weeklyCount}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{loading ? '...' : streak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{loading ? '...' : monthlyCount}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </Card>
      </View>

      {/* Tips */}
      <Card style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💡</Text>
        <Text style={styles.tipTitle}>Coach's Tip</Text>
        <Text style={styles.tipText}>
          Consistency beats intensity. Show up every day, even if it's just 10 minutes of rowing. Movement is medicine.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerWrapper: {
    marginRight: -spacing.sm,
    paddingRight: spacing.lg,
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxxxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.text,
    letterSpacing: -1,
  },
  greetingIcon: {
    color: colors.primary,
  },
  aiLabel: {
    color: colors.accent,
    fontWeight: fontWeight.bold as any,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 0.5,
  },
  streakBadge: {
    backgroundColor: colors.backgroundCardHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderAccent,
    minWidth: 60,
  },
  streakNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  streakLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontWeight: fontWeight.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statusCard: {
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: fontSize.xxxl,
    marginBottom: spacing.sm,
  },
  statusText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium as any,
  },
  actionCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundCardHighlight,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  actionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  actionDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  streakCelebration: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundCardHighlight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontWeight: fontWeight.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipCard: {
    alignItems: 'center',
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  tipEmoji: {
    fontSize: 42,
    marginBottom: spacing.sm,
  },
  tipTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  tipText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
