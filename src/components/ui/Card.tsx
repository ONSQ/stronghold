// Card Component - STRONGHOLD

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '@/theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: keyof typeof spacing;
}

export default function Card({ 
  children, 
  style, 
  elevated = false,
  padding = 'md' 
}: CardProps) {
  return (
    <View 
      style={[
        styles.card,
        { padding: spacing[padding] },
        elevated && shadows.md,
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
