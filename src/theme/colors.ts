// STRONGHOLD Dark Theme Configuration

export const colors = {
  // Primary palette
  primary: '#FF6B35', // Energetic orange-red
  primaryDark: '#D94A1F',
  primaryLight: '#FF8860',
  
  // Background
  background: '#000000',
  backgroundElevated: '#1A1A1A',
  backgroundCard: '#242424',
  
  // Surface
  surface: '#2A2A2A',
  surfaceHighlight: '#333333',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  textDisabled: '#4D4D4D',
  
  // Status colors
  success: '#4ADE80', // Green
  warning: '#FBBF24', // Yellow
  error: '#EF4444', // Red
  info: '#60A5FA', // Blue
  
  // Functional
  border: '#333333',
  borderLight: '#404040',
  divider: '#2A2A2A',
  
  // Interactive
  buttonPrimary: '#FF6B35',
  buttonSecondary: '#2A2A2A',
  buttonDisabled: '#1A1A1A',
  
  // Input
  inputBackground: '#1A1A1A',
  inputBorder: '#333333',
  inputFocused: '#FF6B35',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  
  // Workout specific
  workout: {
    easy: '#4ADE80', // Green
    good: '#60A5FA', // Blue
    hard: '#FBBF24', // Yellow
    pain: '#EF4444', // Red
  },
  
  // Body zones
  body: {
    knee: '#FF6B35',
    shoulder: '#60A5FA',
    energy: '#FBBF24',
    sleep: '#A78BFA',
  },
  
  // AI Coach
  ai: {
    message: '#2A2A2A',
    accent: '#FF6B35',
    thinking: '#808080',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
  dark: true,
};

export type Theme = typeof theme;
