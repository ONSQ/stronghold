// Workout Management Screen - View and manage workouts

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { storageService } from '@/services/storage/asyncStorage';
import { Workout } from '@/types/workout';
import { format } from 'date-fns';

export default function WorkoutScreen() {
  const router = useRouter();
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const [today, recent] = await Promise.all([
        storageService.getTodayWorkout(),
        storageService.getRecentWorkouts(5),
      ]);
      setTodayWorkout(today);
      setRecentWorkouts(recent.filter(w => w.id !== today?.id)); // Exclude today's workout
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateWorkout = () => {
    Alert.alert(
      'Regenerate Workout',
      'This will create a new workout for today. Your current workout progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: () => {
            router.push('/check-in');
          }
        }
      ]
    );
  };

  const handleViewWorkout = (workout: Workout) => {
    // Always go to detail view first (allows swapping exercises)
    router.push({
      pathname: '/workout/[id]',
      params: { id: workout.id },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>Manage and track your training</Text>
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>

          {todayWorkout ? (
            <TouchableOpacity onPress={() => handleViewWorkout(todayWorkout)}>
              <Card style={[styles.todayCard, todayWorkout.completed && styles.todayCardCompleted]}>
                <View style={styles.todayHeader}>
                  <Text style={styles.todayType}>
                    {todayWorkout.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  {todayWorkout.completed ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>✓ Completed</Text>
                    </View>
                  ) : (
                    <View style={styles.inProgressBadge}>
                      <Text style={styles.inProgressBadgeText}>In Progress</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.todayReasoning} numberOfLines={2}>
                  💭 {todayWorkout.reasoning}
                </Text>

                <View style={styles.todayStats}>
                  <Text style={styles.todayStat}>
                    {todayWorkout.exercises.length} exercises
                  </Text>
                  <Text style={styles.todayStat}>•</Text>
                  <Text style={styles.todayStat}>
                    ~{todayWorkout.estimatedDuration} min
                  </Text>
                </View>

                <Button
                  title={todayWorkout.completed ? 'View Workout' : 'View & Start Workout'}
                  onPress={() => handleViewWorkout(todayWorkout)}
                  fullWidth
                  size="large"
                  style={styles.startButton}
                />
              </Card>
            </TouchableOpacity>
          ) : (
            <Card style={styles.emptyTodayCard}>
              <Text style={styles.emptyTodayIcon}>🏋️</Text>
              <Text style={styles.emptyTodayText}>No workout for today</Text>
              <Text style={styles.emptyTodaySubtext}>
                Start with a check-in to generate your personalized workout
              </Text>
              <Button
                title="Do Check-In"
                onPress={() => router.push('/check-in')}
                fullWidth
                style={styles.checkInButton}
              />
            </Card>
          )}

          {/* Regenerate Button */}
          {todayWorkout && !todayWorkout.completed && (
            <Button
              title="🔄 Regenerate Today's Workout"
              onPress={handleRegenerateWorkout}
              variant="secondary"
              fullWidth
              style={styles.regenerateButton}
            />
          )}
        </View>

        {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                <Text style={styles.viewAll}>View All →</Text>
              </TouchableOpacity>
            </View>

            {recentWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                onPress={() => handleViewWorkout(workout)}
              >
                <Card style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutDate}>
                      {format(new Date(workout.date), 'MMM d')}
                    </Text>
                    {workout.completed && (
                      <Text style={styles.workoutCompletedIcon}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.workoutType}>
                    {workout.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.workoutStats}>
                    {workout.exercises.length} exercises • {workout.estimatedDuration} min
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <Button
            title="📅 View Full History"
            onPress={() => router.push('/(tabs)/history')}
            variant="outline"
            fullWidth
            style={styles.quickActionButton}
          />
          <Button
            title="🎯 New Check-In"
            onPress={() => router.push('/check-in')}
            variant="outline"
            fullWidth
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  viewAll: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.primary,
  },
  todayCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  todayCardCompleted: {
    borderLeftColor: colors.success,
    backgroundColor: colors.success + '05',
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  todayType: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
  },
  completedBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  completedBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold as any,
    color: colors.success,
  },
  inProgressBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  inProgressBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold as any,
    color: colors.warning,
  },
  todayReasoning: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  todayStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  todayStat: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  startButton: {
    marginTop: spacing.sm,
  },
  emptyTodayCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTodayIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTodayText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyTodaySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  checkInButton: {
    marginTop: spacing.sm,
  },
  regenerateButton: {
    marginTop: spacing.md,
  },
  workoutCard: {
    marginBottom: spacing.sm,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  workoutDate: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.textSecondary,
  },
  workoutCompletedIcon: {
    fontSize: fontSize.lg,
    color: colors.success,
  },
  workoutType: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workoutStats: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  quickActions: {
    backgroundColor: colors.backgroundElevated,
  },
  quickActionsTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  quickActionButton: {
    marginBottom: spacing.sm,
  },
});
