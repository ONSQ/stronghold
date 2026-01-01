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
      'Elbows at 45-degree angle to body',
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

  // DUAL CABLE EXERCISES (Power Cage)
  'dual_cable_chest_press': {
    id: 'dual_cable_chest_press',
    name: 'Dual Cable Chest Press',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Stand between cables, handles at chest height',
      'Step forward into split stance',
      'Press both handles forward and together',
      'Squeeze chest at peak contraction',
      'Control the return - feel the stretch'
    ],
    modifications: 'Superior to single cable - allows natural convergence like dumbbell press',
    targetMuscles: ['chest', 'triceps', 'front delts'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dual_cable_fly': {
    id: 'dual_cable_fly',
    name: 'Dual Cable Chest Fly',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Cables at shoulder height behind you',
      'Slight bend in elbows (locked position)',
      'Bring handles together in front of chest',
      'Think: hugging a tree',
      'Constant tension throughout movement'
    ],
    modifications: 'Excellent chest isolation. Lower cables for upper chest emphasis.',
    targetMuscles: ['chest', 'front delts'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dual_cable_row': {
    id: 'dual_cable_row',
    name: 'Dual Cable Seated Row',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Sit facing cables with handles',
      'Pull both handles to sides of torso',
      'Keep elbows close to body',
      'Squeeze shoulder blades together',
      'Slight lean back at end (10-15 degrees)'
    ],
    modifications: 'Independent cables allow natural pulling path for each arm',
    targetMuscles: ['lats', 'rhomboids', 'traps', 'biceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dual_cable_shoulder_press': {
    id: 'dual_cable_shoulder_press',
    name: 'Dual Cable Shoulder Press',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Cables low, handles at shoulder height',
      'Press both handles overhead',
      'Keep core tight - no lower back arch',
      'Lower with control to shoulders',
      'Can be done seated or standing'
    ],
    modifications: 'Standing version adds core stability work. Seated is more shoulder-focused.',
    targetMuscles: ['shoulders', 'triceps', 'core'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dual_cable_bicep_curl': {
    id: 'dual_cable_bicep_curl',
    name: 'Dual Cable Bicep Curl',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Cables low, stand in center',
      'Curl both handles simultaneously',
      'Keep elbows pinned at sides',
      'Squeeze biceps at top',
      'Constant tension - no rest at bottom'
    ],
    modifications: 'Can also do alternating for focus. Cables provide constant tension vs dumbbells.',
    targetMuscles: ['biceps', 'forearms'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dual_cable_tricep_extension': {
    id: 'dual_cable_tricep_extension',
    name: 'Dual Cable Overhead Tricep Extension',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Cables high, face away from machine',
      'Handles behind head, elbows up',
      'Extend both arms overhead',
      'Keep elbows stationary',
      'Feel stretch in triceps at bottom'
    ],
    modifications: 'Can also do facing machine with cables low for pushdown variation',
    targetMuscles: ['triceps'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dual_cable_crossover': {
    id: 'dual_cable_crossover',
    name: 'Dual Cable Crossover',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    formCues: [
      'Cables high, handles in each hand',
      'Step forward, slight forward lean',
      'Bring handles down and across body',
      'Cross at belly button level',
      'Peak contraction squeeze'
    ],
    modifications: 'High-to-low targets lower chest. Low-to-high targets upper chest.',
    targetMuscles: ['chest', 'front delts'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dual_cable_lateral_raise': {
    id: 'dual_cable_lateral_raise',
    name: 'Dual Cable Lateral Raise',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    formCues: [
      'Stand in center, cables crossed low',
      'Right hand holds left cable, left holds right',
      'Raise both arms out to sides',
      'Lead with elbows, slight bend',
      'Stop at shoulder height'
    ],
    modifications: 'Cables provide constant tension throughout range - superior to dumbbells for delts',
    targetMuscles: ['side delts', 'traps'],
    difficulty: 'intermediate',
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
      'Start with 20-30 seconds',
      'Keep shoulders packed and stable'
    ],
    modifications: 'Drop to knees if shoulder feels unstable',
    targetMuscles: ['core', 'shoulders'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
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

  // BARBELL EXERCISES
  'barbell_rdl': {
    id: 'barbell_rdl',
    name: 'Barbell Romanian Deadlift (RDL)',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 120,
    formCues: [
      'Hinge at hips, not lower back',
      'Keep bar close to shins',
      'Slight knee bend throughout',
      'Feel stretch in hamstrings',
      'Push hips forward to stand'
    ],
    modifications: 'Start with light weight (just the bar). Excellent for posterior chain.',
    targetMuscles: ['hamstrings', 'glutes', 'lower back'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_rack_pull': {
    id: 'barbell_rack_pull',
    name: 'Barbell Rack Pull',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 120,
    formCues: [
      'Set bar at knee height on rack',
      'Pull bar up by standing tall',
      'Squeeze glutes at top',
      'Control the descent'
    ],
    modifications: 'Knee-friendly deadlift alternative. Less range of motion.',
    targetMuscles: ['back', 'glutes', 'traps'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_bent_row': {
    id: 'barbell_bent_row',
    name: 'Barbell Bent-Over Row',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Hinge forward 45 degrees',
      'Pull bar to lower chest',
      'Elbows close to body',
      'Squeeze shoulder blades together'
    ],
    targetMuscles: ['back', 'lats', 'biceps'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_hip_thrust': {
    id: 'barbell_hip_thrust',
    name: 'Barbell Hip Thrust',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Upper back on bench',
      'Bar across hips (use pad)',
      'Drive through heels',
      'Squeeze glutes hard at top',
      'Avoid arching lower back'
    ],
    modifications: 'THE best glute builder. Critical for knee health and mobility.',
    targetMuscles: ['glutes', 'hamstrings'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_floor_press': {
    id: 'barbell_floor_press',
    name: 'Barbell Floor Press',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Lie on floor, knees bent',
      'Lower bar until elbows touch floor',
      'Press back up explosively',
      'Reduced range = shoulder-friendly'
    ],
    modifications: 'Safer than bench press for shoulder issues',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_bench_press': {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 120,
    formCues: [
      'Retract shoulder blades, arch back slightly',
      'Lower bar to mid-chest',
      'Elbows at 45-degree angle',
      'Press straight up',
      'Use spotter or safety bars in power cage'
    ],
    modifications: 'Use safety bars at appropriate height. Switch to floor press if shoulder hurts.',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: false,
  },

  'barbell_squat': {
    id: 'barbell_squat',
    name: 'Barbell Back Squat',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 120,
    formCues: [
      'Bar on upper back (high bar) or rear delts (low bar)',
      'Squat to comfortable depth',
      'Knees track over toes',
      'Drive through heels',
      'Use safety bars in power cage'
    ],
    modifications: 'Quarter or half squats if knees hurt. Box squats are safer. Goblet squat is easiest alternative.',
    targetMuscles: ['quads', 'glutes', 'hamstrings', 'core'],
    difficulty: 'intermediate',
    kneeFriendly: false,
    shoulderFriendly: true,
  },

  'barbell_box_squat': {
    id: 'barbell_box_squat',
    name: 'Barbell Box Squat',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Squat back to box or bench',
      'Pause briefly on box',
      'Stand back up',
      'Teaches proper squat pattern',
      'Safer for knees - controls depth'
    ],
    modifications: 'THE most knee-friendly barbell squat. Height of box determines depth.',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_overhead_press': {
    id: 'barbell_overhead_press',
    name: 'Barbell Overhead Press',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 90,
    formCues: [
      'Start at shoulder height',
      'Press straight overhead',
      'Lock out at top',
      'Lower with control',
      'Keep core braced'
    ],
    modifications: 'Skip if shoulder pain. Use safety bars. Try seated variation.',
    targetMuscles: ['shoulders', 'triceps', 'upper chest'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: false,
  },

  'barbell_front_squat': {
    id: 'barbell_front_squat',
    name: 'Barbell Front Squat',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 120,
    formCues: [
      'Bar rests on front delts',
      'Elbows high',
      'Squat keeping torso upright',
      'More quad emphasis than back squat',
      'Easier on lower back'
    ],
    modifications: 'Harder to learn but easier on back. Use safety bars.',
    targetMuscles: ['quads', 'core', 'upper back'],
    difficulty: 'advanced',
    kneeFriendly: false,
    shoulderFriendly: false,
  },

  'barbell_inverted_row': {
    id: 'barbell_inverted_row',
    name: 'Inverted Row (Bar in Rack)',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    formCues: [
      'Set bar at waist height in rack',
      'Hang underneath, body straight',
      'Pull chest to bar',
      'Excellent bodyweight back exercise',
      'Lower = harder, higher = easier'
    ],
    modifications: 'Adjust bar height for difficulty. Great for building pull-up strength.',
    targetMuscles: ['back', 'biceps', 'core'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_pin_press': {
    id: 'barbell_pin_press',
    name: 'Pin Press (from safety bars)',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 120,
    formCues: [
      'Set pins at chest height',
      'Bar rests on pins',
      'Press from dead stop',
      'Builds explosive strength',
      'Very shoulder-safe - no eccentric'
    ],
    modifications: 'Excellent for shoulder issues - removes stretch reflex',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'barbell_pin_squat': {
    id: 'barbell_pin_squat',
    name: 'Pin Squat (from safety bars)',
    equipment: 'barbell',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 120,
    formCues: [
      'Set pins at desired squat depth',
      'Squat down to pins',
      'Pause, then drive up',
      'Builds bottom position strength',
      'Very safe - can bail anytime'
    ],
    modifications: 'Perfect for working on weak points. Pin height controls depth for knee safety.',
    targetMuscles: ['quads', 'glutes'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  // EZ BAR EXERCISES
  'ez_bar_curl': {
    id: 'ez_bar_curl',
    name: 'EZ Bar Bicep Curl',
    equipment: 'ez_bar',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Grip angles reduce wrist strain',
      'Keep elbows stationary',
      'Curl to shoulders',
      'Lower with control'
    ],
    targetMuscles: ['biceps', 'forearms'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'ez_bar_skull_crusher': {
    id: 'ez_bar_skull_crusher',
    name: 'EZ Bar Skull Crusher',
    equipment: 'ez_bar',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Lie on bench or floor',
      'Lower bar to forehead',
      'Keep elbows pointed up',
      'Extend arms fully',
      'EZ bar is easier on elbows than straight bar'
    ],
    targetMuscles: ['triceps'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'ez_bar_upright_row': {
    id: 'ez_bar_upright_row',
    name: 'EZ Bar Upright Row',
    equipment: 'ez_bar',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 60,
    formCues: [
      'Narrow grip on angled part',
      'Pull bar to upper chest',
      'Elbows lead upward',
      'Stop at chest height (not chin)'
    ],
    modifications: 'Only do if shoulder feels good. Skip if shoulder pain > 5/10',
    targetMuscles: ['shoulders', 'traps'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: false,
  },

  'ez_bar_preacher_curl': {
    id: 'ez_bar_preacher_curl',
    name: 'EZ Bar Preacher Curl',
    equipment: 'ez_bar',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Rest arms on stability ball or bench',
      'Strict form, no momentum',
      'Squeeze biceps at top',
      'Slow negative'
    ],
    targetMuscles: ['biceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  // DUMBBELL EXERCISES
  'dumbbell_goblet_squat': {
    id: 'dumbbell_goblet_squat',
    name: 'Goblet Squat',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Hold dumbbell at chest',
      'Squat as deep as comfortable',
      'Chest up, weight in heels',
      'Elbows inside knees at bottom'
    ],
    modifications: 'Quarter or half squats if knees hurt. Most knee-friendly squat variation.',
    targetMuscles: ['quads', 'glutes', 'core'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dumbbell_single_arm_row': {
    id: 'dumbbell_single_arm_row',
    name: 'Single-Arm Dumbbell Row',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Hand and knee on bench',
      'Pull dumbbell to hip',
      'Keep back flat',
      'Squeeze shoulder blade back'
    ],
    targetMuscles: ['back', 'lats', 'biceps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dumbbell_chest_press': {
    id: 'dumbbell_chest_press',
    name: 'Dumbbell Chest Press',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Lie on bench or floor',
      'Lower dumbbells to chest level',
      'Elbows at 45-degree angle',
      'Press up and slightly together'
    ],
    modifications: 'Floor press version if no bench. More shoulder-friendly than barbell.',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dumbbell_shoulder_press': {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    formCues: [
      'Seated or standing',
      'Start at shoulder height',
      'Press straight overhead',
      'Don\'t let dumbbells drift forward'
    ],
    modifications: 'Skip if shoulder pain. Use bands instead.',
    targetMuscles: ['shoulders', 'triceps'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: false,
  },

  'dumbbell_rdl': {
    id: 'dumbbell_rdl',
    name: 'Dumbbell Romanian Deadlift',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 90,
    formCues: [
      'Dumbbells hang in front of thighs',
      'Hinge at hips, push butt back',
      'Lower dumbbells to mid-shin',
      'Feel hamstring stretch',
      'Stand by squeezing glutes'
    ],
    modifications: 'Easier to learn than barbell version',
    targetMuscles: ['hamstrings', 'glutes', 'lower back'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dumbbell_split_squat': {
    id: 'dumbbell_split_squat',
    name: 'Dumbbell Split Squat',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 60,
    formCues: [
      'Dumbbells at sides',
      'One foot forward, one back',
      'Lower back knee toward floor',
      'Front knee stays over ankle',
      'Excellent for balance and fall prevention'
    ],
    modifications: 'Hold wall for balance. Critical exercise for 50+ mobility.',
    targetMuscles: ['quads', 'glutes', 'balance'],
    difficulty: 'intermediate',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dumbbell_lateral_raise': {
    id: 'dumbbell_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 15,
    defaultRestSeconds: 45,
    formCues: [
      'Light weight, strict form',
      'Raise to shoulder height',
      'Lead with elbows, not hands',
      'Slight bend in elbows'
    ],
    targetMuscles: ['shoulders'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'dumbbell_hammer_curl': {
    id: 'dumbbell_hammer_curl',
    name: 'Dumbbell Hammer Curl',
    equipment: 'dumbbells',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 12,
    defaultRestSeconds: 60,
    formCues: [
      'Palms facing each other (neutral grip)',
      'Curl dumbbells to shoulders',
      'Keep elbows stationary',
      'Easier on wrists than supinated curls'
    ],
    targetMuscles: ['biceps', 'forearms', 'brachialis'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  // ROTATIONAL CORE
  'cable_woodchop': {
    id: 'cable_woodchop',
    name: 'Cable Woodchop',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 45,
    formCues: [
      'Cable high, pull down and across',
      'Rotate through torso',
      'Keep arms extended',
      'Control the return'
    ],
    modifications: 'Critical for rotational strength and core stability',
    targetMuscles: ['obliques', 'core rotation'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'cable_pallof_press': {
    id: 'cable_pallof_press',
    name: 'Pallof Press',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 45,
    formCues: [
      'Cable at chest height',
      'Stand perpendicular to cable',
      'Press straight out',
      'Resist rotation',
      'Hold for 2 seconds'
    ],
    modifications: 'THE best anti-rotation core exercise',
    targetMuscles: ['core', 'obliques', 'anti-rotation'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'band_rotation': {
    id: 'band_rotation',
    name: 'Standing Band Rotation',
    equipment: 'resistance_bands',
    phase: 'strength',
    defaultSets: 2,
    defaultReps: 12,
    defaultRestSeconds: 45,
    formCues: [
      'Band at chest height',
      'Rotate away from anchor',
      'Keep hips facing forward',
      'Arms extended'
    ],
    targetMuscles: ['obliques', 'core rotation'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  // SCAPULAR STABILITY
  'cable_face_pull': {
    id: 'cable_face_pull',
    name: 'Cable Face Pull',
    equipment: 'cables',
    phase: 'strength',
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    formCues: [
      'Cable at face height',
      'Pull rope to face',
      'Elbows high and wide',
      'Squeeze shoulder blades together',
      'CRITICAL for shoulder health'
    ],
    modifications: 'Do this exercise often! Counteracts rowing/desk posture.',
    targetMuscles: ['rear delts', 'rhomboids', 'traps'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'band_pull_apart': {
    id: 'band_pull_apart',
    name: 'Band Pull-Apart',
    equipment: 'resistance_bands',
    phase: 'warmup',
    defaultSets: 2,
    defaultReps: 20,
    defaultRestSeconds: 30,
    formCues: [
      'Hold band at chest height',
      'Pull band apart to chest',
      'Squeeze shoulder blades',
      'Slow and controlled'
    ],
    modifications: 'Excellent warmup for shoulders. Do before rowing.',
    targetMuscles: ['rear delts', 'rhomboids', 'scapular stability'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'band_ytwl': {
    id: 'band_ytwl',
    name: 'Band YTWL',
    equipment: 'resistance_bands',
    phase: 'warmup',
    defaultSets: 1,
    defaultReps: 10,
    defaultRestSeconds: 30,
    formCues: [
      'Bend forward 45 degrees',
      'Form Y, T, W, L shapes with arms',
      'Light band, high reps',
      'Focus on squeezing shoulder blades'
    ],
    modifications: 'Physical therapy exercise for shoulder stability',
    targetMuscles: ['shoulders', 'scapular stabilizers', 'rotator cuff'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  // COOLDOWN STRETCHES
  'hip_flexor_stretch': {
    id: 'hip_flexor_stretch',
    name: 'Kneeling Hip Flexor Stretch',
    equipment: 'bodyweight',
    phase: 'cooldown',
    defaultSets: 1,
    defaultReps: 0,
    defaultRestSeconds: 0,
    formCues: [
      'Kneel on one knee',
      'Push hips forward',
      'Feel stretch in front of hip',
      'Hold 30-60 seconds each side'
    ],
    modifications: 'Critical for desk workers and people who sit. Hold 60 seconds.',
    targetMuscles: ['hip flexors'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'hamstring_stretch': {
    id: 'hamstring_stretch',
    name: 'Standing Hamstring Stretch',
    equipment: 'bodyweight',
    phase: 'cooldown',
    defaultSets: 1,
    defaultReps: 0,
    defaultRestSeconds: 0,
    formCues: [
      'Place heel on low bench or step',
      'Hinge forward at hips',
      'Keep back straight',
      'Hold 30-60 seconds each leg'
    ],
    targetMuscles: ['hamstrings'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'chest_doorway_stretch': {
    id: 'chest_doorway_stretch',
    name: 'Doorway Chest Stretch',
    equipment: 'bodyweight',
    phase: 'cooldown',
    defaultSets: 1,
    defaultReps: 0,
    defaultRestSeconds: 0,
    formCues: [
      'Arm on doorframe at shoulder height',
      'Step forward, lean into stretch',
      'Feel stretch across chest',
      'Hold 30-60 seconds each side'
    ],
    modifications: 'Counteracts rounded shoulders from desk work',
    targetMuscles: ['chest', 'front shoulders'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'shoulder_cross_body_stretch': {
    id: 'shoulder_cross_body_stretch',
    name: 'Cross-Body Shoulder Stretch',
    equipment: 'bodyweight',
    phase: 'cooldown',
    defaultSets: 1,
    defaultReps: 0,
    defaultRestSeconds: 0,
    formCues: [
      'Pull arm across chest',
      'Use other arm to pull gently',
      'Keep shoulders down',
      'Hold 30 seconds each side'
    ],
    targetMuscles: ['shoulders', 'rear delts'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'cat_cow_stretch': {
    id: 'cat_cow_stretch',
    name: 'Cat-Cow Stretch',
    equipment: 'bodyweight',
    phase: 'cooldown',
    defaultSets: 1,
    defaultReps: 10,
    defaultRestSeconds: 0,
    formCues: [
      'On hands and knees',
      'Arch back (cow), then round back (cat)',
      'Slow, flowing movement',
      '10 repetitions'
    ],
    modifications: 'Excellent for spine mobility',
    targetMuscles: ['spine', 'core'],
    difficulty: 'beginner',
    kneeFriendly: true,
    shoulderFriendly: true,
  },

  'child_pose': {
    id: 'child_pose',
    name: 'Child\'s Pose',
    equipment: 'bodyweight',
    phase: 'cooldown',
    defaultSets: 1,
    defaultReps: 0,
    defaultRestSeconds: 0,
    formCues: [
      'Kneel, sit back on heels',
      'Reach arms forward on ground',
      'Rest forehead on floor',
      'Hold 60 seconds, breathe deeply'
    ],
    modifications: 'Relaxing stretch for entire back and shoulders',
    targetMuscles: ['back', 'shoulders', 'hips'],
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
  'barbell',
  'ez_bar',
  'dumbbells',
  'stability_ball',
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
