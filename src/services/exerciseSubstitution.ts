// Exercise Substitution Service
// Handles finding suitable exercise replacements based on equipment, phase, and user constraints

import { Exercise, EquipmentType, WorkoutPhase } from '@/types/workout';
import { EXERCISES, ExerciseTemplate } from '@/constants/exercises';

interface SubstitutionCriteria {
  phase: WorkoutPhase;
  equipment?: EquipmentType;
  kneeFriendly?: boolean;
  shoulderFriendly?: boolean;
  targetMuscles?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Find suitable exercise substitutions based on criteria
 */
export function findSubstitutions(
  currentExercise: Exercise,
  criteria?: Partial<SubstitutionCriteria>
): ExerciseTemplate[] {
  const allExercises = Object.values(EXERCISES);

  // Build filter criteria from current exercise and overrides
  const filters: SubstitutionCriteria = {
    phase: criteria?.phase ?? currentExercise.phase,
    equipment: criteria?.equipment,
    kneeFriendly: criteria?.kneeFriendly,
    shoulderFriendly: criteria?.shoulderFriendly,
    targetMuscles: criteria?.targetMuscles,
    difficulty: criteria?.difficulty,
  };

  return allExercises.filter(template => {
    // Exclude current exercise
    if (template.id === currentExercise.id) return false;

    // Must match phase
    if (template.phase !== filters.phase) return false;

    // Filter by equipment if specified
    if (filters.equipment && template.equipment !== filters.equipment) return false;

    // Filter by knee-friendly if specified
    if (filters.kneeFriendly !== undefined && template.kneeFriendly !== filters.kneeFriendly) {
      return false;
    }

    // Filter by shoulder-friendly if specified
    if (filters.shoulderFriendly !== undefined && template.shoulderFriendly !== filters.shoulderFriendly) {
      return false;
    }

    // Filter by difficulty if specified
    if (filters.difficulty && template.difficulty !== filters.difficulty) return false;

    // Filter by target muscles if specified (at least one overlap)
    if (filters.targetMuscles && filters.targetMuscles.length > 0) {
      const hasOverlap = filters.targetMuscles.some(muscle =>
        template.targetMuscles.some(tm => tm.toLowerCase().includes(muscle.toLowerCase()))
      );
      if (!hasOverlap) return false;
    }

    return true;
  });
}

/**
 * Get exercises by equipment type
 */
export function getExercisesByEquipment(equipment: EquipmentType): ExerciseTemplate[] {
  return Object.values(EXERCISES).filter(ex => ex.equipment === equipment);
}

/**
 * Get exercises by phase
 */
export function getExercisesByPhase(phase: WorkoutPhase): ExerciseTemplate[] {
  return Object.values(EXERCISES).filter(ex => ex.phase === phase);
}

/**
 * Convert exercise template to workout exercise
 */
export function templateToExercise(
  template: ExerciseTemplate,
  sets?: number,
  reps?: number,
  weight?: number
): Exercise {
  const numSets = sets ?? template.defaultSets;
  const numReps = reps ?? template.defaultReps;

  return {
    id: `${template.id}_${Date.now()}`,
    name: template.name,
    equipment: template.equipment,
    phase: template.phase,
    sets: Array.from({ length: numSets }, (_, index) => ({
      setNumber: index + 1,
      targetReps: numReps,
      targetWeight: weight,
      restSeconds: template.defaultRestSeconds,
      completed: false,
    })),
    formCues: template.formCues,
    modifications: template.modifications,
    duration: numReps === 0 ? 20 : undefined, // Default duration for time-based exercises
    targetMuscles: template.targetMuscles,
    safetyConsiderations: template.kneeFriendly && template.shoulderFriendly
      ? ['Knee Friendly', 'Shoulder Friendly']
      : template.kneeFriendly
      ? ['Knee Friendly']
      : template.shoulderFriendly
      ? ['Shoulder Friendly']
      : [],
  };
}

/**
 * Get all exercises grouped by equipment
 */
export function getExercisesGroupedByEquipment(): Record<EquipmentType, ExerciseTemplate[]> {
  const grouped: Partial<Record<EquipmentType, ExerciseTemplate[]>> = {};

  Object.values(EXERCISES).forEach(exercise => {
    if (!grouped[exercise.equipment]) {
      grouped[exercise.equipment] = [];
    }
    grouped[exercise.equipment]!.push(exercise);
  });

  return grouped as Record<EquipmentType, ExerciseTemplate[]>;
}

/**
 * Get smart substitutions based on user state
 */
export function getSmartSubstitutions(
  currentExercise: Exercise,
  userState: {
    kneeHealth: number;  // 0-10
    shoulderHealth: number;  // 0-10
  }
): ExerciseTemplate[] {
  // Determine if we need joint-friendly alternatives
  const needsKneeFriendly = userState.kneeHealth <= 6;
  const needsShoulderFriendly = userState.shoulderHealth <= 6;

  return findSubstitutions(currentExercise, {
    kneeFriendly: needsKneeFriendly ? true : undefined,
    shoulderFriendly: needsShoulderFriendly ? true : undefined,
  });
}
