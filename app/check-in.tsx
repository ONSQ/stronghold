// Check-In Screen - Morning wellness check

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SliderInput from '@/components/ui/Slider';
import SelectButton from '@/components/ui/SelectButton';
import { PhysicalState, MentalState, EmotionalState, CheckIn } from '@/types/checkin';
import { workoutGenerator } from '@/services/ai/workoutGenerator';
import { storageService } from '@/services/storage/asyncStorage';

const MENTAL_STATES = [
  { value: 'clear', label: 'Clear & Focused', emoji: '😌' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'foggy', label: 'Foggy', emoji: '🌫️' },
  { value: 'heavy', label: 'Heavy', emoji: '😔' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '💭' },
];

const EMOTIONAL_STATES = [
  { value: 'peaceful', label: 'Peaceful', emoji: '😌' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'joyful', label: 'Joyful', emoji: '😊' },
  { value: 'numb', label: 'Numb', emoji: '😐' },
];

export default function CheckInScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'physical' | 'mental' | 'emotional' | 'generating'>('physical');
  const [loading, setLoading] = useState(false);

  // Physical state
  const [knee, setKnee] = useState(7);
  const [shoulder, setShoulder] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [weight, setWeight] = useState('');

  // Mental state
  const [mentalState, setMentalState] = useState<MentalState>('clear');
  const [stress, setStress] = useState(5);
  const [clarity, setClarity] = useState(7);

  // Emotional state
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('peaceful');
  const [emotionalIntensity, setEmotionalIntensity] = useState(5);

  const handleNext = () => {
    if (step === 'physical') setStep('mental');
    else if (step === 'mental') setStep('emotional');
    else if (step === 'emotional') handleGenerateWorkout();
  };

  const handleBack = () => {
    if (step === 'mental') setStep('physical');
    else if (step === 'emotional') setStep('mental');
  };

  const handleGenerateWorkout = async () => {
    setStep('generating');
    setLoading(true);

    try {
      // Create check-in object
      const checkIn: CheckIn = {
        id: `checkin_${Date.now()}`,
        date: new Date(),
        physical: {
          knee,
          shoulder,
          energy,
          sleep: 7, // Default value since we removed sleep tracking
          weight: weight ? parseFloat(weight) : undefined,
        },
        mental: { state: mentalState, stress, clarity },
        emotional: { primary: emotionalState, intensity: emotionalIntensity },
        createdAt: new Date(),
      };

      // Save check-in to storage
      try {
        await storageService.saveCheckIn(checkIn);
        console.log('Check-in saved successfully');
      } catch (saveError) {
        console.error('Failed to save check-in, but continuing with workout generation:', saveError);
        // Continue even if save fails - don't block workout generation
      }

      // Generate workout with AI
      const workout = await workoutGenerator.generateWorkout(checkIn);

      // Save workout to storage
      try {
        const workoutId = await storageService.saveWorkout(workout);
        console.log('Workout saved successfully with ID:', workoutId);

        // Navigate to check-in results screen (shows Bible verse, then workout)
        router.push({
          pathname: '/check-in-result',
          params: {
            checkIn: JSON.stringify(checkIn),
            workoutId: workoutId,
            workout: JSON.stringify(workout),
          },
        });
      } catch (saveError) {
        console.error('Failed to save workout:', saveError);
        // Still navigate to results even if save fails
        router.push({
          pathname: '/check-in-result',
          params: {
            checkIn: JSON.stringify(checkIn),
            workoutId: workout.id,
            workout: JSON.stringify(workout),
          },
        });
      }
    } catch (error) {
      console.error('Failed to generate workout:', error);
      Alert.alert(
        'Error',
        'Failed to generate workout. Please check your internet connection and try again.',
        [{ text: 'OK', onPress: () => setStep('emotional') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPhysicalStep = () => (
    <View>
      <Text style={styles.title}>How's Your Body Today?</Text>
      <Text style={styles.subtitle}>Quick check on your physical state</Text>

      <Card style={styles.card}>
        {/* Weight Input - Now Primary */}
        <View style={styles.weightContainer}>
          <Text style={styles.weightLabel}>⚖️ Body Weight</Text>
          <Text style={styles.weightSubtitle}>Track your progress over time</Text>
          <View style={styles.weightInputWrapper}>
            <TextInput
              style={styles.weightInput}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter current weight"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
            <Text style={styles.weightUnit}>lbs</Text>
          </View>
        </View>

        <SliderInput
          label="Left Knee"
          value={knee}
          onChange={setKnee}
          emoji="🦵"
        />
        <SliderInput
          label="Shoulder"
          value={shoulder}
          onChange={setShoulder}
          emoji="💪"
        />
        <SliderInput
          label="Energy Level"
          value={energy}
          onChange={setEnergy}
          emoji="⚡"
        />
      </Card>

      <Button
        title="Next: Mental Check"
        onPress={handleNext}
        fullWidth
        size="large"
      />
    </View>
  );

  const renderMentalStep = () => (
    <View>
      <Text style={styles.title}>How's Your Mind?</Text>
      <Text style={styles.subtitle}>Mental state and stress check</Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Mental State</Text>
        <SelectButton
          options={MENTAL_STATES}
          selected={mentalState}
          onSelect={(value) => setMentalState(value as MentalState)}
        />

        <SliderInput
          label="Stress Level"
          value={stress}
          onChange={setStress}
          emoji="😰"
        />

        <SliderInput
          label="Mental Clarity"
          value={clarity}
          onChange={setClarity}
          emoji="🧠"
        />
      </Card>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={handleBack}
          variant="secondary"
          style={styles.buttonHalf}
        />
        <Button
          title="Next: Emotional Check"
          onPress={handleNext}
          style={styles.buttonHalf}
        />
      </View>
    </View>
  );

  const renderEmotionalStep = () => (
    <View>
      <Text style={styles.title}>How Are You Feeling?</Text>
      <Text style={styles.subtitle}>Emotional temperature check</Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Primary Emotion</Text>
        <SelectButton
          options={EMOTIONAL_STATES}
          selected={emotionalState}
          onSelect={(value) => setEmotionalState(value as EmotionalState)}
          multiColumn
        />

        <SliderInput
          label="Intensity"
          value={emotionalIntensity}
          onChange={setEmotionalIntensity}
          emoji="❤️"
        />
      </Card>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={handleBack}
          variant="secondary"
          style={styles.buttonHalf}
        />
        <Button
          title="Generate Workout"
          onPress={handleNext}
          style={styles.buttonHalf}
        />
      </View>
    </View>
  );

  const renderGenerating = () => (
    <View style={styles.generatingContainer}>
      <Text style={styles.title}>Analyzing Your Check-In...</Text>
      <Text style={styles.generatingText}>🤖 AI Coach is creating your personalized workout</Text>
      <Button
        title="Generating..."
        onPress={() => {}}
        loading={true}
        disabled={true}
        fullWidth
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>☀️ Good Morning, Owen!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>

        {step === 'physical' && renderPhysicalStep()}
        {step === 'mental' && renderMentalStep()}
        {step === 'emotional' && renderEmotionalStep()}
        {step === 'generating' && renderGenerating()}
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
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
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
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  buttonHalf: {
    flex: 1,
  },
  generatingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  generatingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  weightContainer: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weightLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  weightSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  weightInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing.md,
  },
  weightInput: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  weightUnit: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});
