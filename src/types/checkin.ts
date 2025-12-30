// Check-In Types

export interface PhysicalState {
  knee: number; // 1-10 scale
  shoulder: number; // 1-10 scale
  energy: number; // 1-10 scale
  sleep: number; // 1-10 scale (hours or quality)
  weight?: number; // optional daily weight
}

export type MentalState = 'clear' | 'anxious' | 'foggy' | 'heavy' | 'overwhelmed';

export interface MentalCheck {
  state: MentalState;
  stress: number; // 1-10 scale
  clarity: number; // 1-10 scale
  notes?: string;
}

export type EmotionalState = 'peaceful' | 'anxious' | 'frustrated' | 'sad' | 'joyful' | 'numb';

export interface EmotionalCheck {
  primary: EmotionalState;
  intensity: number; // 1-10 scale
  secondary?: EmotionalState[];
  notes?: string;
}

export interface CheckIn {
  id: string;
  date: Date;
  physical: PhysicalState;
  mental: MentalCheck;
  emotional: EmotionalCheck;
  createdAt: Date;
}

export interface CheckInResponse {
  checkIn: CheckIn;
  analysis: string;
  recommendations: string[];
  workoutAdjustments: string[];
}
