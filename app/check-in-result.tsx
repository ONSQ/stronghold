// Check-In Result Screen - Shows AI analysis and Bible verse

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { BibleVerse, CheckIn } from '@/types/checkin';
import { bibleVerseGenerator } from '@/services/ai/bibleVerseGenerator';

export default function CheckInResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBibleVerse();
  }, []);

  const loadBibleVerse = async () => {
    try {
      // Parse check-in from params
      const checkIn: CheckIn = JSON.parse(params.checkIn as string);

      // Generate Bible verse based on mental/emotional state
      const generatedVerse = await bibleVerseGenerator.generateVerse(
        checkIn.mental.state,
        checkIn.emotional.primary,
        checkIn.mental.stress,
        checkIn.mental.clarity,
        checkIn.emotional.intensity
      );

      setVerse(generatedVerse);
    } catch (error) {
      console.error('Failed to load Bible verse:', error);
      // Continue without verse
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Navigate to workout
    router.push({
      pathname: '/workout/[id]',
      params: {
        id: params.workoutId,
        workout: params.workout,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Check-In Complete</Text>
          <Text style={styles.subtitle}>Your AI-powered workout is ready</Text>
        </View>

        {/* Analysis Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Today's Focus</Text>
          <Text style={styles.summaryText}>
            Based on your check-in, I've created a personalized workout that matches your physical, mental, and emotional state today.
          </Text>
        </Card>

        {/* Bible Verse */}
        {loading ? (
          <Card style={styles.verseCard}>
            <View style={styles.verseLoading}>
              <Text style={styles.verseLoadingText}>Finding your verse for today...</Text>
            </View>
          </Card>
        ) : verse ? (
          <Card style={styles.verseCard}>
            <View style={styles.verseHeader}>
              <Text style={styles.verseIcon}>📖</Text>
              <Text style={styles.verseLabel}>WORD FOR TODAY</Text>
            </View>

            <Text style={styles.verseReference}>{verse.reference}</Text>
            <Text style={styles.verseText}>"{verse.text}"</Text>

            {verse.reason && (
              <View style={styles.verseReasonContainer}>
                <Text style={styles.verseReason}>{verse.reason}</Text>
              </View>
            )}
          </Card>
        ) : null}

        {/* Continue Button */}
        <Button
          title="View Today's Workout"
          onPress={handleContinue}
          fullWidth
          size="large"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxxxl,
    fontWeight: fontWeight.extrabold as any,
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  summaryText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  verseCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundCardHighlight,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  verseIcon: {
    fontSize: fontSize.xl,
    marginRight: spacing.sm,
  },
  verseLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold as any,
    color: colors.accent,
    letterSpacing: 1.5,
  },
  verseReference: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
    marginBottom: spacing.md,
    letterSpacing: -0.2,
  },
  verseText: {
    fontSize: fontSize.lg,
    color: colors.text,
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  verseReasonContainer: {
    backgroundColor: colors.glass.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginTop: spacing.sm,
  },
  verseReason: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  verseLoading: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  verseLoadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
