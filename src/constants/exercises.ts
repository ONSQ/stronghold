// Exercise Library - Owen's Equipment Setup

import { EquipmentType, WorkoutPhase } from '@/types/workout';

export interface ExerciseTemplate {
  id: string;
  name: string;
  equipment: EquipmentType;
  phase: WorkoutPhase;
  defaultSets: number;
  defaultReps: number;
  defaultRestSeconds: number;
  formCues: string[];
  modifications?: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  kneeFriendly: boolean;
  shoulderFriendly: boolean;
}

export const EXERCISES: Record<string, ExerciseTemplate> = {
  // ROWING MACHINE
  'easy_rowing': {
    id: 'easy_rowing',
    name: 'Easy Rowing',
    equipment: 'rowing_machine',
    phase: 'warmup',
    defaultSets: 1,
    defaultReps: 0, // duration-based
    defaultRestSeconds: 0,
    formCues: [
      'Legs push first, then lean back, then pull arms',
      'Recovery is slow and controlled',
      'Keep core engaged',
      'Breathing: exhale on drive, inhale on recovery'
    ],
    targetMuscles: ['full body', 'cardiovascular'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'steady_rowing': {
    id: 'steady_rowing',
    name: 'Steady State Rowing',
    equipment: 'rowing_machine',
    phase: 'cardio',
    defaultSets: 1,
    defaultReps: 0,
    defaultRestSeconds: 0,
    formCues: [
      'Maintain consistent pace',
      'Target 20-24 SPM for steady state',
      'Focus on form over speed',
      'Keep shoulders relaxed'
    ],
    targetMuscles: ['full body', 'cardiovascular'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'contemplative_rowing': {
    id: 'contemplative_rowing',
    name: 'Contemplative Rowing',
    equipment: 'rowing_machine',
    phase: 'cardio',
    defaultSets: 1,
    defaultReps: 0,
    defaultRestSeconds: 0,
    formCues: [
      'Slow, meditative pace',
      'Focus on breath and rhythm',
      'Use for stress relief',
      'HR under 130 bpm'
    ],
    modifications: 'Excellent for anxiety relief - proven to reduce stress 60%',
    targetMuscles: ['full body', 'mental clarity'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  // CABLE MACHINE
  'cable_chest_press': {
    id: 'cable_chest_press',
    name: 'Cable Chest Press',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Keep elbows below shoulder level',
      'Press straight forward',
      'Controlled return',
      'Engage core throughout'
    ],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'cable_row': {
    id: 'cable_row',
    name: 'Cable Row',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Pull elbows back, not just hands',
      'Squeeze shoulder blades together',
      'Keep core tight',
      'Slight lean back is okay'
    ],
    targetMuscles: ['back', 'biceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'cable_shoulder_press': {
    id: 'cable_shoulder_press',
    name: 'Cable Shoulder Press',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Start at shoulder height',
      'Press straight up',
      'Don\'t arch back',
      'Control the descent'
    ],
    modifications: 'Skip if shoulder pain > 6/10',
    targetMuscles: ['shoulders', 'triceps'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: false, // depends on shoulder state
  },
  
  'cable_tricep_extension': {
    id: 'cable_tricep_extension',
    name: 'Cable Tricep Extension',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 15,
    defaultRestSeconds: 60,
    formCues: [
      'Keep elbows fixed by sides',
      'Extend arms fully',
      'Squeeze at bottom',
      'Slow and controlled'
    ],
    targetMuscles: ['triceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'cable_lat_pulldown': {
    id: 'cable_lat_pulldown',
    name: 'Cable Lat Pulldown',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Pull bar to upper chest',
      'Lean back slightly',
      'Lead with elbows',
      'Squeeze lats at bottom'
    ],
    targetMuscles: ['back', 'biceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  // RESISTANCE BANDS
  'band_chest_press': {
    id: 'band_chest_press',
    name: 'Band Chest Press',
    equipment: 'resistance_bands',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Anchor band at chest height',
      'Step forward for tension',
      'Press forward and together',
      'Control the return'
    ],
    targetMuscles: ['chest', 'triceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'band_row': {
    id: 'band_row',
    name: 'Band Row',
    equipment: 'resistance_bands',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Anchor band at waist height',
      'Pull elbows back',
      'Squeeze shoulder blades',
      'Can sit on stability ball for core work'
    ],
    targetMuscles: ['back', 'biceps', 'core'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'band_shoulder_press': {
    id: 'band_shoulder_press',
    name: 'Band Shoulder Press',
    equipment: 'resistance_bands',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    formCues: [
      'Stand on band',
      'Hands at shoulder height',
      'Press straight up',
      'More joint-friendly than cables'
    ],
    modifications: 'Safer alternative if shoulder issues',
    targetMuscles: ['shoulders', 'triceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'band_lateral_walk': {
    id: 'band_lateral_walk',
    name: 'Band Lateral Walk',
    equipment: 'resistance_bands',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10, // steps each direction
    defaultRestSeconds: 60,
    formCues: [
      'Band around thighs',
      'Quarter squat position',
      'Step sideways, maintain tension',
      'Excellent for knee stability'
    ],
    modifications: 'GREAT for knee health - do often',
    targetMuscles: ['glutes', 'hip stabilizers'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'band_bicep_curl': {
    id: 'band_bicep_curl',
    name: 'Band Bicep Curl',
    equipment: 'resistance_bands',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 15,
    defaultRestSeconds: 60,
    formCues: [
      'Stand on band',
      'Keep elbows by sides',
      'Curl up slowly',
      'Control the descent'
    ],
    targetMuscles: ['biceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'band_lateral_raise': {
    id: 'band_lateral_raise',
    name: 'Band Lateral Raise',
    equipment: 'resistance_bands',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 15,
    defaultRestSeconds: 60,
    formCues: [
      'Stand on band',
      'Raise arms to sides',
      'Stop at shoulder height',
      'Light resistance, high control'
    ],
    targetMuscles: ['shoulders'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  // STABILITY BALL
  'ball_wall_squat': {
    id: 'ball_wall_squat',
    name: 'Stability Ball Wall Squat',
    equipment: 'stability_ball',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 60,
    formCues: [
      'Ball between back and wall',
      'Quarter squat only (knee protection)',
      'Push through heels',
      'Control up and down'
    ],
    modifications: 'Knee-friendly leg work',
    targetMuscles: ['quads', 'glutes'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'ball_crunch': {
    id: 'ball_crunch',
    name: 'Stability Ball Crunch',
    equipment: 'stability_ball',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 20,
    defaultRestSeconds: 45,
    formCues: [
      'Lie back on ball',
      'Feet flat on floor',
      'Crunch up, don\'t sit up',
      'Control the movement'
    ],
    targetMuscles: ['abs'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'ball_plank': {
    id: 'ball_plank',
    name: 'Stability Ball Plank',
    equipment: 'stability_ball',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 0, // time-based
    defaultRestSeconds: 60,
    formCues: [
      'Forearms on ball',
      'Body straight from head to heels',
      'Engage core',
      'Start with 20-30 seconds'
    ],
    targetMuscles: ['core', 'shoulders'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: false, // depends on shoulder state
  },
  
  'glute_bridge': {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    equipment: 'stability_ball',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 15,
    defaultRestSeconds: 60,
    formCues: [
      'Lie on back, feet on ball (advanced) or floor (easier)',
      'Lift hips up',
      'Squeeze glutes at top',
      'Lower slowly'
    ],
    modifications: 'Excellent for knee health',
    targetMuscles: ['glutes', 'hamstrings'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'ball_pass': {
    id: 'ball_pass',
    name: 'Stability Ball Pass',
    equipment: 'stability_ball',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 60,
    formCues: [
      'Lie on back',
      'Pass ball from hands to feet',
      'Keep ball controlled',
      'Lower back stays on floor'
    ],
    targetMuscles: ['abs', 'hip flexors'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  // BODYWEIGHT
  'push_up_modified': {
    id: 'push_up_modified',
    name: 'Modified Push-Up',
    equipment: 'bodyweight',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 60,
    formCues: [
      'Knees on ground',
      'Hands slightly wider than shoulders',
      'Lower chest to ground',
      'Push back up'
    ],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: false,
  },
  
  'dead_bug': {
    id: 'dead_bug',
    name: 'Dead Bug',
    equipment: 'bodyweight',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10, // each side
    defaultRestSeconds: 45,
    formCues: [
      'Lie on back',
      'Opposite arm and leg extend',
      'Keep low back pressed down',
      'Slow and controlled'
    ],
    targetMuscles: ['abs', 'core stability'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
  
  'plank_on_knees': {
    id: 'plank_on_knees',
    name: 'Plank (on knees)',
    equipment: 'bodyweight',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 0, // time-based
    defaultRestSeconds: 60,
    formCues: [
      'Forearms on ground',
      'Knees on ground',
      'Body straight from knees to head',
      'Start with 20-30 seconds'
    ],
    targetMuscles: ['core'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },
};

// Equipment available to Owen
export const AVAILABLE_EQUIPMENT: EquipmentType[] = [
  'rowing_machine',
  'resistance_bands',
  'cables',
  'stability_ball',
  'free_weights',
  'bodyweight',
];

// Get exercises by equipment
export function getExercisesByEquipment(equipment: EquipmentType): ExerciseTemplate[] {
  return Object.values(EXERCISES).filter(ex => ex.equipment === equipment);
}

// Get knee-friendly exercises
export function getKneeFriendlyExercises(): ExerciseTemplate[] {
  return Object.values(EXERCISES).filter(ex => ex.kneeFriendly);
}

// Get shoulder-friendly exercises
export function getShoulderFriendlyExercises(): ExerciseTemplate[] {
  return Object.values(EXERCISES).filter(ex => ex.shoulderFriendly);
}

// Get exercises by phase
export function getExercisesByPhase(phase: WorkoutPhase): ExerciseTemplate[] {
  return Object.values(EXERCISES).filter(ex => ex.phase === phase);
}
