// Workout Store - Zustand State Management

import { create } from 'zustand';
import { Workout, Exercise, ExerciseSet } from '@/types/workout';
import { database } from '@/database';

interface WorkoutState {
  // Active workout
  activeWorkout: Workout | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isPaused: boolean;
  startTime: number | null;
  
  // Actions
  startWorkout: (workout: Workout) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  completeSet: (data: Partial<ExerciseSet>) => void;
  nextExercise: () => void;
  skipExercise: (reason: string) => void;
  endWorkout: () => Promise<void>;
  
  // Getters
  getElapsedTime: () => number;
  getCurrentExercise: () => Exercise | null;
  getCurrentSet: () => ExerciseSet | null;
  getProgress: () => { current: number; total: number };
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  isPaused: false,
  startTime: null,
  
  startWorkout: (workout) => {
    set({
      activeWorkout: workout,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isPaused: false,
      startTime: Date.now()
    });
  },
  
  pauseWorkout: () => set({ isPaused: true }),
  
  resumeWorkout: () => set({ isPaused: false }),
  
  completeSet: (data) => {
    const state = get();
    if (!state.activeWorkout) return;
    
    const updatedWorkout = { ...state.activeWorkout };
    const exercise = updatedWorkout.exercises[state.currentExerciseIndex];
    const set_obj = exercise.sets[state.currentSetIndex];
    
    // Update set with completion data
    Object.assign(set_obj, {
      ...data,
      completed: true,
      completedAt: new Date(),
    });
    
    // Check if more sets remain
    const isLastSet = state.currentSetIndex === exercise.sets.length - 1;
    
    if (isLastSet) {
      // Move to next exercise
      get().nextExercise();
    } else {
      // Move to next set
      set({ 
        currentSetIndex: state.currentSetIndex + 1,
        activeWorkout: updatedWorkout
      });
    }
  },
  
  nextExercise: () => {
    const state = get();
    const nextIndex = state.currentExerciseIndex + 1;
    
    if (!state.activeWorkout || nextIndex >= state.activeWorkout.exercises.length) {
      // Workout complete
      get().endWorkout();
    } else {
      set({
        currentExerciseIndex: nextIndex,
        currentSetIndex: 0
      });
    }
  },
  
  skipExercise: (reason) => {
    const state = get();
    if (!state.activeWorkout) return;
    
    const updatedWorkout = { ...state.activeWorkout };
    updatedWorkout.exercises[state.currentExerciseIndex].skipped = true;
    updatedWorkout.exercises[state.currentExerciseIndex].skipReason = reason;
    
    set({ activeWorkout: updatedWorkout });
    get().nextExercise();
  },
  
  endWorkout: async () => {
    const state = get();
    if (!state.activeWorkout) return;
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - (state.startTime || endTime)) / 1000 / 60);
    
    // Save to database
    try {
      await database.write(async () => {
        const workoutsCollection = database.collections.get('workouts');
        await workoutsCollection.create((workout: any) => {
          workout.date = state.activeWorkout!.date;
          workout.type = state.activeWorkout!.type;
          workout.estimatedDuration = state.activeWorkout!.estimatedDuration;
          workout.actualDuration = duration;
          workout.reasoning = state.activeWorkout!.reasoning;
          workout.exercises = JSON.stringify(state.activeWorkout!.exercises);
          workout.completed = true;
          workout.completedAt = new Date();
          workout.coachingNotes = state.activeWorkout!.coachingNotes;
          workout.checkInId = state.activeWorkout!.checkInId;
        });
      });
    } catch (error) {
      console.error('Failed to save workout:', error);
    }
    
    // Reset state
    set({
      activeWorkout: null,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isPaused: false,
      startTime: null
    });
  },
  
  getElapsedTime: () => {
    const state = get();
    if (!state.startTime) return 0;
    return Date.now() - state.startTime;
  },
  
  getCurrentExercise: () => {
    const state = get();
    if (!state.activeWorkout) return null;
    return state.activeWorkout.exercises[state.currentExerciseIndex] || null;
  },
  
  getCurrentSet: () => {
    const state = get();
    const exercise = state.getCurrentExercise();
    if (!exercise) return null;
    return exercise.sets[state.currentSetIndex] || null;
  },
  
  getProgress: () => {
    const state = get();
    return {
      current: state.currentExerciseIndex + 1,
      total: state.activeWorkout?.exercises.length || 0
    };
  }
}));
