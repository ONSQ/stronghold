// WatermelonDB Schema - Offline-First Database

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    // Check-Ins
    tableSchema({
      name: 'check_ins',
      columns: [
        { name: 'date', type: 'number', isIndexed: true },
        { name: 'physical_knee', type: 'number' },
        { name: 'physical_shoulder', type: 'number' },
        { name: 'physical_energy', type: 'number' },
        { name: 'physical_sleep', type: 'number' },
        { name: 'physical_weight', type: 'number', isOptional: true },
        { name: 'mental_state', type: 'string' },
        { name: 'mental_stress', type: 'number' },
        { name: 'mental_clarity', type: 'number' },
        { name: 'mental_notes', type: 'string', isOptional: true },
        { name: 'emotional_primary', type: 'string' },
        { name: 'emotional_intensity', type: 'number' },
        { name: 'emotional_notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ]
    }),
    
    // Workouts
    tableSchema({
      name: 'workouts',
      columns: [
        { name: 'date', type: 'number', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'estimated_duration', type: 'number' },
        { name: 'actual_duration', type: 'number', isOptional: true },
        { name: 'reasoning', type: 'string' },
        { name: 'exercises', type: 'string' }, // JSON
        { name: 'completed', type: 'boolean' },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'coaching_notes', type: 'string', isOptional: true },
        { name: 'check_in_id', type: 'string', isOptional: true },
        { name: 'post_workout', type: 'string', isOptional: true }, // JSON
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ]
    }),
    
    // Rowing Sessions
    tableSchema({
      name: 'rowing_sessions',
      columns: [
        { name: 'workout_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'start_time', type: 'number', isIndexed: true },
        { name: 'end_time', type: 'number' },
        { name: 'distance', type: 'number' },
        { name: 'avg_spm', type: 'number' },
        { name: 'avg_pace', type: 'number' },
        { name: 'resistance', type: 'number' },
        { name: 'calories', type: 'number' },
        { name: 'avg_heart_rate', type: 'number', isOptional: true },
        { name: 'max_heart_rate', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'synced_at', type: 'number', isOptional: true },
      ]
    }),
    
    // Biometric Data (from watch)
    tableSchema({
      name: 'biometric_data',
      columns: [
        { name: 'timestamp', type: 'number', isIndexed: true },
        { name: 'heart_rate', type: 'number', isOptional: true },
        { name: 'hrv', type: 'number', isOptional: true },
        { name: 'stress_level', type: 'number', isOptional: true },
        { name: 'steps', type: 'number', isOptional: true },
        { name: 'calories', type: 'number', isOptional: true },
        { name: 'sleep_minutes', type: 'number', isOptional: true },
        { name: 'source', type: 'string' }, // 'watch' or 'phone'
        { name: 'synced_at', type: 'number', isOptional: true },
      ]
    }),
    
    // AI Insights
    tableSchema({
      name: 'ai_insights',
      columns: [
        { name: 'date', type: 'number', isIndexed: true },
        { name: 'type', type: 'string' }, // 'pattern', 'recommendation', 'warning'
        { name: 'title', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'data', type: 'string' }, // JSON
        { name: 'confidence', type: 'number' },
        { name: 'actionable', type: 'boolean' },
        { name: 'recommendation', type: 'string', isOptional: true },
        { name: 'acknowledged', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    
    // User Settings
    tableSchema({
      name: 'user_settings',
      columns: [
        { name: 'key', type: 'string', isIndexed: true },
        { name: 'value', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
});
