import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';

const RoleSelectScreen = ({ navigation }) => {
  const { t, scaledSize, selectRole, colors, isDarkMode } = useApp();
  const [selected, setSelected] = useState(null);

  const handleContinue = async () => {
    if (!selected) return;
    await selectRole(selected);
    navigation.navigate(selected === 'student' ? 'StudentProfile' : 'CompanyProfile');
  };

  return (
    <GradientBackground variant="center">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.logoBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="navigation" size={36} color="#fff" />
          </LinearGradient>
          <Text style={[styles.appName, { fontSize: scaledSize(28), color: colors.text }]}>Albatros</Text>
          <Text style={[styles.title, { fontSize: scaledSize(22), color: colors.text }]} accessibilityRole="header">
            {t('roleSelectTitle')}
          </Text>
          <Text style={[styles.subtitle, { fontSize: scaledSize(15), color: colors.textSecondary }]}>
            {t('roleSelectDesc')}
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.roles}>
          {/* Student */}
          <TouchableOpacity
            onPress={() => setSelected('student')}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === 'student' }}
            accessibilityLabel={`${t('student')}. ${t('studentDesc')}`}
          >
            <GlassCard style={selected === 'student' ? [styles.cardSelected, { borderColor: colors.accent }] : undefined}>
              <View style={styles.cardRow}>
                <View style={[
                  styles.iconBox,
                  selected === 'student' && { backgroundColor: colors.accent },
                ]}>
                  <Feather name="user" size={28} color="#fff" />
                </View>
                <View style={styles.cardTexts}>
                  <Text style={[styles.roleTitle, { fontSize: scaledSize(18), color: colors.text }]}>
                    {t('student')}
                  </Text>
                  <Text style={[styles.roleDesc, { fontSize: scaledSize(14), color: colors.textSecondary }]}>
                    {t('studentDesc')}
                  </Text>
                </View>
                <View style={[styles.radio, selected === 'student' && { borderColor: colors.accent }]}>
                  {selected === 'student' && <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />}
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>

          {/* Company */}
          <TouchableOpacity
            onPress={() => setSelected('company')}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === 'company' }}
            accessibilityLabel={`${t('company')}. ${t('companyDesc')}`}
          >
            <GlassCard style={selected === 'company' ? [styles.cardSelected, { borderColor: colors.accent }] : undefined}>
              <View style={styles.cardRow}>
                <View style={[
                  styles.iconBox,
                  selected === 'company' && { backgroundColor: colors.accent },
                ]}>
                  <Feather name="briefcase" size={28} color="#fff" />
                </View>
                <View style={styles.cardTexts}>
                  <Text style={[styles.roleTitle, { fontSize: scaledSize(18), color: colors.text }]}>
                    {t('company')}
                  </Text>
                  <Text style={[styles.roleDesc, { fontSize: scaledSize(14), color: colors.textSecondary }]}>
                    {t('companyDesc')}
                  </Text>
                </View>
                <View style={[styles.radio, selected === 'company' && { borderColor: colors.accent }]}>
                  {selected === 'company' && <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />}
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Continue */}
        <View style={styles.buttonContainer}>
          <AnimatedButton
            text={t('continueBtn')}
            onPress={handleContinue}
            disabled={!selected}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  roles: {
    gap: 16,
  },
  cardSelected: {
    borderWidth: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: {
    backgroundColor: COLORS.accent,
  },
  cardTexts: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  roleTitle: {
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  roleDesc: {
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.accent,
  },
  buttonContainer: {
    marginTop: 32,
  },
});

export default RoleSelectScreen;
