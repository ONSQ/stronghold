// AsyncStorage Service - Local data persistence (works with Expo Go)
// This is a simpler alternative to Firestore for development/testing

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckIn } from '@/types/checkin';
import { Workout } from '@/types/workout';

// Storage keys
const KEYS = {
  CHECK_INS: '@stronghold/check_ins',
  WORKOUTS: '@stronghold/workouts',
  USER_DATA: '@stronghold/user_data',
} as const;

// Helper to get today's date at midnight (for querying)
const getTodayStart = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Helper to get today's date at end of day
const getTodayEnd = (): Date => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
};

// Helper to check if date is today
const isToday = (date: Date): boolean => {
  const today = getTodayStart();
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate.getTime() === today.getTime();
};

// ==================== CHECK-INS ====================

export const saveCheckIn = async (checkIn: CheckIn): Promise<string> => {
  try {
    // Get existing check-ins
    const existingData = await AsyncStorage.getItem(KEYS.CHECK_INS);
    const checkIns: CheckIn[] = existingData ? JSON.parse(existingData) : [];

    // Add new check-in
    checkIns.push(checkIn);

    // Save back to storage
    await AsyncStorage.setItem(KEYS.CHECK_INS, JSON.stringify(checkIns));

    console.log('Check-in saved to AsyncStorage:', checkIn.id);
    return checkIn.id;
  } catch (error) {
    console.error('Error saving check-in to AsyncStorage:', error);
    throw error;
  }
};

export const getTodayCheckIn = async (): Promise<CheckIn | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CHECK_INS);
    if (!data) return null;

    const checkIns: CheckIn[] = JSON.parse(data);

    // Find today's check-in
    const todayCheckIn = checkIns.find(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return isToday(checkInDate);
    });

    return todayCheckIn || null;
  } catch (error) {
    console.error('Error getting today\'s check-in from AsyncStorage:', error);
    return null;
  }
};

export const getRecentCheckIns = async (count: number = 7): Promise<CheckIn[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CHECK_INS);
    if (!data) return [];

    const checkIns: CheckIn[] = JSON.parse(data);

    // Sort by date descending and take the most recent
    return checkIns
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  } catch (error) {
    console.error('Error getting recent check-ins from AsyncStorage:', error);
    return [];
  }
};

// ==================== WORKOUTS ====================

export const saveWorkout = async (workout: Workout): Promise<string> => {
  try {
    // Get existing workouts
    const existingData = await AsyncStorage.getItem(KEYS.WORKOUTS);
    const workouts: Workout[] = existingData ? JSON.parse(existingData) : [];

    // Add new workout
    workouts.push(workout);

    // Save back to storage
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));

    console.log('Workout saved to AsyncStorage:', workout.id);
    return workout.id;
  } catch (error) {
    console.error('Error saving workout to AsyncStorage:', error);
    throw error;
  }
};

export const updateWorkout = async (workoutId: string, updates: Partial<Workout>): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
    if (!data) throw new Error('No workouts found');

    const workouts: Workout[] = JSON.parse(data);
    const index = workouts.findIndex(w => w.id === workoutId);

    if (index === -1) throw new Error('Workout not found');

    // Update workout
    workouts[index] = {
      ...workouts[index],
      ...updates,
      updatedAt: new Date(),
    };

    // Save back
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));

    console.log('Workout updated in AsyncStorage:', workoutId);
  } catch (error) {
    console.error('Error updating workout in AsyncStorage:', error);
    throw error;
  }
};

export const getTodayWorkout = async (): Promise<Workout | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
    if (!data) return null;

    const workouts: Workout[] = JSON.parse(data);

    // Find today's workout
    const todayWorkout = workouts.find(workout => {
      const workoutDate = new Date(workout.date);
      return isToday(workoutDate);
    });

    return todayWorkout || null;
  } catch (error) {
    console.error('Error getting today\'s workout from AsyncStorage:', error);
    return null;
  }
};

export const getWorkoutById = async (workoutId: string): Promise<Workout | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
    if (!data) return null;

    const workouts: Workout[] = JSON.parse(data);
    return workouts.find(w => w.id === workoutId) || null;
  } catch (error) {
    console.error('Error getting workout by ID from AsyncStorage:', error);
    return null;
  }
};

