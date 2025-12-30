// Workout Types

export type EquipmentType = 
  | 'rowing_machine'
  | 'resistance_bands' 
  | 'cables'
  | 'free_weights'
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
  postWorkout?: {
    physical: {
      knee: number;
      shoulder: number;
      overall: 'good' | 'tired' | 'exhausted';
    };
    mental: {
      state: string;
      clarity: number;
    };
    emotional: {
      primary: string;
    };
    notes?: string;
  };
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
