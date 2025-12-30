// CheckIn Model - WatermelonDB

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, json } from '@nozbe/watermelondb/decorators';
import { CheckIn as CheckInType, PhysicalState, MentalCheck, EmotionalCheck } from '@/types/checkin';

export default class CheckIn extends Model {
  static table = 'check_ins';

  @date('date') date!: Date;
  
  // Physical
  @field('physical_knee') physicalKnee!: number;
  @field('physical_shoulder') physicalShoulder!: number;
  @field('physical_energy') physicalEnergy!: number;
  @field('physical_sleep') physicalSleep!: number;
  @field('physical_weight') physicalWeight?: number;
  
  // Mental
  @field('mental_state') mentalState!: string;
  @field('mental_stress') mentalStress!: number;
  @field('mental_clarity') mentalClarity!: number;
  @field('mental_notes') mentalNotes?: string;
  
  // Emotional
  @field('emotional_primary') emotionalPrimary!: string;
  @field('emotional_intensity') emotionalIntensity!: number;
  @field('emotional_notes') emotionalNotes?: string;
  
  @readonly @date('created_at') createdAt!: Date;
  @date('synced_at') syncedAt?: Date;
  
  // Convert to CheckIn type
  toCheckIn(): CheckInType {
    return {
      id: this.id,
      date: this.date,
      physical: {
        knee: this.physicalKnee,
        shoulder: this.physicalShoulder,
        energy: this.physicalEnergy,
        sleep: this.physicalSleep,
        weight: this.physicalWeight,
      },
      mental: {
        state: this.mentalState as any,
        stress: this.mentalStress,
        clarity: this.mentalClarity,
        notes: this.mentalNotes,
      },
      emotional: {
        primary: this.emotionalPrimary as any,
        intensity: this.emotionalIntensity,
        notes: this.emotionalNotes,
      },
      createdAt: this.createdAt,
    };
  }
}
