// AI Service Types

import { CheckIn } from './checkin';
import { Workout, Exercise } from './workout';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface WorkoutGenerationPrompt {
  checkIn: CheckIn;
  userContext: UserContext;
  equipment: string[];
  limitations: string[];
}

export interface UserContext {
  age: number;
  weight: number;
  medications: string[];
  injuries: string[];
  equipment: string[];
  goals: string[];
  preferences: {
    workoutTime: string;
    notificationLevel: 'gentle' | 'moderate' | 'firm';
  };
}

export interface AICoachingResponse {
  message: string;
  tone: 'encouraging' | 'cautious' | 'celebratory' | 'corrective';
  actionable: boolean;
  suggestions?: string[];
}

export interface PatternInsight {
  id: string;
  type: 'correlation' | 'trend' | 'warning' | 'insight';
  title: string;
  description: string;
  confidence: number; // 0-1
  data: any;
  actionable: boolean;
  recommendation?: string;
  createdAt: Date;
}

export interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  workoutCount: number;
  totalMinutes: number;
  totalDistance: number; // meters rowed
  avgStress: number;
  stressReduction: number; // percentage
  patterns: PatternInsight[];
  aiNarrative: string;
  achievements: string[];
  recommendations: string[];
}
