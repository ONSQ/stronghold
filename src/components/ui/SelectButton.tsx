// SelectButton Component - For choosing options

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, borderRadius, fontSize, spacing, fontWeight } from '@/theme/colors';

interface Option {
  value: string;
  label: string;
  emoji?: string;
}

interface SelectButtonProps {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  multiColumn?: boolean;
}

export default function SelectButton({
  options,
  selected,
  onSelect,
  multiColumn = false,
}: SelectButtonProps) {
  return (
    <View style={[styles.container, multiColumn && styles.multiColumn]}>
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              isSelected && styles.buttonSelected,
              multiColumn && styles.buttonMultiColumn,
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            {option.emoji && (
              <Text style={styles.emoji}>{option.emoji}</Text>
            )}
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  multiColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  buttonMultiColumn: {
    flex: 1,
    minWidth: '45%',
  },
  buttonSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: fontSize.xl,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.text,
    fontWeight: fontWeight.semibold as any,
  },
});
