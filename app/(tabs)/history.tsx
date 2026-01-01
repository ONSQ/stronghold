// Workout History Screen - View past workouts and progress

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import { storageService } from '@/services/storage/asyncStorage';
import { Workout } from '@/types/workout';
import { format } from 'date-fns';

export default function HistoryScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const recentWorkouts = await storageService.getRecentWorkouts(30);
      setWorkouts(recentWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'completed') return workout.completed;
    if (filter === 'incomplete') return !workout.completed;
    return true;
  });

  const completedCount = workouts.filter(w => w.completed).length;
  const totalMinutes = workouts
    .filter(w => w.completed && w.actualDuration)
    .reduce((sum, w) => sum + (w.actualDuration || 0), 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workout History</Text>
          <Text style={styles.subtitle}>Your progress over time</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{Math.floor(totalMinutes)}</Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All ({workouts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterTabText, filter === 'completed' && styles.filterTabTextActive]}>
              Completed ({completedCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'incomplete' && styles.filterTabActive]}
            onPress={() => setFilter('incomplete')}
          >
            <Text style={[styles.filterTabText, filter === 'incomplete' && styles.filterTabTextActive]}>
              Incomplete ({workouts.length - completedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Workout List */}
        {filteredWorkouts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {filter === 'all' ? 'No workouts yet. Start your first workout!' : `No ${filter} workouts`}
            </Text>
          </Card>
        ) : (
          filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} onPress={() => {
              router.push({
                pathname: '/workout/[id]',
                params: { id: workout.id },
              });
            }} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Workout Card Component
function WorkoutCard({ workout, onPress }: { workout: Workout; onPress: () => void }) {
  const workoutDate = new Date(workout.date);
  const completedExercises = workout.exercises.filter(ex =>
    ex.sets.every(set => set.completed)
  ).length;
  const totalExercises = workout.exercises.length;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.workoutCard, !workout.completed && styles.workoutCardIncomplete]}>
        <View style={styles.workoutHeader}>
          <View>
            <Text style={styles.workoutDate}>{format(workoutDate, 'MMMM d, yyyy')}</Text>
            <Text style={styles.workoutTime}>{format(workoutDate, 'h:mm a')}</Text>
          </View>
          {workout.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓ Done</Text>
            </View>
          )}
        </View>

        <Text style={styles.workoutType}>
          {workout.type.replace('_', ' ').toUpperCase()}
        </Text>

        <View style={styles.workoutStats}>
          <View style={styles.workoutStat}>
            <Text style={styles.workoutStatLabel}>Exercises</Text>
            <Text style={styles.workoutStatValue}>
              {completedExercises}/{totalExercises}
            </Text>
          </View>
          <View style={styles.workoutStat}>
            <Text style={styles.workoutStatLabel}>Duration</Text>
            <Text style={styles.workoutStatValue}>
              {workout.actualDuration || workout.estimatedDuration} min
            </Text>
          </View>
        </View>

        {workout.reasoning && (
          <Text style={styles.workoutReasoning} numberOfLines={2}>
            💭 {workout.reasoning}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
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
    marginBottom: spacing.lg,
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium as any,
  },
  filterTabTextActive: {
    color: colors.white,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  workoutCard: {
    marginBottom: spacing.md,
  },
  workoutCardIncomplete: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  workoutDate: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  workoutTime: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  workoutType: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  workoutStat: {
    flex: 1,
  },
  workoutStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  workoutStatValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  workoutReasoning: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
});
