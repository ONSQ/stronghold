// STRONGHOLD Modern AI Theme Configuration

export const colors = {
  // Primary palette - AI-inspired cyber orange
  primary: '#FF6B35', // Energetic orange-red
  primaryDark: '#D94A1F',
  primaryLight: '#FF8860',

  // Accent colors for AI elements
  accent: '#00D9FF', // Cyan for AI highlights
  accentPurple: '#A855F7', // Purple for secondary AI elements
  accentGreen: '#10B981', // Success green

  // Background - Deep dark with subtle gradients
  background: '#0A0A0A',
  backgroundElevated: '#141414',
  backgroundCard: '#1A1A1A',
  backgroundCardHighlight: '#1F1F1F',

  // Surface
  surface: '#1A1A1A',
  surfaceHighlight: '#242424',

  // Text
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textTertiary: '#737373',
  textDisabled: '#525252',

  // Status colors
  success: '#10B981', // Modern green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#00D9FF', // Cyan

  // Functional
  border: '#262626',
  borderLight: '#404040',
  borderAccent: 'rgba(255, 107, 53, 0.3)',
  divider: '#1A1A1A',

  // Interactive
  buttonPrimary: '#FF6B35',
  buttonSecondary: '#1A1A1A',
  buttonDisabled: '#141414',

  // Input
  inputBackground: '#141414',
  inputBorder: '#262626',
  inputFocused: '#FF6B35',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.85)',
  overlayLight: 'rgba(0, 0, 0, 0.6)',

  // Gradients
  gradients: {
    primary: ['#FF6B35', '#FF8860'],
    ai: ['#00D9FF', '#A855F7'],
    card: ['rgba(255, 107, 53, 0.1)', 'rgba(255, 107, 53, 0.02)'],
    subtle: ['rgba(0, 217, 255, 0.05)', 'rgba(168, 85, 247, 0.05)'],
  },

  // Workout specific
  workout: {
    easy: '#10B981', // Green
    good: '#00D9FF', // Cyan
    hard: '#F59E0B', // Amber
    pain: '#EF4444', // Red
  },

  // Body zones
  body: {
    knee: '#FF6B35',
    shoulder: '#00D9FF',
    energy: '#F59E0B',
    sleep: '#A855F7',
  },

  // AI Coach - Modern AI aesthetic
  ai: {
    message: '#141414',
    accent: '#00D9FF',
    thinking: '#737373',
    glow: 'rgba(0, 217, 255, 0.2)',
  },

  // Glass morphism
  glass: {
    background: 'rgba(26, 26, 26, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
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
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
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
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 12,
  },
  glow: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  aiGlow: {
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
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
