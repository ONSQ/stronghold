// Exercise Substitution Modal
// Allows users to swap exercises during an active workout

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Exercise, EquipmentType } from '@/types/workout';
import { ExerciseTemplate, EXERCISES } from '@/constants/exercises';
import { findSubstitutions, templateToExercise, getExercisesByEquipment } from '@/services/exerciseSubstitution';

interface ExerciseSubstitutionModalProps {
  visible: boolean;
  currentExercise: Exercise;
  onClose: () => void;
  onSubstitute: (newExercise: Exercise) => void;
  userState?: {
    kneeHealth: number;
    shoulderHealth: number;
  };
}

type FilterMode = 'suggested' | 'same_equipment' | 'all';

export default function ExerciseSubstitutionModal({
  visible,
  currentExercise,
  onClose,
  onSubstitute,
  userState,
}: ExerciseSubstitutionModalProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('suggested');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get exercise suggestions based on filter mode
  const suggestions = useMemo(() => {
    let templates: ExerciseTemplate[] = [];

    if (filterMode === 'suggested') {
      // Smart suggestions based on phase and user constraints
      templates = findSubstitutions(currentExercise, {
        kneeFriendly: userState && userState.kneeHealth <= 6 ? true : undefined,
        shoulderFriendly: userState && userState.shoulderHealth <= 6 ? true : undefined,
      });

      // Fallback: if no suggestions, show same equipment exercises
      if (templates.length === 0) {
        console.log('No suggested exercises found, falling back to same equipment');
        templates = findSubstitutions(currentExercise, {
          equipment: currentExercise.equipment,
        });
      }

      // Fallback: if still nothing, show all exercises in same phase
      if (templates.length === 0) {
        console.log('No same equipment exercises found, falling back to all exercises in phase');
        templates = findSubstitutions(currentExercise, {});
      }
    } else if (filterMode === 'same_equipment') {
      // Same equipment and phase
      templates = findSubstitutions(currentExercise, {
        equipment: currentExercise.equipment,
      });
    } else {
      // All exercises - no phase restriction
      templates = Object.values(EXERCISES);

      // Filter by equipment if selected
      if (selectedEquipment) {
        templates = templates.filter(t => t.equipment === selectedEquipment);
      }

      // Exclude current exercise
      templates = templates.filter(t => t.id !== currentExercise.id);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.targetMuscles.some(m => m.toLowerCase().includes(query))
      );
    }

    console.log(`Found ${templates.length} exercise suggestions for ${currentExercise.name} (phase: ${currentExercise.phase}, equipment: ${currentExercise.equipment}, filter: ${filterMode})`);

    return templates;
  }, [filterMode, currentExercise, userState, selectedEquipment, searchQuery]);

  const handleSelectExercise = (template: ExerciseTemplate) => {
    // Convert template to exercise with same sets/reps structure as current
    const newExercise = templateToExercise(
      template,
      currentExercise.sets.length,
      currentExercise.sets[0]?.targetReps,
      currentExercise.sets[0]?.targetWeight
    );

    onSubstitute(newExercise);
    onClose();
  };

  const equipmentOptions: EquipmentType[] = [
    'rowing_machine',
    'cables',
    'resistance_bands',
    'stability_ball',
    'free_weights',
    'bodyweight',
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Swap Exercise</Text>
              <Text style={styles.subtitle}>
                Currently: {currentExercise.name}
              </Text>
              <Text style={styles.countText}>
                {suggestions.length} exercises available
              </Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, filterMode === 'suggested' && styles.filterTabActive]}
              onPress={() => setFilterMode('suggested')}
            >
              <Text style={[styles.filterTabText, filterMode === 'suggested' && styles.filterTabTextActive]}>
                Suggested
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filterMode === 'same_equipment' && styles.filterTabActive]}
              onPress={() => setFilterMode('same_equipment')}
            >
              <Text style={[styles.filterTabText, filterMode === 'same_equipment' && styles.filterTabTextActive]}>
                Same Equipment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filterMode === 'all' && styles.filterTabActive]}
              onPress={() => setFilterMode('all')}
            >
              <Text style={[styles.filterTabText, filterMode === 'all' && styles.filterTabTextActive]}>
                All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Equipment Filter (for 'all' mode) */}
          {filterMode === 'all' && (
            <ScrollView horizontal style={styles.equipmentFilter} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.equipmentChip, !selectedEquipment && styles.equipmentChipActive]}
                onPress={() => setSelectedEquipment(null)}
              >
                <Text style={[styles.equipmentChipText, !selectedEquipment && styles.equipmentChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {equipmentOptions.map(eq => (
                <TouchableOpacity
                  key={eq}
                  style={[styles.equipmentChip, selectedEquipment === eq && styles.equipmentChipActive]}
                  onPress={() => setSelectedEquipment(eq)}
                >
                  <Text style={[styles.equipmentChipText, selectedEquipment === eq && styles.equipmentChipTextActive]}>
                    {eq.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Exercise List */}
          <ScrollView
            style={styles.exerciseList}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.length === 0 ? (
              <Text style={styles.noResults}>No exercises found</Text>
            ) : (
              suggestions.map(template => (
                <ExerciseTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => handleSelectExercise(template)}
                />
              ))
            )}
          </ScrollView>

            {/* Close Button */}
            <Button title="Cancel" onPress={onClose} variant="secondary" fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Exercise Template Card Component
function ExerciseTemplateCard({
  template,
  onSelect,
}: {
  template: ExerciseTemplate;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity onPress={onSelect}>
      <Card style={styles.exerciseCard}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{template.name}</Text>
          <Text style={styles.exerciseEquipment}>
            {template.equipment.replace('_', ' ')}
          </Text>
        </View>

        <View style={styles.exerciseDetails}>
          <Text style={styles.exerciseMuscles}>
            🎯 {template.targetMuscles.join(', ')}
          </Text>
          <Text style={styles.exerciseDifficulty}>
            {template.difficulty === 'beginner' ? '⭐' : template.difficulty === 'intermediate' ? '⭐⭐' : '⭐⭐⭐'}
          </Text>
        </View>

        <View style={styles.exerciseTags}>
          {template.kneeFriendly && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Knee Friendly</Text>
            </View>
          )}
          {template.shoulderFriendly && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Shoulder Friendly</Text>
            </View>
          )}
        </View>

        {template.formCues && template.formCues.length > 0 && (
          <Text style={styles.exerciseFormCue} numberOfLines={1}>
            💡 {template.formCues[0]}
          </Text>
        )}

        {/* Select Button */}
        <View style={styles.selectButtonContainer}>
          <View style={styles.selectButtonHighlight}>
            <Text style={styles.selectButton}>✓ TAP TO SELECT</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
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
    height: '90%',
    maxHeight: '90%',
  },
  modalContent: {
    flex: 1,
    flexDirection: 'column',
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
  countText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: fontWeight.semibold as any,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium as any,
  },
  filterTabTextActive: {
    color: colors.white,
  },
  equipmentFilter: {
    maxHeight: 50,
    marginBottom: spacing.md,
  },
  equipmentChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundElevated,
    marginRight: spacing.sm,
  },
  equipmentChipActive: {
    backgroundColor: colors.primary + '30',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  equipmentChipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  equipmentChipTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold as any,
  },
  searchInput: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.md,
  },
  exerciseList: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: spacing.lg,
  },
  noResults: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  exerciseCard: {
    marginBottom: spacing.md,
  },
  exerciseHeader: {
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exerciseEquipment: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exerciseMuscles: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  exerciseDifficulty: {
    fontSize: fontSize.sm,
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: fontWeight.medium as any,
  },
  exerciseFormCue: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  selectButtonContainer: {
    marginTop: spacing.sm,
  },
  selectButtonHighlight: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectButton: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
