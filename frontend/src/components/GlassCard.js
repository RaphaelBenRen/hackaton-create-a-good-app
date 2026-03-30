import React from 'react';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SHADOWS } from '../constants/theme';
import { useApp } from '../services/AppContext';

const GlassCard = ({ children, style, intensity = 20, noPadding = false }) => {
  const { isDarkMode, colors } = useApp();

  return (
    <View style={[{
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: Platform.OS === 'android'
        ? (isDarkMode ? 'rgba(12, 25, 50, 0.95)' : 'rgba(255,255,255,0.95)')
        : colors.glassBackground,
      borderColor: colors.glassBorder,
      borderWidth: 1,
    }, Platform.OS === 'ios' && SHADOWS.light, style]}>
      {Platform.OS === 'ios' && (
        <BlurView intensity={intensity} tint={isDarkMode ? 'dark' : 'light'} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      )}
      <View style={noPadding ? undefined : { padding: 20 }}>
        {children}
      </View>
    </View>
  );
};

export default GlassCard;
