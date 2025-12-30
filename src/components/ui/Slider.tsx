// Slider Component - For 1-10 ratings

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, fontSize, spacing, fontWeight } from '@/theme/colors';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  emoji?: string;
}

export default function SliderInput({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  showValue = true,
  emoji,
}: SliderInputProps) {
  const getValueColor = () => {
    if (value <= 3) return colors.error;
    if (value <= 6) return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {emoji && `${emoji} `}{label}
        </Text>
        {showValue && (
          <Text style={[styles.value, { color: getValueColor() }]}>
            {value}/{max}
          </Text>
        )}
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
      <View style={styles.labels}>
        <Text style={styles.labelText}>Low</Text>
        <Text style={styles.labelText}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.text,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  labelText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
