// Active Workout Screen - Track sets/reps in real-time

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Workout, Exercise, ExerciseSet, PostWorkoutCheck } from '@/types/workout';
import { storageService } from '@/services/storage/asyncStorage';
import ExerciseSubstitutionModal from '@/components/ExerciseSubstitutionModal';
import PostWorkoutCheckModal from '@/components/PostWorkoutCheckModal';
import EchelonRowConnect from '@/components/EchelonRowConnect';
import { RowingData } from '@/services/echelonRowBLE';

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [showPostWorkoutModal, setShowPostWorkoutModal] = useState(false);
  const [showEchelonModal, setShowEchelonModal] = useState(false);
  const [rowingData, setRowingData] = useState<RowingData | null>(null);

  useEffect(() => {
    loadWorkout();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const loadWorkout = async () => {
    try {
      setLoading(true);
      if (params.workout && typeof params.workout === 'string') {
        const workoutData = JSON.parse(params.workout);
        setWorkout(workoutData);
      } else if (params.id && typeof params.id === 'string') {
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

  const handleCompleteSet = async (actualReps: number, actualWeight: number, difficulty: string) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[currentExerciseIndex];
    const set = exercise.sets[currentSetIndex];

    // Update set
    set.actualReps = actualReps;
    set.actualWeight = actualWeight;
    set.difficulty = difficulty as any;
    set.completed = true;
    set.completedAt = new Date();

    setWorkout(updatedWorkout);

    // Save to storage
    await storageService.updateWorkout(workout.id, updatedWorkout);

    // Check if there are more sets
    if (currentSetIndex < exercise.sets.length - 1) {
      // Start rest timer
      setRestTimer(set.restSeconds);
      setIsResting(true);
      setCurrentSetIndex(currentSetIndex + 1);
    } else {
      // Move to next exercise
      handleNextExercise();
    }
  };

  const handleSkipSet = () => {
    if (!workout) return;

    const exercise = workout.exercises[currentExerciseIndex];
    if (currentSetIndex < exercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else {
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    if (!workout) return;

    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setIsResting(false);
      setRestTimer(0);
    } else {
      handleCompleteWorkout();
    }
  };

  const handleCompleteWorkout = async () => {
    if (!workout) return;

    // Show post-workout check modal
    setShowPostWorkoutModal(true);
  };

  const handlePostWorkoutSubmit = async (postWorkoutCheck: PostWorkoutCheck) => {
    if (!workout) return;

    // Update workout with post-workout check and mark as complete
    const updatedWorkout = {
      ...workout,
      completed: true,
      completedAt: new Date(),
      actualDuration: Math.floor((new Date().getTime() - new Date(workout.createdAt).getTime()) / 60000),
      postWorkout: postWorkoutCheck,
    };

    await storageService.updateWorkout(workout.id, updatedWorkout);

    // Close modal and navigate home
    setShowPostWorkoutModal(false);
    router.replace('/(tabs)');
  };

  const handleChangeWorkout = () => {
    Alert.alert(
      'Change Workout?',
      'Do you want to regenerate today\'s workout or go back to the workout list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: () => {
            router.replace('/check-in');
          }
        },
        {
          text: 'Back to List',
          onPress: () => {
            router.back();
          }
        },
      ]
    );
  };

  const handleSubstituteExercise = async (newExercise: Exercise) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[currentExerciseIndex] = newExercise;

    setWorkout(updatedWorkout);
    await storageService.updateWorkout(workout.id, updatedWorkout);

    // Reset set index since it's a new exercise
    setCurrentSetIndex(0);
    setIsResting(false);
    setRestTimer(0);

    Alert.alert('Exercise Swapped', `Now doing: ${newExercise.name}`);
  };

  if (loading || !workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentSet = currentExercise.sets[currentSetIndex];
  const completedSets = currentExercise.sets.filter(s => s.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💪 Active Workout</Text>
          <Text style={styles.progress}>
            Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
          </Text>
        </View>

        {/* Rest Timer */}
        {isResting && (
          <Card style={styles.restCard}>
            <Text style={styles.restTitle}>⏸️ Rest</Text>
            <Text style={styles.restTimer}>{restTimer}s</Text>
            <Button
              title="Skip Rest"
              onPress={() => {
                setIsResting(false);
                setRestTimer(0);
              }}
              variant="secondary"
              size="small"
            />
          </Card>
        )}

        {/* Current Exercise */}
        <Card style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseTitleContainer}>
              <Text style={styles.exerciseName}>{currentExercise.name}</Text>
              <Text style={styles.exerciseEquipment}>
                {currentExercise.equipment.replace('_', ' ')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.swapIconButton}
              onPress={() => setShowSubstitutionModal(true)}
            >
              <Text style={styles.swapIconText}>🔄</Text>
              <Text style={styles.swapIconLabel}>SWAP</Text>
            </TouchableOpacity>
          </View>

          {/* Swap Help Banner - Show on first few exercises */}
          {currentExerciseIndex < 2 && (
            <View style={styles.swapHelpBanner}>
              <Text style={styles.swapHelpText}>
                💡 Tap 🔄 SWAP above to change this exercise
              </Text>
            </View>
          )}

          {/* Set Progress */}
          <View style={styles.setProgress}>
            <Text style={styles.setProgressText}>
              Set {currentSetIndex + 1} of {currentExercise.sets.length}
            </Text>
            <Text style={styles.completedSets}>
              {completedSets} completed ✅
            </Text>
          </View>

          {/* Target */}
          <View style={styles.target}>
            <Text style={styles.targetLabel}>Target:</Text>
            <Text style={styles.targetValue}>
              {currentExercise.equipment === 'rowing_machine'
                ? `${currentExercise.duration || 20} minutes`
                : `${currentSet.targetReps} reps${currentSet.targetWeight ? ` × ${currentSet.targetWeight} lbs` : ''}`
              }
            </Text>
          </View>

          {/* Instructions */}
          {currentExercise.instructions && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>How to:</Text>
              <Text style={styles.instructionsText}>{currentExercise.instructions}</Text>
            </View>
          )}

          {/* Form Cues */}
          {currentExercise.formCues && currentExercise.formCues.length > 0 && (
            <View style={styles.formCues}>
              <Text style={styles.formCuesTitle}>Form Tips:</Text>
              {currentExercise.formCues.map((cue, index) => (
                <Text key={index} style={styles.formCue}>• {cue}</Text>
              ))}
            </View>
          )}
        </Card>

        {/* Log Set Component */}
        {!isResting && (
          <SetLogger
            set={currentSet}
            exercise={currentExercise}
            onComplete={handleCompleteSet}
            onSkip={handleSkipSet}
            onConnectEchelon={() => setShowEchelonModal(true)}
            rowingData={rowingData}
          />
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="🔄 Swap This Exercise"
            onPress={() => setShowSubstitutionModal(true)}
            variant="primary"
            fullWidth
            size="large"
            style={styles.swapButton}
          />
          <Button
            title="Change Entire Workout"
            onPress={handleChangeWorkout}
            variant="secondary"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="Finish Workout"
            onPress={handleCompleteWorkout}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Exercise Substitution Modal */}
      <ExerciseSubstitutionModal
        visible={showSubstitutionModal}
        currentExercise={currentExercise}
        onClose={() => setShowSubstitutionModal(false)}
        onSubstitute={handleSubstituteExercise}
      />

      {/* Echelon Row BLE Modal */}
      <EchelonRowConnect
        visible={showEchelonModal}
        onClose={() => setShowEchelonModal(false)}
        onDataUpdate={setRowingData}
        autoUseData={false}
      />

      {/* Post-Workout Check Modal */}
      {workout && (
        <PostWorkoutCheckModal
          visible={showPostWorkoutModal}
          onClose={() => setShowPostWorkoutModal(false)}
          onSubmit={handlePostWorkoutSubmit}
          preWorkoutKnee={7}
          preWorkoutShoulder={7}
        />
      )}
    </SafeAreaView>
  );
}

