// Progress & Analytics Screen

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import { progressAnalytics, WorkoutStats, WeeklyData, ExerciseStats, BodyMetricsAnalysis, MentalEmotionalAnalysis } from '@/services/analytics/progressAnalytics';

export default function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyData[]>([]);
  const [topExercises, setTopExercises] = useState<ExerciseStats[]>([]);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetricsAnalysis | null>(null);
  const [mentalEmotional, setMentalEmotional] = useState<MentalEmotionalAnalysis | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'body' | 'mind'>('overview');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const [stats, weekly, exercises, body, mental] = await Promise.all([
        progressAnalytics.getWorkoutStats(30),
        progressAnalytics.getWeeklyTrend(4),
        progressAnalytics.getTopExercises(5),
        progressAnalytics.getBodyMetricsAnalysis(30),
        progressAnalytics.getMentalEmotionalAnalysis(30),
      ]);

      setWorkoutStats(stats);
      setWeeklyTrend(weekly);
      setTopExercises(exercises);
      setBodyMetrics(body);
      setMentalEmotional(mental);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <>
      {/* Workout Stats Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats?.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statEmoji}>🔥</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats?.longestStreak || 0}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
          <Text style={styles.statEmoji}>🏆</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats?.weeklyAverage || 0}</Text>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statEmoji}>📅</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats?.monthlyTotal || 0}</Text>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statEmoji}>📊</Text>
        </Card>
      </View>

      {/* Weekly Trend */}
      {weeklyTrend.length > 0 && (
        <Card style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weekly Trend</Text>
          <View style={styles.weeklyChart}>
            {weeklyTrend.map((week, index) => (
              <View key={index} style={styles.weekColumn}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${Math.min((week.workouts / 7) * 100, 100)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.weekLabel}>{week.week}</Text>
                <Text style={styles.weekValue}>{week.workouts}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Top Exercises */}
      {topExercises.length > 0 && (
        <Card style={styles.chartCard}>
          <Text style={styles.cardTitle}>Most Performed Exercises</Text>
          {topExercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseRow}>
              <View style={styles.exerciseRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseEquipment}>{exercise.equipment.replace('_', ' ')}</Text>
              </View>
              <View style={styles.exerciseStats}>
                <Text style={styles.exerciseCount}>{exercise.timesPerformed}x</Text>
                <View style={styles.difficultyDots}>
                  {[1, 2, 3, 4].map(i => (
                    <View
                      key={i}
                      style={[
                        styles.difficultyDot,
                        i <= exercise.avgDifficulty && styles.difficultyDotActive
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </Card>
      )}
    </>
  );

  const renderBodyTab = () => (
    <>
      {/* Body Metrics Summary */}
      {bodyMetrics && bodyMetrics.trends.length > 0 ? (
        <>
          {/* Weight Tracking - Always show when there are check-ins */}
          <Card style={[styles.chartCard, styles.weightCard]}>
            {bodyMetrics.currentWeight !== undefined ? (
              <>
                <View style={styles.weightHeader}>
                  <Text style={styles.cardTitle}>⚖️ Body Weight</Text>
                  <View style={styles.weightBadge}>
                    <Text style={styles.weightCurrent}>{bodyMetrics.currentWeight.toFixed(1)} lbs</Text>
                  </View>
                </View>
                {bodyMetrics.weightChange !== undefined && bodyMetrics.weightChange !== 0 && (
                  <View style={styles.weightChangeContainer}>
                    <Text style={[
                      styles.weightChange,
                      bodyMetrics.weightChange < 0 && styles.weightChangeLoss
                    ]}>
                      {bodyMetrics.weightChange > 0 ? '+' : ''}{bodyMetrics.weightChange.toFixed(1)} lbs
                    </Text>
                    <Text style={styles.weightChangeLabel}>
                      {bodyMetrics.weightChange < 0 ? 'Lost' : 'Gained'} since start
                    </Text>
                  </View>
                )}
                {bodyMetrics.weightTrend.length > 1 && (
                  <View style={styles.weightTrendContainer}>
                    <Text style={styles.weightTrendTitle}>30-Day Trend</Text>
                    <View style={styles.weightSparkline}>
                      {bodyMetrics.weightTrend.map((point, index) => {
                        const minWeight = Math.min(...bodyMetrics.weightTrend.map(p => p.weight));
                        const maxWeight = Math.max(...bodyMetrics.weightTrend.map(p => p.weight));
                        const range = maxWeight - minWeight || 1;
                        const heightPercent = ((point.weight - minWeight) / range) * 100;

                        return (
                          <View key={index} style={styles.sparklineBar}>
                            <View
                              style={[
                                styles.sparklineBarFill,
                                {
                                  height: `${Math.max(heightPercent, 10)}%`,
                                  backgroundColor: index === bodyMetrics.weightTrend.length - 1
                                    ? colors.accent
                                    : colors.primary,
                                }
                              ]}
                            />
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>⚖️ Body Weight Tracking</Text>
                <View style={styles.emptyWeightState}>
                  <Text style={styles.emptyWeightIcon}>⚖️</Text>
                  <Text style={styles.emptyWeightTitle}>Start Tracking Your Weight</Text>
                  <Text style={styles.emptyWeightText}>
                    Enter your weight during check-ins to track your progress over time and see trends in your weight loss/gain journey.
                  </Text>
                </View>
              </>
            )}
          </Card>

          <View style={styles.statsGrid}>
            <Card style={styles.metricCard}>
              <Text style={styles.metricIcon}>🦵</Text>
              <Text style={styles.metricValue}>{bodyMetrics.avgKnee.toFixed(1)}/10</Text>
              <Text style={styles.metricLabel}>Avg Knee</Text>
              {bodyMetrics.kneeImprovement !== 0 && (
                <Text style={[styles.improvement, bodyMetrics.kneeImprovement > 0 && styles.improvementPositive]}>
                  {bodyMetrics.kneeImprovement > 0 ? '↑' : '↓'} {Math.abs(bodyMetrics.kneeImprovement).toFixed(0)}%
                </Text>
              )}
            </Card>
            <Card style={styles.metricCard}>
              <Text style={styles.metricIcon}>💪</Text>
              <Text style={styles.metricValue}>{bodyMetrics.avgShoulder.toFixed(1)}/10</Text>
              <Text style={styles.metricLabel}>Avg Shoulder</Text>
              {bodyMetrics.shoulderImprovement !== 0 && (
                <Text style={[styles.improvement, bodyMetrics.shoulderImprovement > 0 && styles.improvementPositive]}>
                  {bodyMetrics.shoulderImprovement > 0 ? '↑' : '↓'} {Math.abs(bodyMetrics.shoulderImprovement).toFixed(0)}%
                </Text>
              )}
            </Card>
            <Card style={styles.metricCard}>
              <Text style={styles.metricIcon}>⚡</Text>
              <Text style={styles.metricValue}>{bodyMetrics.avgEnergy.toFixed(1)}/10</Text>
              <Text style={styles.metricLabel}>Avg Energy</Text>
              {bodyMetrics.energyImprovement !== 0 && (
                <Text style={[styles.improvement, bodyMetrics.energyImprovement > 0 && styles.improvementPositive]}>
                  {bodyMetrics.energyImprovement > 0 ? '↑' : '↓'} {Math.abs(bodyMetrics.energyImprovement).toFixed(0)}%
                </Text>
              )}
            </Card>
          </View>

          {/* Body Health Metrics */}
          <Card style={styles.chartCard}>
            <Text style={styles.cardTitle}>Body Health Metrics (30 Days)</Text>
            <View style={styles.trendLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Knee</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>Shoulder</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accentGreen }]} />
                <Text style={styles.legendText}>Energy</Text>
              </View>
            </View>
            <Text style={styles.trendNote}>
              Monitor your joint health and energy levels. Higher scores indicate better conditioning and reduced pain.
            </Text>
          </Card>
        </>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>📋</Text>
          <Text style={styles.emptyTitle}>No Check-Ins Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete your daily check-ins to track body metrics, weight progress, and see how your fitness journey impacts your physical health.
          </Text>
        </Card>
      )}
    </>
  );

  const renderMindTab = () => (
    <>
      {/* Mental/Emotional Summary */}
      {mentalEmotional && mentalEmotional.mentalStates.length > 0 ? (
        <>
          <View style={styles.statsGrid}>
            <Card style={styles.metricCard}>
              <Text style={styles.metricIcon}>🧠</Text>
              <Text style={styles.metricValue}>{mentalEmotional.avgClarity.toFixed(1)}/10</Text>
              <Text style={styles.metricLabel}>Avg Clarity</Text>
              {mentalEmotional.clarityImprovement !== 0 && (
                <Text style={[styles.improvement, mentalEmotional.clarityImprovement > 0 && styles.improvementPositive]}>
                  {mentalEmotional.clarityImprovement > 0 ? '↑' : '↓'} {Math.abs(mentalEmotional.clarityImprovement).toFixed(0)}%
                </Text>
              )}
            </Card>
            <Card style={styles.metricCard}>
              <Text style={styles.metricIcon}>😰</Text>
              <Text style={styles.metricValue}>{mentalEmotional.avgStress.toFixed(1)}/10</Text>
              <Text style={styles.metricLabel}>Avg Stress</Text>
              {mentalEmotional.stressImprovement !== 0 && (
                <Text style={[styles.improvement, mentalEmotional.stressImprovement > 0 && styles.improvementPositive]}>
                  {mentalEmotional.stressImprovement > 0 ? '↓' : '↑'} {Math.abs(mentalEmotional.stressImprovement).toFixed(0)}%
                </Text>
              )}
            </Card>
          </View>

          {/* Mental States */}
          <Card style={styles.chartCard}>
            <Text style={styles.cardTitle}>Mental State Distribution</Text>
            {mentalEmotional.mentalStates
              .sort((a, b) => b.count - a.count)
              .map((state, index) => (
                <View key={index} style={styles.stateRow}>
                  <Text style={styles.stateName}>{state.state}</Text>
                  <View style={styles.stateBar}>
                    <View
                      style={[
                        styles.stateBarFill,
                        { width: `${state.percentage}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.statePercent}>{state.percentage.toFixed(0)}%</Text>
                </View>
              ))}
          </Card>

          {/* Emotional States */}
          <Card style={styles.chartCard}>
            <Text style={styles.cardTitle}>Emotional State Distribution</Text>
            {mentalEmotional.emotionalStates
              .sort((a, b) => b.count - a.count)
              .map((state, index) => (
                <View key={index} style={styles.stateRow}>
                  <Text style={styles.stateName}>{state.emotion}</Text>
                  <View style={styles.stateBar}>
                    <View
                      style={[
                        styles.stateBarFill,
                        { width: `${state.percentage}%`, backgroundColor: colors.accent }
                      ]}
                    />
                  </View>
                  <Text style={styles.statePercent}>{state.percentage.toFixed(0)}%</Text>
                </View>
              ))}
          </Card>
        </>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>🧠</Text>
          <Text style={styles.emptyTitle}>No Check-Ins Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete your daily check-ins to track mental clarity, stress levels, and emotional patterns over time.
          </Text>
        </Card>
      )}
    </>
  );

  const hasData = workoutStats && workoutStats.totalWorkouts > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.titleIcon}>📈</Text> Progress
        </Text>
        <Text style={styles.subtitle}>Track your journey</Text>
      </View>

      {!hasData ? (
        <>
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>📊</Text>
            <Text style={styles.emptyTitle}>Building Your Story</Text>
            <Text style={styles.emptySubtitle}>
              Complete a few workouts to see your progress and patterns
            </Text>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 What You'll See Here</Text>
            <Text style={styles.infoText}>
              • Workout streaks and consistency tracking{'\n'}
              • Body weight tracking and loss/gain trends{'\n'}
              • Body metrics (knee, shoulder, energy levels){'\n'}
              • Mental and emotional state patterns{'\n'}
              • Most performed exercises and difficulty{'\n'}
              • AI-powered insights and recommendations
            </Text>
          </Card>
        </>
      ) : (
        <>
          {/* Tab Navigation */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
              onPress={() => setSelectedTab('overview')}
            >
              <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'body' && styles.tabActive]}
              onPress={() => setSelectedTab('body')}
            >
              <Text style={[styles.tabText, selectedTab === 'body' && styles.tabTextActive]}>
                Body
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'mind' && styles.tabActive]}
              onPress={() => setSelectedTab('mind')}
            >
              <Text style={[styles.tabText, selectedTab === 'mind' && styles.tabTextActive]}>
                Mind
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'overview' && renderOverviewTab()}
          {selectedTab === 'body' && renderBodyTab()}
          {selectedTab === 'mind' && renderMindTab()}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: -1,
  },
  titleIcon: {
    color: colors.accent,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },

  // Empty state
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundCardHighlight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.backgroundCardHighlight,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundCardHighlight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontWeight: fontWeight.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  statEmoji: {
    fontSize: fontSize.xl,
    marginTop: spacing.xs,
  },

  // Charts
  chartCard: {
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },

  // Weekly chart
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    marginTop: spacing.md,
  },
  weekColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  barContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  bar: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xs,
    minHeight: 4,
  },
  weekLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  weekValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginTop: spacing.xs / 2,
  },

  // Exercise list
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseRank: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rankNumber: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  exerciseEquipment: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textTransform: 'capitalize',
  },
  exerciseStats: {
    alignItems: 'flex-end',
  },
  exerciseCount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  difficultyDots: {
    flexDirection: 'row',
    gap: spacing.xs / 2,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
  },
  difficultyDotActive: {
    backgroundColor: colors.primary,
  },

  // Body metrics
  metricCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCardHighlight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricIcon: {
    fontSize: fontSize.xxxl,
    marginBottom: spacing.sm,
  },
  metricValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.text,
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontWeight: fontWeight.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
  improvement: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold as any,
    color: colors.error,
    marginTop: spacing.xs,
  },
  improvementPositive: {
    color: colors.accentGreen,
  },

  // Trend legend
  trendLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },
  legendText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium as any,
  },
  trendNote: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    lineHeight: 20,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },

  // Mental/emotional states
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stateName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.text,
    width: 100,
    textTransform: 'capitalize',
  },
  stateBar: {
    flex: 1,
    height: 24,
    backgroundColor: colors.backgroundElevated,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  stateBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  statePercent: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.textSecondary,
    width: 40,
    textAlign: 'right',
  },

  // Weight tracking
  weightCard: {
    backgroundColor: colors.backgroundCardHighlight,
    borderLeftColor: colors.accentGreen,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  weightBadge: {
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weightCurrent: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.accentGreen,
    letterSpacing: -0.5,
  },
  weightChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  weightChange: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.warning,
  },
  weightChangeLoss: {
    color: colors.accentGreen,
  },
  weightChangeLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  weightTrendContainer: {
    marginTop: spacing.md,
  },
  weightTrendTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weightSparkline: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'flex-end',
    gap: spacing.xs / 2,
  },
  sparklineBar: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  sparklineBarFill: {
    width: '100%',
    borderRadius: borderRadius.xs,
    minHeight: 4,
  },

  // Empty weight state
  emptyWeightState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyWeightIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyWeightTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyWeightText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
});
