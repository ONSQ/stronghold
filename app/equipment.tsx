// Equipment Configuration Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { EquipmentType } from '@/types/workout';

const EQUIPMENT_LIST: { type: EquipmentType; name: string; icon: string; description: string }[] = [
  {
    type: 'rowing_machine',
    name: 'Rowing Machine',
    icon: '🚣',
    description: 'Echelon Row or similar',
  },
  {
    type: 'cables',
    name: 'Cable Machine',
    icon: '🎯',
    description: 'Adjustable cable pulley system',
  },
  {
    type: 'resistance_bands',
    name: 'Resistance Bands',
    icon: '🔴',
    description: 'Light, Medium, Heavy',
  },
  {
    type: 'stability_ball',
    name: 'Stability Ball',
    icon: '⚽',
    description: '65cm or similar',
  },
  {
    type: 'free_weights',
    name: 'Free Weights',
    icon: '🏋️',
    description: 'Dumbbells 5-45 lbs',
  },
  {
    type: 'bodyweight',
    name: 'Bodyweight',
    icon: '🧍',
    description: 'No equipment needed',
  },
];

export default function EquipmentScreen() {
  const router = useRouter();

  // Default to all equipment available (Owen's setup)
  const [availableEquipment, setAvailableEquipment] = useState<Set<EquipmentType>>(
    new Set([
      'rowing_machine',
      'cables',
      'resistance_bands',
      'stability_ball',
      'free_weights',
      'bodyweight',
    ])
  );

  const toggleEquipment = (type: EquipmentType) => {
    const newSet = new Set(availableEquipment);
    if (newSet.has(type)) {
      if (type === 'bodyweight') {
        Alert.alert('Cannot Remove', 'Bodyweight exercises are always available');
        return;
      }
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setAvailableEquipment(newSet);
  };

  const handleSave = () => {
    // TODO: Save to storage
    Alert.alert('Saved', 'Equipment configuration saved!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Equipment</Text>
          <Text style={styles.subtitle}>
            Select the equipment you have available for AI workout generation
          </Text>
        </View>

        {/* Equipment List */}
        {EQUIPMENT_LIST.map((item) => {
          const isAvailable = availableEquipment.has(item.type);
          const isBodyweight = item.type === 'bodyweight';

          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => toggleEquipment(item.type)}
              disabled={isBodyweight}
            >
              <Card style={[
                styles.equipmentCard,
                isAvailable && styles.equipmentCardActive,
                isBodyweight && styles.equipmentCardBodyweight,
              ]}>
                <View style={styles.equipmentIcon}>
                  <Text style={styles.equipmentIconText}>{item.icon}</Text>
                </View>
                <View style={styles.equipmentInfo}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                  <Text style={styles.equipmentDescription}>{item.description}</Text>
                  {isBodyweight && (
                    <Text style={styles.alwaysAvailable}>Always Available</Text>
                  )}
                </View>
                <View style={styles.equipmentToggle}>
                  <View style={[
                    styles.checkbox,
                    isAvailable && styles.checkboxChecked,
                  ]}>
                    {isAvailable && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 How This Works</Text>
          <Text style={styles.infoText}>
            The AI will only generate workouts using equipment you've selected. This ensures every workout is practical and doable with your setup.
          </Text>
          <Text style={styles.infoText} style={{ marginTop: spacing.sm }}>
            You can change this anytime in Settings.
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Save Configuration"
            onPress={handleSave}
            fullWidth
            size="large"
            style={styles.saveButton}
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            fullWidth
          />
        </View>
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
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  equipmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  equipmentCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  equipmentCardBodyweight: {
    opacity: 0.8,
  },
  equipmentIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  equipmentIconText: {
    fontSize: 28,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  equipmentDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  alwaysAvailable: {
    fontSize: fontSize.xs,
    color: colors.success,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  equipmentToggle: {
    marginLeft: spacing.md,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
  },
  infoCard: {
    backgroundColor: colors.primary + '10',
    marginVertical: spacing.lg,
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  saveButton: {
    marginBottom: spacing.sm,
  },
});
