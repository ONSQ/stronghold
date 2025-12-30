// Workout History Screen

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '@/theme/colors';
import Card from '@/components/ui/Card';

export default function WorkoutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Workout History</Text>
      <Text style={styles.subtitle}>Your recent workouts</Text>

      <Card style={styles.card}>
        <Text style={styles.emptyText}>📋</Text>
        <Text style={styles.emptyTitle}>No workouts yet</Text>
        <Text style={styles.emptySubtitle}>
          Complete your first check-in to get started!
        </Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Coming Soon</Text>
        <Text style={styles.infoText}>
          • Workout history & calendar view{'\n'}
          • Progress tracking{'\n'}
          • Personal records{'\n'}
          • Workout templates
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
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
  },
  infoCard: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '30',
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
