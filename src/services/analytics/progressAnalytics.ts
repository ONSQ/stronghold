// Progress Analytics Service - Data processing for progress visualization

import { CheckIn } from '@/types/checkin';
import { Workout } from '@/types/workout';
import { storageService } from '@/services/storage/asyncStorage';

// ==================== WORKOUT ANALYTICS ====================

export interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  weeklyAverage: number;
  monthlyTotal: number;
  completionRate: number; // percentage of workouts completed vs generated
}

export interface WeeklyData {
  week: string; // e.g., "Dec 23-29"
  workouts: number;
}

export interface ExerciseStats {
  name: string;
  timesPerformed: number;
  avgDifficulty: number; // 1-4 scale (easy=1, pain=4)
  lastPerformed: Date;
  equipment: string;
}

// ==================== BODY METRICS ANALYTICS ====================

export interface BodyMetricTrend {
  date: Date;
  knee: number;
  shoulder: number;
  energy: number;
  sleep: number;
  weight?: number;
}

export interface BodyMetricsAnalysis {
  trends: BodyMetricTrend[];
  kneeImprovement: number; // percentage change
  shoulderImprovement: number;
  energyImprovement: number;
  sleepImprovement: number;
  avgKnee: number;
  avgShoulder: number;
  avgEnergy: number;
  avgSleep: number;
  weightTrend: { date: Date; weight: number }[]; // Separate weight tracking
  currentWeight?: number;
  startWeight?: number;
  weightChange?: number; // lbs lost/gained
}

// ==================== MENTAL/EMOTIONAL ANALYTICS ====================

export interface MentalStateCount {
  state: string;
  count: number;
  percentage: number;
}

export interface EmotionalStateCount {
  emotion: string;
  count: number;
  percentage: number;
}

export interface MentalEmotionalAnalysis {
  mentalStates: MentalStateCount[];
  emotionalStates: EmotionalStateCount[];
  avgStress: number;
  avgClarity: number;
  avgEmotionalIntensity: number;
  stressImprovement: number; // percentage change
  clarityImprovement: number;
}

// ==================== HELPER FUNCTIONS ====================

const getDaysDiff = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
};

const getWeekLabel = (date: Date): string => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day; // adjust to Sunday
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const format = (d: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  return `${format(startOfWeek)}-${format(endOfWeek)}`;
};

// ==================== WORKOUT STATS ====================

export const getWorkoutStats = async (days: number = 30): Promise<WorkoutStats> => {
  try {
    const allWorkouts = await storageService.getCompletedWorkouts(365);
    const recentWorkouts = allWorkouts.filter(w => {
      const workoutDate = new Date(w.date);
      const daysAgo = getDaysDiff(new Date(), workoutDate);
      return daysAgo <= days;
    });

    const totalWorkouts = recentWorkouts.length;
    const currentStreak = await storageService.getUserStreak();

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    allWorkouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
      } else {
        const diff = getDaysDiff(lastDate, workoutDate);
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      lastDate = workoutDate;
    });
    longestStreak = Math.max(longestStreak, tempStreak);

    // Weekly average
    const weeklyTotal = await storageService.getWeeklyWorkoutCount();
    const weeklyAverage = weeklyTotal;

    // Monthly total
    const monthlyTotal = await storageService.getMonthlyWorkoutCount();

    // Completion rate (completed vs total generated)
    const completionRate = totalWorkouts > 0 ? 100 : 0; // For now, all retrieved workouts are completed

    return {
      totalWorkouts,
      currentStreak,
      longestStreak,
      weeklyAverage,
      monthlyTotal,
      completionRate,
    };
  } catch (error) {
    console.error('Error calculating workout stats:', error);
    return {
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyAverage: 0,
      monthlyTotal: 0,
      completionRate: 0,
    };
  }
};

export const getWeeklyTrend = async (weeks: number = 4): Promise<WeeklyData[]> => {
  try {
    const workouts = await storageService.getCompletedWorkouts(weeks * 7);

    // Group workouts by week
    const weekMap = new Map<string, number>();

    workouts.forEach(workout => {
      const weekLabel = getWeekLabel(new Date(workout.date));
      weekMap.set(weekLabel, (weekMap.get(weekLabel) || 0) + 1);
    });

    // Convert to array and sort by date (most recent first)
    const weeklyData: WeeklyData[] = Array.from(weekMap.entries()).map(([week, workouts]) => ({
      week,
      workouts,
    }));

    return weeklyData.reverse(); // Most recent first
  } catch (error) {
    console.error('Error calculating weekly trend:', error);
    return [];
  }
};

