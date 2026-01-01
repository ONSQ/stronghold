// Firestore Service - Data persistence layer
// Uses @react-native-firebase (requires development build, not compatible with Expo Go)
// For Expo Go testing, data will be stored in memory only

import firestore from '@react-native-firebase/firestore';
import { CheckIn } from '@/types/checkin';
import { Workout } from '@/types/workout';

// Collection names
const COLLECTIONS = {
  CHECK_INS: 'check_ins',
  WORKOUTS: 'workouts',
  USER_DATA: 'user_data',
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

// ==================== CHECK-INS ====================

export const saveCheckIn = async (checkIn: CheckIn): Promise<string> => {
  try {
    const checkInData = {
      ...checkIn,
      date: firestore.Timestamp.fromDate(checkIn.date),
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await firestore()
      .collection(COLLECTIONS.CHECK_INS)
      .add(checkInData);

    console.log('Check-in saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw error;
  }
};

export const getTodayCheckIn = async (): Promise<CheckIn | null> => {
  try {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    const querySnapshot = await firestore()
      .collection(COLLECTIONS.CHECK_INS)
      .where('date', '>=', firestore.Timestamp.fromDate(todayStart))
      .where('date', '<=', firestore.Timestamp.fromDate(todayEnd))
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    } as CheckIn;
  } catch (error) {
    console.error('Error getting today\'s check-in:', error);
    return null;
  }
};

export const getRecentCheckIns = async (count: number = 7): Promise<CheckIn[]> => {
  try {
    const querySnapshot = await firestore()
      .collection(COLLECTIONS.CHECK_INS)
      .orderBy('date', 'desc')
      .limit(count)
      .get();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as CheckIn;
    });
  } catch (error) {
    console.error('Error getting recent check-ins:', error);
    return [];
  }
};

// ==================== WORKOUTS ====================

export const saveWorkout = async (workout: Workout): Promise<string> => {
  try {
    const workoutData = {
      ...workout,
      date: firestore.Timestamp.fromDate(workout.date),
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      completedAt: workout.completedAt ? firestore.Timestamp.fromDate(workout.completedAt) : null,
    };

    const docRef = await firestore()
      .collection(COLLECTIONS.WORKOUTS)
      .add(workoutData);

    console.log('Workout saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
};

export const updateWorkout = async (workoutId: string, updates: Partial<Workout>): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    // Convert Date fields to Timestamps
    if (updates.completedAt) {
      updateData.completedAt = firestore.Timestamp.fromDate(updates.completedAt);
    }
    if (updates.date) {
      updateData.date = firestore.Timestamp.fromDate(updates.date);
    }

    await firestore()
      .collection(COLLECTIONS.WORKOUTS)
      .doc(workoutId)
      .update(updateData);

    console.log('Workout updated:', workoutId);
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

export const getTodayWorkout = async (): Promise<Workout | null> => {
  try {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    const querySnapshot = await firestore()
      .collection(COLLECTIONS.WORKOUTS)
      .where('date', '>=', firestore.Timestamp.fromDate(todayStart))
      .where('date', '<=', firestore.Timestamp.fromDate(todayEnd))
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      completedAt: data.completedAt?.toDate(),
    } as Workout;
  } catch (error) {
    console.error('Error getting today\'s workout:', error);
    return null;
  }
};

export const getWorkoutById = async (workoutId: string): Promise<Workout | null> => {
  try {
    const doc = await firestore()
      .collection(COLLECTIONS.WORKOUTS)
      .doc(workoutId)
      .get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    if (!data) return null;

    return {
      ...data,
      id: doc.id,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      completedAt: data.completedAt?.toDate(),
    } as Workout;
  } catch (error) {
    console.error('Error getting workout by ID:', error);
    return null;
  }
};

export const getRecentWorkouts = async (count: number = 10): Promise<Workout[]> => {
  try {
    const querySnapshot = await firestore()
      .collection(COLLECTIONS.WORKOUTS)
      .orderBy('date', 'desc')
      .limit(count)
      .get();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
      } as Workout;
    });
  } catch (error) {
    console.error('Error getting recent workouts:', error);
    return [];
  }
};

export const getCompletedWorkouts = async (days: number = 30): Promise<Workout[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const querySnapshot = await firestore()
      .collection(COLLECTIONS.WORKOUTS)
      .where('completed', '==', true)
      .where('date', '>=', firestore.Timestamp.fromDate(startDate))
      .orderBy('date', 'desc')
      .get();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
      } as Workout;
    });
  } catch (error) {
    console.error('Error getting completed workouts:', error);
    return [];
  }
};

// ==================== USER DATA & STATS ====================

export const getUserStreak = async (userId: string = 'default'): Promise<number> => {
  try {
    // Get all completed workouts, ordered by date descending
    const workouts = await getCompletedWorkouts(365); // Check last year

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
    console.error('Error calculating streak:', error);
    return 0;
  }
};

export const getWeeklyWorkoutCount = async (): Promise<number> => {
  try {
    const workouts = await getCompletedWorkouts(7);
    return workouts.length;
  } catch (error) {
    console.error('Error getting weekly workout count:', error);
    return 0;
  }
};

export const getMonthlyWorkoutCount = async (): Promise<number> => {
  try {
    const workouts = await getCompletedWorkouts(30);
    return workouts.length;
  } catch (error) {
    console.error('Error getting monthly workout count:', error);
    return 0;
  }
};

// Export all functions as a service object
export const firestoreService = {
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
};
