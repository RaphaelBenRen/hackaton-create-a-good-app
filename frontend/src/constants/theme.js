import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  background: '#0a1628',
  primary: '#1e3a5f',
  secondary: '#152238',
  accent: '#3b82f6',

  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.45)',

  success: '#00b894',
  error: '#ff7675',
  warning: '#fdcb6e',
  info: '#74b9ff',

  gradientStart: '#0a1628',
  gradientMiddle: '#162d50',
  gradientEnd: '#1a2740',

  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassBackground: 'rgba(255, 255, 255, 0.1)',
};

export const LIGHT_COLORS = {
  background: '#f0f4ff',
  primary: '#bfdbfe',
  secondary: '#ffffff',
  accent: '#2563eb',

  text: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',

  success: '#059669',
  error: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',

  gradientStart: '#f0f4ff',
  gradientMiddle: '#dbeafe',
  gradientEnd: '#eff6ff',

  glassBorder: 'rgba(15, 23, 42, 0.12)',
  glassBackground: 'rgba(255, 255, 255, 0.75)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  titles: 'System',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 20,
  padding: 20,
  margin: 20,
  h1: 30, h2: 22, h3: 18, h4: 16,
  body1: 16, body2: 14, body3: 13,
  width, height,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  medium: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  glow: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
};
