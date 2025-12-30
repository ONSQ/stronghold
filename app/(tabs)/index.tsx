// Home Dashboard Screen

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { database } from '@/database';

export default function HomeScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [todayCheckIn, setTodayCheckIn] = useState(false);
  const [todayWorkout, setTodayWorkout] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Check for today's check-in
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const checkInsCollection = database.collections.get('check_ins');
      const todayCheckIns = await checkInsCollection
        .query()
        .fetch();
      
      const hasCheckIn = todayCheckIns.some((ci: any) => {
        const checkInDate = new Date(ci.date);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === today.getTime();
      });
      
      setTodayCheckIn(hasCheckIn);

      // Check for today's workout
      const workoutsCollection = database.collections.get('workouts');
      const todayWorkouts = await workoutsCollection
        .query()
        .fetch();
      
      const hasWorkout = todayWorkouts.some((w: any) => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === today.getTime() && w.completed;
      });
      
      setTodayWorkout(hasWorkout);

      // Calculate streak
      const completedWorkouts = todayWorkouts.filter((w: any) => w.completed);
      let currentStreak = 0;
      let checkDate = new Date();
      
      while (currentStreak < 100) { // max check 100 days
        checkDate.setDate(checkDate.getDate() - 1);
        const hasWorkoutOnDate = completedWorkouts.some((w: any) => {
          const wDate = new Date(w.date);
          wDate.setHours(0, 0, 0, 0);
          return wDate.getTime() === checkDate.getTime();
        });
        
        if (hasWorkoutOnDate) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      setStreak(currentStreak);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>💪 STRONGHOLD</Text>
          <Text style={styles.subtitle}>Your AI Workout Coach</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakNumber}>🔥 {streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
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
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>-</Text>
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
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  streakBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
  },
  streakLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statusCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
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
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actionCard: {
    marginBottom: spacing.lg,
  },
  actionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  actionDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  streakCelebration: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
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
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  tipCard: {
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  tipTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
