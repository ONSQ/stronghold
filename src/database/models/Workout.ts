// Workout Model - WatermelonDB

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, json } from '@nozbe/watermelondb/decorators';
import { Workout as WorkoutType, Exercise } from '@/types/workout';

function sanitizeExercises(raw: any): Exercise[] {
  if (typeof raw === 'string') {
    return JSON.parse(raw);
  }
  return raw || [];
}

function sanitizePostWorkout(raw: any): any {
  if (typeof raw === 'string') {
    return JSON.parse(raw);
  }
  return raw || null;
}

export default class Workout extends Model {
  static table = 'workouts';

  @date('date') date!: Date;
  @field('type') type!: string;
  @field('estimated_duration') estimatedDuration!: number;
  @field('actual_duration') actualDuration?: number;
  @field('reasoning') reasoning!: string;
  @json('exercises', sanitizeExercises) exercises!: Exercise[];
  @field('completed') completed!: boolean;
  @date('completed_at') completedAt?: Date;
  @field('coaching_notes') coachingNotes?: string;
  @field('check_in_id') checkInId?: string;
  @json('post_workout', sanitizePostWorkout) postWorkout?: any;
  
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('synced_at') syncedAt?: Date;
  
  // Convert to Workout type
  toWorkout(): WorkoutType {
    return {
      id: this.id,
      date: this.date,
      type: this.type as any,
      estimatedDuration: this.estimatedDuration,
      actualDuration: this.actualDuration,
      reasoning: this.reasoning,
      exercises: this.exercises,
      completed: this.completed,
      completedAt: this.completedAt,
      coachingNotes: this.coachingNotes,
      checkInId: this.checkInId,
      postWorkout: this.postWorkout,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
