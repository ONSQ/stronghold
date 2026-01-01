// Post-Workout Check Modal
// Captures user's physical, mental, and emotional state after completing a workout

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SliderInput from '@/components/ui/Slider';
import SelectButton from '@/components/ui/SelectButton';
import {
  PostWorkoutCheck,
  PostWorkoutOverall,
  PostWorkoutMood,
} from '@/types/workout';

interface PostWorkoutCheckModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (check: PostWorkoutCheck) => void;
  preWorkoutKnee?: number;
  preWorkoutShoulder?: number;
}

const OVERALL_OPTIONS = [
  { value: 'energized', label: 'Energized', emoji: '⚡' },
  { value: 'good', label: 'Good', emoji: '😊' },
  { value: 'tired', label: 'Tired', emoji: '😌' },
  { value: 'exhausted', label: 'Exhausted', emoji: '😴' },
];

const MOOD_OPTIONS = [
  { value: 'uplifted', label: 'Uplifted', emoji: '😊' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'drained', label: 'Drained', emoji: '😔' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😤' },
];

export default function PostWorkoutCheckModal({
  visible,
  onClose,
  onSubmit,
  preWorkoutKnee = 7,
  preWorkoutShoulder = 7,
}: PostWorkoutCheckModalProps) {
  const [step, setStep] = useState<'physical' | 'mental' | 'emotional'>('physical');

  // Physical state
  const [knee, setKnee] = useState(preWorkoutKnee);
  const [shoulder, setShoulder] = useState(preWorkoutShoulder);
  const [overall, setOverall] = useState<PostWorkoutOverall>('good');
  const [energy, setEnergy] = useState(7);

  // Mental state
  const [clarity, setClarity] = useState(7);
  const [stress, setStress] = useState(5);
  const [focus, setFocus] = useState(7);

  // Emotional state
  const [mood, setMood] = useState<PostWorkoutMood>('calm');
  const [intensity, setIntensity] = useState(5);
  const [outlook, setOutlook] = useState(7);
  const [notes, setNotes] = useState('');

  const handleNext = () => {
    if (step === 'physical') setStep('mental');
    else if (step === 'mental') setStep('emotional');
  };

  const handleBack = () => {
    if (step === 'mental') setStep('physical');
    else if (step === 'emotional') setStep('mental');
  };

  const handleSubmit = () => {
    const postWorkoutCheck: PostWorkoutCheck = {
      physical: {
        knee,
        shoulder,
        overall,
        energy,
      },
      mental: {
        clarity,
        stress,
        focus,
      },
      emotional: {
        mood,
        intensity,
        outlook,
      },
      notes: notes.trim() || undefined,
      completedAt: new Date(),
    };

    onSubmit(postWorkoutCheck);
    onClose();

    // Reset form
    setStep('physical');
    setNotes('');
  };

  const getKneeChange = () => {
    const diff = knee - preWorkoutKnee;
    if (diff > 0) return `↗️ +${diff} (better)`;
    if (diff < 0) return `↘️ ${diff} (worse)`;
    return '→ unchanged';
  };

  const getShoulderChange = () => {
    const diff = shoulder - preWorkoutShoulder;
    if (diff > 0) return `↗️ +${diff} (better)`;
    if (diff < 0) return `↘️ ${diff} (worse)`;
    return '→ unchanged';
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>How do you feel?</Text>
              <Text style={styles.subtitle}>
                Post-Workout Check {step === 'physical' ? '(1/3)' : step === 'mental' ? '(2/3)' : '(3/3)'}
              </Text>
            </View>

            {/* Step Indicators */}
            <View style={styles.stepIndicators}>
              <View style={[styles.stepDot, step === 'physical' && styles.stepDotActive]} />
              <View style={[styles.stepDot, step === 'mental' && styles.stepDotActive]} />
              <View style={[styles.stepDot, step === 'emotional' && styles.stepDotActive]} />
            </View>

            {/* Physical Step */}
            {step === 'physical' && (
              <Card>
                <Text style={styles.sectionTitle}>💪 Physical State</Text>
                <Text style={styles.sectionSubtitle}>
                  How does your body feel after this workout?
                </Text>

                <SliderInput
                  label={`Knee: ${knee}/10 ${getKneeChange()}`}
                  value={knee}
                  onValueChange={setKnee}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />

                <SliderInput
                  label={`Shoulder: ${shoulder}/10 ${getShoulderChange()}`}
                  value={shoulder}
                  onValueChange={setShoulder}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />

                <SliderInput
                  label={`Energy: ${energy}/10`}
                  value={energy}
                  onValueChange={setEnergy}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />

                <Text style={styles.selectLabel}>Overall Feeling:</Text>
                <View style={styles.selectRow}>
                  {OVERALL_OPTIONS.map(option => (
                    <SelectButton
                      key={option.value}
                      label={`${option.emoji} ${option.label}`}
                      selected={overall === option.value}
                      onPress={() => setOverall(option.value as PostWorkoutOverall)}
                      style={styles.selectButton}
                    />
                  ))}
                </View>
              </Card>
            )}

            {/* Mental Step */}
            {step === 'mental' && (
              <Card>
                <Text style={styles.sectionTitle}>🧠 Mental State</Text>
                <Text style={styles.sectionSubtitle}>
                  How is your mind after this workout?
                </Text>

                <SliderInput
                  label={`Mental Clarity: ${clarity}/10`}
                  value={clarity}
                  onValueChange={setClarity}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />

                <SliderInput
                  label={`Stress Level: ${stress}/10`}
                  value={stress}
                  onValueChange={setStress}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />

                <SliderInput
                  label={`Ability to Focus: ${focus}/10`}
                  value={focus}
                  onValueChange={setFocus}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />
              </Card>
            )}

            {/* Emotional Step */}
            {step === 'emotional' && (
              <Card>
                <Text style={styles.sectionTitle}>❤️ Emotional State</Text>
                <Text style={styles.sectionSubtitle}>
                  How are you feeling emotionally?
                </Text>

                <Text style={styles.selectLabel}>Primary Mood:</Text>
                <View style={styles.selectRow}>
                  {MOOD_OPTIONS.map(option => (
                    <SelectButton
                      key={option.value}
                      label={`${option.emoji} ${option.label}`}
                      selected={mood === option.value}
                      onPress={() => setMood(option.value as PostWorkoutMood)}
                      style={styles.selectButton}
                    />
                  ))}
                </View>

                <SliderInput
                  label={`Mood Intensity: ${intensity}/10`}
                  value={intensity}
                  onValueChange={setIntensity}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />

                <SliderInput
                  label={`Outlook for the Day: ${outlook}/10`}
                  value={outlook}
                  onValueChange={setOutlook}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                />

                <Text style={styles.notesLabel}>Notes (optional):</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Any thoughts about this workout?"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  value={notes}
                  onChangeText={setNotes}
                />
              </Card>
            )}

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
              {step !== 'physical' && (
                <Button
                  title="Back"
                  onPress={handleBack}
                  variant="secondary"
                  style={styles.button}
                />
              )}

              {step !== 'emotional' ? (
                <Button
                  title="Next"
                  onPress={handleNext}
                  variant="primary"
                  style={styles.button}
                  fullWidth={step === 'physical'}
                />
              ) : (
                <Button
                  title="Complete Workout"
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.button}
                  fullWidth
                />
              )}
            </View>

            <Button
              title="Skip for Now"
              onPress={onClose}
              variant="ghost"
              style={styles.skipButton}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    height: '85%',
  },
  modalContent: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.backgroundElevated,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    width: 32,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  selectLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  selectButton: {
    minWidth: '45%',
  },
  notesLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  notesInput: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  button: {
    flex: 1,
  },
  skipButton: {
    marginTop: spacing.sm,
  },
});
