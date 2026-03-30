import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, Text, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * ToastBanner – visual notification alternative to Alert.
 * Usage:
 *   const toast = useRef(null);
 *   <ToastBanner ref={toast} />
 *   toast.current.show({ message: 'Hello', type: 'success' });
 *
 * Types: 'success' | 'error' | 'warning' | 'info'
 */

const CONFIG = {
  success: { color: '#00b894', background: 'rgba(0,184,148,0.15)', icon: 'check-circle', label: 'Succès' },
  error:   { color: '#ff7675', background: 'rgba(255,118,117,0.15)', icon: 'alert-circle', label: 'Erreur' },
  warning: { color: '#fdcb6e', background: 'rgba(253,203,110,0.15)', icon: 'alert-triangle', label: 'Attention' },
  info:    { color: '#74b9ff', background: 'rgba(116,185,255,0.15)', icon: 'info', label: 'Info' },
};

const ToastBanner = React.forwardRef((_, ref) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [state, setState] = React.useState({ message: '', type: 'success', subtext: '' });
  const timerRef = useRef(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -120, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const show = useCallback(({ message, type = 'success', subtext = '', duration = 3000 }) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({ message, type, subtext });

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    timerRef.current = setTimeout(() => hide(), duration);
  }, [hide]);

  React.useImperativeHandle(ref, () => ({ show, hide }));

  const cfg = CONFIG[state.type] || CONFIG.info;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: cfg.background, borderColor: cfg.color, transform: [{ translateY }], opacity },
      ]}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${cfg.label}: ${state.message}${state.subtext ? '. ' + state.subtext : ''}`}
      accessibilityLiveRegion="assertive"
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.color + '30' }]}>
        <Feather name={cfg.icon} size={20} color={cfg.color} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.message, { color: cfg.color }]} numberOfLines={2}>{state.message}</Text>
        {!!state.subtext && <Text style={styles.subtext} numberOfLines={1}>{state.subtext}</Text>}
      </View>
      <TouchableOpacity onPress={hide} style={styles.closeBtn} accessibilityLabel="Fermer" accessibilityRole="button">
        <Feather name="x" size={16} color={cfg.color} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 20,
    left: 16, right: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  textWrap: { flex: 1 },
  message: { fontWeight: '700', fontSize: 14 },
  subtext: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  closeBtn: { padding: 4, marginLeft: 8 },
});

export default ToastBanner;