// Set Logger Component
function SetLogger({
  set,
  exercise,
  onComplete,
  onSkip,
  onConnectEchelon,
  rowingData,
}: {
  set: ExerciseSet;
  exercise: Exercise;
  onComplete: (reps: number, weight: number, difficulty: string) => void;
  onSkip: () => void;
  onConnectEchelon?: () => void;
  rowingData?: RowingData | null;
}) {
  const isRowing = exercise.equipment === 'rowing_machine';
  const [reps, setReps] = useState(set.targetReps?.toString() || '');
  const [weight, setWeight] = useState(set.targetWeight?.toString() || '');
  const [minutes, setMinutes] = useState(exercise.duration?.toString() || '');
  const [rowingLevel, setRowingLevel] = useState('5');
  const [difficulty, setDifficulty] = useState<string>('good');

  // Auto-fill from Echelon Row BLE data
  useEffect(() => {
    if (isRowing && rowingData) {
      const durationMinutes = Math.floor(rowingData.duration / 60);
      setMinutes(durationMinutes.toString());
      setRowingLevel(rowingData.resistanceLevel.toString());
    }
  }, [rowingData, isRowing]);

  const handleComplete = () => {
    if (isRowing) {
      const actualMinutes = parseInt(minutes) || 0;
      const level = parseInt(rowingLevel) || 0;

      if (actualMinutes === 0) {
        Alert.alert('Error', 'Please enter the number of minutes you rowed');
        return;
      }

      // For rowing: store minutes as reps, level as weight
      onComplete(actualMinutes, level, difficulty);
    } else {
      const actualReps = parseInt(reps) || 0;
      const actualWeight = parseInt(weight) || 0;

      if (actualReps === 0) {
        Alert.alert('Error', 'Please enter the number of reps you completed');
        return;
      }

      onComplete(actualReps, actualWeight, difficulty);
    }

    // Reset for next set
    setReps(set.targetReps?.toString() || '');
    setWeight(set.targetWeight?.toString() || '');
    setMinutes(exercise.duration?.toString() || '');
    setRowingLevel('5');
    setDifficulty('good');
  };

  return (
    <Card style={styles.loggerCard}>
      <Text style={styles.loggerTitle}>Log This Set</Text>

      {isRowing ? (
        <>
          {/* Echelon Row BLE Connection */}
          {onConnectEchelon && (
            <Button
              title={rowingData ? '🟢 Echelon Row Connected' : '🔵 Connect to Echelon Row'}
              onPress={onConnectEchelon}
              variant={rowingData ? 'primary' : 'secondary'}
              size="small"
              fullWidth
              style={styles.echelonButton}
            />
          )}

          {/* Live Data Display */}
          {rowingData && (
            <View style={styles.liveDataCard}>
              <Text style={styles.liveDataTitle}>📊 Live Data</Text>
              <View style={styles.liveDataRow}>
                <Text style={styles.liveDataText}>Time: {Math.floor(rowingData.duration / 60)}:{(rowingData.duration % 60).toString().padStart(2, '0')}</Text>
                <Text style={styles.liveDataText}>Distance: {rowingData.distance}m</Text>
              </View>
              <View style={styles.liveDataRow}>
                <Text style={styles.liveDataText}>SPM: {rowingData.strokeRate}</Text>
                <Text style={styles.liveDataText}>Strokes: {rowingData.strokeCount}</Text>
              </View>
            </View>
          )}

          {/* Minutes Input for Rowing */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Minutes Completed:</Text>
            <TextInput
              style={styles.input}
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Resistance Level Input for Rowing */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Resistance Level (1-16):</Text>
            <TextInput
              style={styles.input}
              value={rowingLevel}
              onChangeText={setRowingLevel}
              keyboardType="number-pad"
              placeholder="5"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </>
      ) : (
        <>
          {/* Reps Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reps Completed:</Text>
            <TextInput
              style={styles.input}
              value={reps}
              onChangeText={setReps}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Weight Input */}
          {set.targetWeight !== undefined && set.targetWeight > 0 && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (lbs):</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          )}
        </>
      )}

      {/* Difficulty */}
      <View style={styles.difficultyGroup}>
        <Text style={styles.inputLabel}>How did it feel?</Text>
        <View style={styles.difficultyButtons}>
          <Button
            title="😅 Easy"
            onPress={() => setDifficulty('easy')}
            variant={difficulty === 'easy' ? 'primary' : 'outline'}
            size="small"
            style={styles.difficultyButton}
          />
          <Button
            title="👍 Good"
            onPress={() => setDifficulty('good')}
            variant={difficulty === 'good' ? 'primary' : 'outline'}
            size="small"
            style={styles.difficultyButton}
          />
          <Button
            title="💪 Hard"
            onPress={() => setDifficulty('hard')}
            variant={difficulty === 'hard' ? 'primary' : 'outline'}
            size="small"
            style={styles.difficultyButton}
          />
          <Button
            title="😣 Pain"
            onPress={() => setDifficulty('pain')}
            variant={difficulty === 'pain' ? 'danger' : 'outline'}
            size="small"
            style={styles.difficultyButton}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.loggerActions}>
        <Button
          title="Skip Set"
          onPress={onSkip}
          variant="secondary"
          style={styles.skipButton}
        />
        <Button
          title="Complete Set ✓"
          onPress={handleComplete}
          size="large"
          style={styles.completeButton}
        />
      </View>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progress: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  restCard: {
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    marginBottom: spacing.lg,
    padding: spacing.xl,
  },
  restTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  restTimer: {
    fontSize: 72,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  exerciseCard: {
    marginBottom: spacing.lg,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  exerciseTitleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  exerciseName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exerciseEquipment: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  swapIconButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  swapIconText: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  swapIconLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
    letterSpacing: 0.5,
  },
  swapHelpBanner: {
    backgroundColor: colors.primary + '15',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.sm,
  },
  swapHelpText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontStyle: 'italic',
  },
  setProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  setProgressText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  completedSets: {
    fontSize: fontSize.md,
    color: colors.success,
  },
  target: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  targetLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  targetValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.primary,
  },
  instructions: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderRadius: borderRadius.md,
  },
  instructionsTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  instructionsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  formCues: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
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
  loggerCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary + '10',
  },
  loggerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.xl,
    color: colors.text,
    fontWeight: fontWeight.semibold as any,
  },
  difficultyGroup: {
    marginBottom: spacing.lg,
  },
  difficultyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  difficultyButton: {
    flex: 1,
    minWidth: '45%',
  },
  loggerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  skipButton: {
    flex: 1,
  },
  completeButton: {
    flex: 2,
  },
  actions: {
    gap: spacing.md,
  },
  swapButton: {
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  echelonButton: {
    marginBottom: spacing.md,
  },
  liveDataCard: {
    backgroundColor: colors.primary + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  liveDataTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  liveDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  liveDataText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
});
