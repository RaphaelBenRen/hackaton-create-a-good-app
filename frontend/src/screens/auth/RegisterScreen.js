import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  ScrollView, Platform, StyleSheet, Alert, Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { supabase } from '../../services/supabase';

const RegisterScreen = ({ navigation }) => {
  const { t, scaledSize, colors, isDarkMode } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email.trim()) return Alert.alert('', t('errorEmailRequired'));
    if (!password) return Alert.alert('', t('errorPasswordRequired'));
    if (password.length < 6) return Alert.alert('', t('errorPasswordLength'));
    if (password !== confirmPassword) return Alert.alert('', t('errorPasswordMatch'));

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);

    if (error) Alert.alert('', error.message);
  };

  return (
    <GradientBackground variant="center">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View style={[{opacity: 1}, styles.header]}>
            <View style={styles.logoContainer}>
              <Feather name="navigation" size={60} color={isDarkMode ? "#fff" : colors.primary} />
            </View>
            <Text style={[styles.title, { fontSize: scaledSize(30) }]} accessibilityRole="header">
              {t('register')}
            </Text>
          </Animated.View>

          <Animated.View style={{opacity: 1}}>
            <GlassCard intensity={30} style={{ padding: 30 }}>
              <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('email')}</Text>
              <TextInput
                style={[styles.input, { fontSize: scaledSize(16) }]}
                placeholder={t('email')}
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel={t('email')}
              />

              <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 16, color: colors.text }]}>{t('password')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { fontSize: scaledSize(16) }]}
                  placeholder={t('password')}
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  accessible={true}
                  accessibilityLabel={t('password')}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  accessibilityLabel={showPassword ? t('hidePassword') : t('showPassword')}
                  accessibilityRole="button"
                >
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 16, color: colors.text }]}>{t('confirmPassword')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { fontSize: scaledSize(16) }]}
                  placeholder={t('confirmPassword')}
                  placeholderTextColor={colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  accessible={true}
                  accessibilityLabel={t('confirmPassword')}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  accessibilityRole="button"
                >
                  <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <AnimatedButton
                text={loading ? '...' : t('register')}
                onPress={handleRegister}
                disabled={loading}
                style={{ marginTop: 20 }}
              />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { fontSize: scaledSize(14) }]}>{t('hasAccount')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="link">
                  <Text style={[styles.footerLink, { fontSize: scaledSize(14), color: colors.accent }]}>{t('login')}</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, borderWidth: 2, borderColor: COLORS.glassBorder,
  },
  title: { fontWeight: 'bold' },
  label: { fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderRadius: 20, padding: 15,
    borderWidth: 1, borderColor: COLORS.glassBorder,
  },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeButton: { position: 'absolute', right: 15, top: 15, padding: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: COLORS.textSecondary },
  footerLink: { color: COLORS.accent, fontWeight: 'bold' },
});

export default RegisterScreen;