export const getTopExercises = async (limit: number = 5): Promise<ExerciseStats[]> => {
  try {
    const workouts = await storageService.getCompletedWorkouts(90);

    // Map to track exercise stats
    const exerciseMap = new Map<string, {
      count: number;
      totalDifficulty: number;
      difficultyCount: number;
      lastPerformed: Date;
      equipment: string;
    }>();

    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.skipped) return;

        const existing = exerciseMap.get(exercise.name);

        // Calculate avg difficulty from sets
        const difficulties = exercise.sets
          .filter(s => s.difficulty)
          .map(s => {
            switch (s.difficulty) {
              case 'easy': return 1;
              case 'good': return 2;
              case 'hard': return 3;
              case 'pain': return 4;
              default: return 2;
            }
          });

        const totalDiff = difficulties.reduce((sum, d) => sum + d, 0);

        if (existing) {
          existing.count++;
          existing.totalDifficulty += totalDiff;
          existing.difficultyCount += difficulties.length;
          if (new Date(workout.date) > existing.lastPerformed) {
            existing.lastPerformed = new Date(workout.date);
          }
        } else {
          exerciseMap.set(exercise.name, {
            count: 1,
            totalDifficulty: totalDiff,
            difficultyCount: difficulties.length,
            lastPerformed: new Date(workout.date),
            equipment: exercise.equipment,
          });
        }
      });
    });

    // Convert to array and sort by count
    const exercises: ExerciseStats[] = Array.from(exerciseMap.entries())
      .map(([name, stats]) => ({
        name,
        timesPerformed: stats.count,
        avgDifficulty: stats.difficultyCount > 0 ? stats.totalDifficulty / stats.difficultyCount : 2,
        lastPerformed: stats.lastPerformed,
        equipment: stats.equipment,
      }))
      .sort((a, b) => b.timesPerformed - a.timesPerformed)
      .slice(0, limit);

    return exercises;
  } catch (error) {
    console.error('Error calculating top exercises:', error);
    return [];
  }
};

// ==================== BODY METRICS ====================

export const getBodyMetricsAnalysis = async (days: number = 30): Promise<BodyMetricsAnalysis> => {
  try {
    const checkIns = await storageService.getRecentCheckIns(days);

    if (checkIns.length === 0) {
      return {
        trends: [],
        kneeImprovement: 0,
        shoulderImprovement: 0,
        energyImprovement: 0,
        sleepImprovement: 0,
        avgKnee: 0,
        avgShoulder: 0,
        avgEnergy: 0,
        avgSleep: 0,
        weightTrend: [],
      };
    }

    // Create trends (sorted by date)
    const trends: BodyMetricTrend[] = checkIns
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(checkIn => ({
        date: new Date(checkIn.date),
        knee: checkIn.physical.knee,
        shoulder: checkIn.physical.shoulder,
        energy: checkIn.physical.energy,
        sleep: checkIn.physical.sleep,
        weight: checkIn.physical.weight,
      }));

    // Calculate averages
    const avgKnee = trends.reduce((sum, t) => sum + t.knee, 0) / trends.length;
    const avgShoulder = trends.reduce((sum, t) => sum + t.shoulder, 0) / trends.length;
    const avgEnergy = trends.reduce((sum, t) => sum + t.energy, 0) / trends.length;
    const avgSleep = trends.reduce((sum, t) => sum + t.sleep, 0) / trends.length;

    // Calculate improvements (first week vs last week)
    const firstWeek = trends.slice(0, Math.min(7, trends.length));
    const lastWeek = trends.slice(-Math.min(7, trends.length));

    const calcImprovement = (metric: keyof Omit<BodyMetricTrend, 'date' | 'weight'>) => {
      const firstAvg = firstWeek.reduce((sum, t) => sum + t[metric], 0) / firstWeek.length;
      const lastAvg = lastWeek.reduce((sum, t) => sum + t[metric], 0) / lastWeek.length;
      return ((lastAvg - firstAvg) / firstAvg) * 100;
    };

    // Process weight data
    const weightTrend = trends
      .filter(t => t.weight !== undefined)
      .map(t => ({ date: t.date, weight: t.weight! }));

    let currentWeight: number | undefined;
    let startWeight: number | undefined;
    let weightChange: number | undefined;

    if (weightTrend.length > 0) {
      currentWeight = weightTrend[weightTrend.length - 1].weight;
      startWeight = weightTrend[0].weight;
      weightChange = currentWeight - startWeight;
    }

    return {
      trends,
      kneeImprovement: calcImprovement('knee'),
      shoulderImprovement: calcImprovement('shoulder'),
      energyImprovement: calcImprovement('energy'),
      sleepImprovement: calcImprovement('sleep'),
      avgKnee,
      avgShoulder,
      avgEnergy,
      avgSleep,
      weightTrend,
      currentWeight,
      startWeight,
      weightChange,
    };
  } catch (error) {
    console.error('Error calculating body metrics:', error);
    return {
      trends: [],
      kneeImprovement: 0,
      shoulderImprovement: 0,
      energyImprovement: 0,
      sleepImprovement: 0,
      avgKnee: 0,
      avgShoulder: 0,
      avgEnergy: 0,
      avgSleep: 0,
      weightTrend: [],
    };
  }
};

