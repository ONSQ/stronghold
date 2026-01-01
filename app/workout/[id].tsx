// Workout Detail Screen - Display generated workout

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Workout, Exercise } from '@/types/workout';
import { storageService } from '@/services/storage/asyncStorage';
import ExerciseSubstitutionModal from '@/components/ExerciseSubstitutionModal';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);

  useEffect(() => {
    loadWorkout();
  }, []);

  const loadWorkout = async () => {
    try {
      setLoading(true);

      // First try to get from params
      if (params.workout && typeof params.workout === 'string') {
        const workoutData = JSON.parse(params.workout);
        setWorkout(workoutData);
      }
      // Otherwise load from storage
      else if (params.id && typeof params.id === 'string') {
        const workoutData = await storageService.getWorkoutById(params.id);
        if (workoutData) {
          setWorkout(workoutData);
        }
      }
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = async () => {
    if (!workout) return;
    router.push({
      pathname: '/workout/active',
      params: { id: workout.id, workout: JSON.stringify(workout) },
    });
  };

  const handleBackHome = () => {
    router.replace('/(tabs)');
  };

  const handleSwapExercise = (exerciseIndex: number) => {
    setSelectedExerciseIndex(exerciseIndex);
    setShowSubstitutionModal(true);
  };

  const handleSubstituteExercise = async (newExercise: Exercise) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[selectedExerciseIndex] = newExercise;

    setWorkout(updatedWorkout);
    await storageService.updateWorkout(workout.id, updatedWorkout);

    Alert.alert('Exercise Swapped', `Replaced with: ${newExercise.name}`);
  };

  const handleRegenerateWorkout = () => {
    Alert.alert(
      'Regenerate Workout',
      'This will create a completely new workout for today. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: () => {
            router.replace('/check-in');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <Button title="Go Home" onPress={handleBackHome} />
        </View>
      </SafeAreaView>
    );
  }

  const warmupExercises = workout.exercises.filter(ex => ex.phase === 'warmup');
  const strengthExercises = workout.exercises.filter(ex => ex.phase === 'strength');
  const cooldownExercises = workout.exercises.filter(ex => ex.phase === 'cooldown');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏋️ Today's Workout</Text>
          <Text style={styles.workoutType}>{workout.type.replace('_', ' ').toUpperCase()}</Text>
          <Text style={styles.duration}>~{workout.estimatedDuration} minutes</Text>
        </View>

        {/* AI Reasoning */}
        <Card style={styles.reasoningCard}>
          <Text style={styles.cardTitle}>💭 Why This Workout?</Text>
          <Text style={styles.reasoningText}>{workout.reasoning}</Text>
        </Card>

        {/* Coaching Notes */}
        {workout.coachingNotes && (
          <Card style={styles.coachingCard}>
            <Text style={styles.cardTitle}>💪 Coach's Notes</Text>
            <Text style={styles.coachingText}>{workout.coachingNotes}</Text>
          </Card>
        )}

        {/* Help Banner */}
        <View style={styles.helpBanner}>
          <Text style={styles.helpText}>
            💡 Tap 🔄 SWAP on any exercise to choose a replacement from the exercise library
          </Text>
        </View>

        {/* Warm-up */}
        {warmupExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Warm-Up</Text>
            {warmupExercises.map((exercise, index) => {
              const globalIndex = workout.exercises.findIndex(ex => ex.id === exercise.id);
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  number={index + 1}
                  onSwap={() => handleSwapExercise(globalIndex)}
                />
              );
            })}
          </View>
        )}

        {/* Strength */}
        {strengthExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💪 Strength Training</Text>
            {strengthExercises.map((exercise, index) => {
              const globalIndex = workout.exercises.findIndex(ex => ex.id === exercise.id);
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  number={index + 1}
                  onSwap={() => handleSwapExercise(globalIndex)}
                />
              );
            })}
          </View>
        )}

        {/* Cool-down */}
        {cooldownExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧘 Cool-Down</Text>
            {cooldownExercises.map((exercise, index) => {
              const globalIndex = workout.exercises.findIndex(ex => ex.id === exercise.id);
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  number={index + 1}
                  onSwap={() => handleSwapExercise(globalIndex)}
                />
              );
            })}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="▶️ Start Workout"
            onPress={handleStartWorkout}
            size="large"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="🔄 Regenerate Entire Workout"
            onPress={handleRegenerateWorkout}
            variant="secondary"
            fullWidth
          />
          <Button
            title="← Back to Home"
            onPress={handleBackHome}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Exercise Substitution Modal */}
      <ExerciseSubstitutionModal
        visible={showSubstitutionModal}
        currentExercise={workout.exercises[selectedExerciseIndex]}
        onClose={() => setShowSubstitutionModal(false)}
        onSubstitute={handleSubstituteExercise}
      />
    </SafeAreaView>
  );
}

