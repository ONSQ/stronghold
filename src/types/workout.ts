// Workout Types

export type EquipmentType =
  | 'rowing_machine'
  | 'resistance_bands'
  | 'cables'
  | 'barbell'
  | 'ez_bar'
  | 'dumbbells'
  | 'stability_ball'
  | 'bodyweight';

export type WorkoutType = 
  | 'upper_body'
  | 'lower_body'
  | 'full_body'
  | 'cardio'
  | 'recovery';

export type WorkoutPhase = 'warmup' | 'strength' | 'cardio' | 'cooldown';

export type ExerciseDifficulty = 'easy' | 'good' | 'hard' | 'pain';

export type PostWorkoutOverall = 'energized' | 'good' | 'tired' | 'exhausted';
export type PostWorkoutMood = 'uplifted' | 'calm' | 'neutral' | 'drained' | 'frustrated';

export interface PostWorkoutCheck {
  physical: {
    knee: number; // 1-10 scale (how does knee feel after workout)
    shoulder: number; // 1-10 scale (how does shoulder feel after workout)
    overall: PostWorkoutOverall; // overall physical feeling
    energy: number; // 1-10 scale (energy level after workout)
  };
  mental: {
    clarity: number; // 1-10 scale (mental clarity after workout)
    stress: number; // 1-10 scale (stress level after workout)
    focus: number; // 1-10 scale (ability to focus after workout)
  };
  emotional: {
    mood: PostWorkoutMood; // primary mood after workout
    intensity: number; // 1-10 scale (how strong the mood is)
    outlook: number; // 1-10 scale (optimism about the day)
  };
  notes?: string; // optional notes about the workout experience
  completedAt: Date; // when the post-workout check was completed
}

export interface ExerciseSet {
  targetReps?: number;
  actualReps?: number;
  targetWeight?: number;
  actualWeight?: number;
  restSeconds: number;
  completed: boolean;
  difficulty?: ExerciseDifficulty;
  notes?: string;
  completedAt?: Date;
}

export interface Exercise {
  id: string;
  name: string;
  equipment: EquipmentType;
  phase: WorkoutPhase;
  sets: ExerciseSet[];
  formCues?: string[];
  modifications?: string;
  instructions?: string;
  duration?: number; // for timed exercises like rowing
  videoUrl?: string;
  skipped?: boolean;
  skipReason?: string;
  substitutedFrom?: string;
  targetMuscles?: string[]; // muscles targeted by this exercise
  safetyConsiderations?: string[]; // e.g., 'Knee Friendly', 'Shoulder Friendly'
}

export interface Workout {
  id: string;
  date: Date;
  type: WorkoutType;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  reasoning: string; // AI's explanation for this workout
  exercises: Exercise[];
  completed: boolean;
  completedAt?: Date;
  coachingNotes?: string;
  checkInId?: string; // link to morning check-in
  postWorkout?: PostWorkoutCheck;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlan {
  workout: Workout;
  aiAnalysis: string;
  warnings?: string[];
  alternatives?: Exercise[];
}

// Rowing-specific types
export interface RowingMetrics {
  distance: number; // meters
  time: number; // seconds
  spm: number; // strokes per minute
  resistance: number;
  calories: number;
  pace: number; // seconds per 500m
  avgHeartRate?: number;
  maxHeartRate?: number;
}

export interface RowingSession {
  id: string;
  workoutId?: string;
  startTime: Date;
  endTime: Date;
  metrics: RowingMetrics;
  notes?: string;
}
