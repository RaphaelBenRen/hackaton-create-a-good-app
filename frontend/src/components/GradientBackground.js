import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../services/AppContext';

const GradientBackground = ({ children, variant = 'default', style }) => {
  const { colors } = useApp();

  const circles = {
    default: [
      { size: 300, top: -50, left: -100, colors: [colors.primary, 'transparent'] },
      { size: 250, bottom: -50, right: -50, colors: [colors.secondary, 'transparent'] },
    ],
    topRight: [
      { size: 280, top: -80, right: -60, colors: [colors.primary, 'transparent'] },
      { size: 200, bottom: 100, left: -80, colors: [colors.secondary, 'transparent'] },
    ],
    center: [
      { size: 350, top: '30%', left: -100, colors: [colors.primary, 'transparent'] },
      { size: 200, top: -30, right: -40, colors: [colors.secondary, 'transparent'] },
    ],
    subtle: [
      { size: 200, top: 50, right: -80, colors: [colors.primary, 'transparent'] },
      { size: 180, bottom: 80, left: -60, colors: [colors.secondary, 'transparent'] },
    ],
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {(circles[variant] || circles.default).map((circle, i) => (
        <LinearGradient
          key={i}
          colors={circle.colors}
          style={[styles.circle, {
            width: circle.size, height: circle.size,
            borderRadius: circle.size / 2,
            top: circle.top, bottom: circle.bottom,
            left: circle.left, right: circle.right,
          }]}
        />
      ))}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  circle: { position: 'absolute', opacity: 0.3 },
});

export default GradientBackground;