// ==================== MENTAL/EMOTIONAL ====================

export const getMentalEmotionalAnalysis = async (days: number = 30): Promise<MentalEmotionalAnalysis> => {
  try {
    const checkIns = await storageService.getRecentCheckIns(days);

    if (checkIns.length === 0) {
      return {
        mentalStates: [],
        emotionalStates: [],
        avgStress: 0,
        avgClarity: 0,
        avgEmotionalIntensity: 0,
        stressImprovement: 0,
        clarityImprovement: 0,
      };
    }

    // Count mental states
    const mentalMap = new Map<string, number>();
    const emotionalMap = new Map<string, number>();

    checkIns.forEach(checkIn => {
      mentalMap.set(checkIn.mental.state, (mentalMap.get(checkIn.mental.state) || 0) + 1);
      emotionalMap.set(checkIn.emotional.primary, (emotionalMap.get(checkIn.emotional.primary) || 0) + 1);
    });

    const mentalStates: MentalStateCount[] = Array.from(mentalMap.entries()).map(([state, count]) => ({
      state,
      count,
      percentage: (count / checkIns.length) * 100,
    }));

    const emotionalStates: EmotionalStateCount[] = Array.from(emotionalMap.entries()).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: (count / checkIns.length) * 100,
    }));

    // Calculate averages
    const avgStress = checkIns.reduce((sum, c) => sum + c.mental.stress, 0) / checkIns.length;
    const avgClarity = checkIns.reduce((sum, c) => sum + c.mental.clarity, 0) / checkIns.length;
    const avgEmotionalIntensity = checkIns.reduce((sum, c) => sum + c.emotional.intensity, 0) / checkIns.length;

    // Calculate improvements
    const sortedByDate = checkIns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstWeek = sortedByDate.slice(0, Math.min(7, sortedByDate.length));
    const lastWeek = sortedByDate.slice(-Math.min(7, sortedByDate.length));

    const firstStress = firstWeek.reduce((sum, c) => sum + c.mental.stress, 0) / firstWeek.length;
    const lastStress = lastWeek.reduce((sum, c) => sum + c.mental.stress, 0) / lastWeek.length;
    const stressImprovement = ((firstStress - lastStress) / firstStress) * 100; // Lower is better

    const firstClarity = firstWeek.reduce((sum, c) => sum + c.mental.clarity, 0) / firstWeek.length;
    const lastClarity = lastWeek.reduce((sum, c) => sum + c.mental.clarity, 0) / lastWeek.length;
    const clarityImprovement = ((lastClarity - firstClarity) / firstClarity) * 100; // Higher is better

    return {
      mentalStates,
      emotionalStates,
      avgStress,
      avgClarity,
      avgEmotionalIntensity,
      stressImprovement,
      clarityImprovement,
    };
  } catch (error) {
    console.error('Error calculating mental/emotional analysis:', error);
    return {
      mentalStates: [],
      emotionalStates: [],
      avgStress: 0,
      avgClarity: 0,
      avgEmotionalIntensity: 0,
      stressImprovement: 0,
      clarityImprovement: 0,
    };
  }
};

// Export all analytics functions
export const progressAnalytics = {
  getWorkoutStats,
  getWeeklyTrend,
  getTopExercises,
  getBodyMetricsAnalysis,
  getMentalEmotionalAnalysis,
};
