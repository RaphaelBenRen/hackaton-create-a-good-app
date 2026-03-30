import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import { useApp } from '../services/AppContext';

const AnimatedButton = ({
  text, onPress, variant = 'primary', style, disabled = false,
  accessibilityLabel, accessibilityHint,
}) => {
  const { scaledSize, colors } = useApp();
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={[
        styles.wrapper,
        Platform.OS === 'ios' && isPrimary && SHADOWS.medium,
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={isPrimary
          ? [COLORS.primary, COLORS.secondary]
          : [colors.glassBackground, colors.glassBackground]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, !isPrimary && styles.secondaryBorder]}
      >
        <Text style={[
          styles.text, 
          { fontSize: scaledSize(16) },
          !isPrimary && { color: colors.text }
        ]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%', borderRadius: 20, overflow: 'hidden' },
  gradient: {
    paddingVertical: 16, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryBorder: { borderWidth: 1 },
  text: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  disabled: { opacity: 0.5 },
});

export default AnimatedButton;