export const getRecentWorkouts = async (count: number = 10): Promise<Workout[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
    if (!data) return [];

    const workouts: Workout[] = JSON.parse(data);

    // Sort by date descending and take the most recent
    return workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  } catch (error) {
    console.error('Error getting recent workouts from AsyncStorage:', error);
    return [];
  }
};

export const getCompletedWorkouts = async (days: number = 30): Promise<Workout[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
    if (!data) return [];

    const workouts: Workout[] = JSON.parse(data);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Filter completed workouts within date range
    return workouts
      .filter(workout => {
        const workoutDate = new Date(workout.date);
        return workout.completed && workoutDate >= startDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting completed workouts from AsyncStorage:', error);
    return [];
  }
};

// ==================== USER DATA & STATS ====================

export const getUserStreak = async (userId: string = 'default'): Promise<number> => {
  try {
    // Get all completed workouts
    const workouts = await getCompletedWorkouts(365);

    if (workouts.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if there's a workout today or yesterday (grace period)
    const mostRecentWorkout = workouts[0].date;
    const mostRecentDate = new Date(mostRecentWorkout);
    mostRecentDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((currentDate.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

    // If most recent workout is more than 1 day ago, streak is broken
    if (daysDiff > 1) return 0;

    // Count consecutive days with workouts
    let checkDate = new Date(mostRecentDate);

    for (const workout of workouts) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);

      const diff = Math.floor((checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diff === 0) {
        // Same day, count it
        streak++;
        continue;
      } else if (diff === 1) {
        // Next day back, continue streak
        streak++;
        checkDate = new Date(workoutDate);
      } else {
        // Gap in streak, stop counting
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak from AsyncStorage:', error);
    return 0;
  }
};

export const getWeeklyWorkoutCount = async (): Promise<number> => {
  try {
    const workouts = await getCompletedWorkouts(7);
    return workouts.length;
  } catch (error) {
    console.error('Error getting weekly workout count from AsyncStorage:', error);
    return 0;
  }
};

export const getMonthlyWorkoutCount = async (): Promise<number> => {
  try {
    const workouts = await getCompletedWorkouts(30);
    return workouts.length;
  } catch (error) {
    console.error('Error getting monthly workout count from AsyncStorage:', error);
    return 0;
  }
};

// ==================== DATA MANAGEMENT ====================

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.CHECK_INS,
      KEYS.WORKOUTS,
      KEYS.USER_DATA,
    ]);
    console.log('All data cleared from AsyncStorage');
  } catch (error) {
    console.error('Error clearing data from AsyncStorage:', error);
    throw error;
  }
};

export const clearTodayData = async (): Promise<void> => {
  try {
    // Get all check-ins and workouts
    const checkInsData = await AsyncStorage.getItem(KEYS.CHECK_INS);
    const workoutsData = await AsyncStorage.getItem(KEYS.WORKOUTS);

    if (checkInsData) {
      const checkIns: CheckIn[] = JSON.parse(checkInsData);
      // Filter out today's check-ins
      const filtered = checkIns.filter(checkIn => {
        const checkInDate = new Date(checkIn.date);
        return !isToday(checkInDate);
      });
      await AsyncStorage.setItem(KEYS.CHECK_INS, JSON.stringify(filtered));
    }

    if (workoutsData) {
      const workouts: Workout[] = JSON.parse(workoutsData);
      // Filter out today's workouts
      const filtered = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return !isToday(workoutDate);
      });
      await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(filtered));
    }

    console.log('Today\'s data cleared from AsyncStorage');
  } catch (error) {
    console.error('Error clearing today\'s data from AsyncStorage:', error);
    throw error;
  }
};

// Export all functions as a service object
export const storageService = {
  // Check-ins
  saveCheckIn,
  getTodayCheckIn,
  getRecentCheckIns,

  // Workouts
  saveWorkout,
  updateWorkout,
  getTodayWorkout,
  getWorkoutById,
  getRecentWorkouts,
  getCompletedWorkouts,

  // Stats
  getUserStreak,
  getWeeklyWorkoutCount,
  getMonthlyWorkoutCount,

  // Data Management
  clearAllData,
  clearTodayData,
};