// Exercise Card Component
function ExerciseCard({ exercise, number, onSwap }: { exercise: Exercise; number: number; onSwap: () => void }) {
  const firstSet = exercise.sets[0];

  return (
    <Card style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseNumber}>{number}</Text>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseEquipment}>
            {exercise.equipment.replace('_', ' ')}
            {exercise.targetMuscles && exercise.targetMuscles.length > 0 && ` • ${exercise.targetMuscles.join(', ')}`}
          </Text>
        </View>
        <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
          <Text style={styles.swapIcon}>🔄</Text>
          <Text style={styles.swapLabel}>SWAP</Text>
        </TouchableOpacity>
      </View>

      {/* Sets/Reps/Duration */}
      <View style={styles.exerciseDetails}>
        {exercise.duration ? (
          <Text style={styles.detailText}>⏱️ {exercise.duration} minutes</Text>
        ) : (
          <>
            <Text style={styles.detailText}>
              📊 {exercise.sets.length} sets × {firstSet.targetReps || '?'} reps
            </Text>
            {firstSet.targetWeight && (
              <Text style={styles.detailText}>
                🏋️ {firstSet.targetWeight} lbs
              </Text>
            )}
            <Text style={styles.detailText}>
              ⏸️ {firstSet.restSeconds}s rest
            </Text>
          </>
        )}
      </View>

      {/* Instructions */}
      {exercise.instructions && (
        <Text style={styles.instructions}>{exercise.instructions}</Text>
      )}

      {/* Form Cues */}
      {exercise.formCues && exercise.formCues.length > 0 && (
        <View style={styles.formCues}>
          <Text style={styles.formCuesTitle}>Form Tips:</Text>
          {exercise.formCues.map((cue, index) => (
            <Text key={index} style={styles.formCue}>• {cue}</Text>
          ))}
        </View>
      )}

      {/* Modifications */}
      {exercise.modifications && (
        <View style={styles.modifications}>
          <Text style={styles.modificationsTitle}>💡 Modifications:</Text>
          <Text style={styles.modificationText}>{exercise.modifications}</Text>
        </View>
      )}
    </Card>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workoutType: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  duration: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  reasoningCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary + '15',
  },
  coachingCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.success + '15',
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  reasoningText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  coachingText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  helpBanner: {
    backgroundColor: colors.primary + '15',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.sm,
  },
  helpText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    marginBottom: spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exerciseNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
    backgroundColor: colors.primary + '20',
    width: 36,
    height: 36,
    borderRadius: 18,
    textAlign: 'center',
    lineHeight: 36,
    marginRight: spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exerciseEquipment: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  swapButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  swapIcon: {
    fontSize: 24,
    marginBottom: spacing.xs / 2,
  },
  swapLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
    letterSpacing: 0.5,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  instructions: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  formCues: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  formCuesTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  formCue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  modifications: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.warning + '15',
    borderRadius: borderRadius.md,
  },
  modificationsTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modificationText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 18,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
});
