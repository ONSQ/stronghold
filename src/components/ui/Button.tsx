// Custom Button Component - STRONGHOLD Dark Theme

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, fontSize, fontWeight, spacing } from '@/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size
    if (size === 'small') {
      baseStyle.paddingVertical = spacing.sm;
      baseStyle.paddingHorizontal = spacing.md;
    } else if (size === 'large') {
      baseStyle.paddingVertical = spacing.lg;
      baseStyle.paddingHorizontal = spacing.xl;
    } else {
      baseStyle.paddingVertical = spacing.md;
      baseStyle.paddingHorizontal = spacing.lg;
    }

    // Variant
    if (variant === 'primary') {
      baseStyle.backgroundColor = disabled ? colors.buttonDisabled : colors.buttonPrimary;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = colors.buttonSecondary;
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = colors.border;
    } else if (variant === 'outline') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = disabled ? colors.borderLight : colors.primary;
    } else if (variant === 'danger') {
      baseStyle.backgroundColor = disabled ? colors.buttonDisabled : colors.error;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: fontWeight.semibold as any,
    };

    // Size
    if (size === 'small') {
      baseStyle.fontSize = fontSize.sm;
    } else if (size === 'large') {
      baseStyle.fontSize = fontSize.lg;
    } else {
      baseStyle.fontSize = fontSize.md;
    }

    // Variant
    if (variant === 'primary' || variant === 'danger') {
      baseStyle.color = colors.text;
    } else if (variant === 'secondary') {
      baseStyle.color = colors.text;
    } else if (variant === 'outline') {
      baseStyle.color = disabled ? colors.textDisabled : colors.primary;
    }

    if (disabled) {
      baseStyle.color = colors.textDisabled;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.text} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
