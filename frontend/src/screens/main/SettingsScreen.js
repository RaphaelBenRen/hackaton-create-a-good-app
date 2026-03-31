import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import GradientBackground from '../../components/GradientBackground';
import { useApp } from '../../services/AppContext';
import { storageAPI } from '../../services/api';

const SettingsScreen = () => {
  const { t, scaledSize, language, setLanguage, textScale, setTextScale, profile, setProfile, session, logout, userRole, loadProfile, isDarkMode, setDarkMode, colors } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [uploading, setUploading] = useState(false);
  const [inclusiveModalVisible, setInclusiveModalVisible] = useState(false);

  const textScales = [
    { key: 1, label: 'A' },
    { key: 1.2, label: 'A+' },
    { key: 1.4, label: 'A++' },
  ];

  const initials = profile?.first_name
    ? `${profile.first_name[0]}${profile.last_name?.[0] || ''}`
    : profile?.company_name ? profile.company_name[0] : '?';

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.company_name || '';

  const handleViewCV = () => {
    if (profile?.cv_url) {
      Linking.openURL(profile.cv_url);
    }
  };

  const getCVName = (url) => {
    if (!url) return 'Mon CV.pdf';
    return decodeURIComponent(url.split('/').pop().replace(/^\d+_/, '')) || 'Mon CV.pdf';
  };

  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.size > 5 * 1024 * 1024) {
          Alert.alert(t('error'), t('fileTooLarge'));
          return;
        }

        setUploading(true);

        try {
          const data = await storageAPI.uploadCV(file.uri, file.name, file.mimeType);
          setProfile({ ...profile, cv_url: data.cv_url });
          Alert.alert(t('success'), t('cvUploaded'));
        } catch (err) {
          Alert.alert(t('error'), err.message || t('errorGeneric'));
        }

        setUploading(false);
      }
    } catch (err) {
      setUploading(false);
      Alert.alert(t('error'), t('errorGeneric'));
    }
  };

  const handleDeleteCV = () => {
    Alert.alert(
      t('delete'),
      t('confirmDeleteCV'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'), style: 'destructive',
          onPress: async () => {
            try {
              await storageAPI.deleteCV();
              setProfile({ ...profile, cv_url: null });
            } catch (err) {
              Alert.alert(t('error'), t('errorGeneric'));
            }
          },
        },
      ]
    );
  };

  return (
    <GradientBackground variant="subtle">
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { fontSize: scaledSize(22), color: colors.text }]} accessibilityRole="header">
          {t('settings')}
        </Text>

        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
          <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.avatarCircle}>
            <Text style={[styles.avatarText, { fontSize: scaledSize(20) }]}>{initials}</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { fontSize: scaledSize(17), color: colors.text }]}>{displayName}</Text>
            <Text style={[styles.profileRole, { fontSize: scaledSize(13), color: colors.textSecondary }]}>
              {userRole === 'student' ? t('student') : t('company')}
            </Text>
          </View>
        </View>

        {/* CV Section — students only */}
        {userRole === 'student' && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(12), color: colors.textSecondary }]}>CV</Text>
            <View style={styles.group}>
              {profile?.cv_url ? (
                <>
                  {/* CV file info */}
                  <View style={[styles.item, styles.itemBorder]}>
                    <View style={[styles.itemIcon, { backgroundColor: `${colors.success}20` }]}>
                      <Feather name="check-circle" size={18} color={colors.success} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, { fontSize: scaledSize(15), color: colors.text }]}>
                        {getCVName(profile.cv_url)}
                      </Text>
                      <Text style={[styles.itemSub, { fontSize: scaledSize(12), color: colors.textSecondary }]}>
                        {t('cvUploaded')}
                      </Text>
                    </View>
                  </View>

                  {/* Open CV */}
                  <TouchableOpacity
                    style={[styles.item, styles.itemBorder]}
                    onPress={handleViewCV}
                    accessibilityRole="button"
                    accessibilityLabel={t('downloadCV')}
                  >
                    <View style={[styles.itemIcon, { backgroundColor: `${colors.accent}20` }]}>
                      <Feather name="external-link" size={18} color={colors.accent} />
                    </View>
                    <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>
                      {t('openCV')}
                    </Text>
                    <Feather name="chevron-right" size={18} color={colors.textTertiary} />
                  </TouchableOpacity>

                  {/* Update CV */}
                  <TouchableOpacity
                    style={[styles.item, styles.itemBorder]}
                    onPress={handleUploadCV}
                    disabled={uploading}
                    accessibilityRole="button"
                    accessibilityLabel={t('updateCV')}
                  >
                    <View style={styles.itemIcon}>
                      <Feather name="upload" size={18} color={colors.text} />
                    </View>
                    <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>
                      {uploading ? t('loading') : t('updateCV')}
                    </Text>
                  </TouchableOpacity>

                  {/* Delete CV */}
                  <TouchableOpacity
                    style={styles.item}
                    onPress={handleDeleteCV}
                    accessibilityRole="button"
                    accessibilityLabel={t('deleteSelectedCV')}
                  >
                    <View style={[styles.itemIcon, { backgroundColor: `${colors.error}20` }]}>
                      <Feather name="trash-2" size={18} color={colors.error} />
                    </View>
                    <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.error }]}>
                      {t('deleteCV')}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.item}
                  onPress={handleUploadCV}
                  disabled={uploading}
                  accessibilityRole="button"
                  accessibilityLabel={t('uploadCV')}
                >
                  <View style={styles.itemIcon}>
                    <Feather name="upload-cloud" size={18} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { fontSize: scaledSize(15), color: colors.text }]}>
                      {uploading ? t('loading') : t('uploadCV')}
                    </Text>
                    <Text style={[styles.itemSub, { fontSize: scaledSize(12), color: colors.textSecondary }]}>
                      {t('uploadCVHint')}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {/* Accessibility */}
        <Text style={[styles.sectionTitle, { fontSize: scaledSize(12), color: colors.textSecondary }]}>{t('accessibility')}</Text>
        <View style={[styles.group, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
          <View style={[styles.item, styles.itemBorder, { borderBottomColor: colors.glassBorder }]}>
            <View style={styles.itemIcon}><Feather name="type" size={18} color={colors.text} /></View>
            <Text style={[styles.itemTitle, { fontSize: scaledSize(15), color: colors.text }]}>{t('textSize')}</Text>
          </View>
          <View style={styles.scaleRow}>
            {textScales.map((s) => (
              <TouchableOpacity
                key={s.key}
                onPress={() => setTextScale(s.key)}
                style={[styles.scaleBtn, { borderColor: colors.glassBorder }, textScale === s.key && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                accessibilityRole="radio"
                accessibilityState={{ selected: textScale === s.key }}
                accessibilityLabel={`${t('textSize')} ${s.label}`}
              >
                <Text style={[
                  styles.scaleBtnText, { fontSize: scaledSize(16), color: colors.textSecondary },
                  textScale === s.key && { color: isDarkMode ? '#fff' : '#fff' },
                ]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language */}
        <Text style={[styles.sectionTitle, { fontSize: scaledSize(12), color: colors.textSecondary }]}>{t('language')}</Text>
        <View style={[styles.group, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
          <TouchableOpacity
            style={[styles.item, { borderBottomWidth: 1, borderBottomColor: colors.glassBorder }]}
            onPress={() => setLanguage('fr')}
            accessibilityRole="radio"
            accessibilityState={{ selected: language === 'fr' }}
          >
            <View style={styles.itemIcon}><Text style={{ fontSize: 18 }}>🇫🇷</Text></View>
            <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>{t('french')}</Text>
            {language === 'fr' && <Feather name="check" size={20} color={colors.accent} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setLanguage('en')}
            accessibilityRole="radio"
            accessibilityState={{ selected: language === 'en' }}
          >
            <View style={styles.itemIcon}><Text style={{ fontSize: 18 }}>🇬🇧</Text></View>
            <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>{t('english')}</Text>
            {language === 'en' && <Feather name="check" size={20} color={colors.accent} />}
          </TouchableOpacity>
        </View>

        {/* Apparence — Dark / Light */}
        <Text style={[styles.sectionTitle, { fontSize: scaledSize(12), color: colors.textSecondary }]}>Apparence</Text>
        <View style={[styles.group, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
          <TouchableOpacity
            style={[styles.item, { borderBottomWidth: 1, borderBottomColor: colors.glassBorder }]}
            onPress={() => setDarkMode(true)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isDarkMode }}
            accessibilityLabel="Mode sombre"
          >
            <View style={[styles.itemIcon, { backgroundColor: isDarkMode ? '#3b82f622' : 'rgba(255,255,255,0.1)' }]}>
              <Feather name="moon" size={18} color={isDarkMode ? colors.accent : colors.textSecondary} />
            </View>
            <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>Mode sombre</Text>
            {isDarkMode && <Feather name="check" size={20} color={colors.accent} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setDarkMode(false)}
            accessibilityRole="radio"
            accessibilityState={{ selected: !isDarkMode }}
            accessibilityLabel="Mode clair"
          >
            <View style={[styles.itemIcon, { backgroundColor: !isDarkMode ? '#2563eb22' : 'rgba(255,255,255,0.1)' }]}>
              <Feather name="sun" size={18} color={!isDarkMode ? colors.accent : colors.textSecondary} />
            </View>
            <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>Mode clair</Text>
            {!isDarkMode && <Feather name="check" size={20} color={colors.accent} />}
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: scaledSize(12), color: colors.textSecondary }]}>{t('account')}</Text>
        <View style={[styles.group, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
          <TouchableOpacity
            style={styles.item}
            accessibilityRole="button"
            onPress={() => {
              const screen = userRole === 'student' ? 'StudentProfile' : 'CompanyProfile';
              navigation.navigate(screen, { profile });
            }}
          >
            <View style={styles.itemIcon}><Feather name="user" size={18} color={colors.text} /></View>
            <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>{t('editProfile')}</Text>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: scaledSize(12), color: colors.textSecondary }]}>♿ Application Inclusive</Text>
        <View style={[styles.group, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
          <TouchableOpacity
            style={[styles.item, styles.itemBorder]}
            onPress={() => setInclusiveModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="En savoir plus sur notre démarche inclusive"
            accessibilityHint="Ouvre une fenêtre expliquant les 5 piliers d'accessibilité de l'application"
          >
            <View style={[styles.itemIcon, { backgroundColor: '#6c63ff22' }]}>
              <Text style={{ fontSize: 18 }}>🌍</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { fontSize: scaledSize(15), color: colors.text }]}>Notre démarche inclusive</Text>
              <Text style={[styles.itemSub, { fontSize: scaledSize(12), color: colors.textSecondary }]}>Multilingue · Lecteur d'écran · Gratuit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={async () => {
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              await AsyncStorage.removeItem('onboardingSeen');
              Alert.alert('✅', language === 'en' ? 'Onboarding reset. Restart the app to see it again.' : "L'onboarding a été réinitialisé. Relancez l'app pour le revoir.");
            }}
            accessibilityRole="button"
            accessibilityLabel="Revoir l'introduction de l'application"
          >
            <View style={[styles.itemIcon, { backgroundColor: '#3b82f622' }]}>
              <Text style={{ fontSize: 18 }}>🔄</Text>
            </View>
            <Text style={[styles.itemTitle, { flex: 1, fontSize: scaledSize(15), color: colors.text }]}>
              {language === 'en' ? 'Replay onboarding' : "Revoir l'introduction"}
            </Text>
            <Text style={[styles.itemSub, { fontSize: scaledSize(12), color: colors.textSecondary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Modal démarche inclusive */}
        <Modal
          visible={inclusiveModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setInclusiveModalVisible(false)}
          accessibilityViewIsModal
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#0d1b2e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48, maxHeight: '85%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: '#fff', fontSize: scaledSize(20), fontWeight: '800' }}>♿ App Inclusive</Text>
                <TouchableOpacity onPress={() => setInclusiveModalVisible(false)} accessibilityLabel="Fermer" accessibilityRole="button">
                  <Text style={{ color: '#ff7675', fontSize: 24 }}>✕</Text>
                </TouchableOpacity>
              </View>
              {[
                { icon: '👁️', title: 'Visuelle', desc: 'Contraste ≥ 4.5:1, taille texte ajustable, VoiceOver & TalkBack' },
                { icon: '🧠', title: 'Cognitive', desc: 'Interface simple, icônes claires, feedback immédiat' },
                { icon: '🤝', title: 'Sociale', desc: 'FR/EN, écriture inclusive, zéro biais discriminant' },
                { icon: '⚡', title: 'Performance', desc: '100% gratuit pour tous les utilisateurs' },
                { icon: '🔊', title: 'Auditive', desc: 'Notifications visuelles alternatives aux alertes sonores' },
              ].map((p) => (
                <View key={p.title} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
                  <Text style={{ fontSize: 22, marginRight: 14, marginTop: 2 }}>{p.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: scaledSize(15), fontWeight: '700', marginBottom: 2 }}>{p.title}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: scaledSize(13), lineHeight: 20 }}>{p.desc}</Text>
                  </View>
                </View>
              ))}
              <View style={{ marginTop: 8, padding: 14, backgroundColor: '#6c63ff22', borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#6c63ff' }}>
                <Text style={{ color: '#a78bfa', fontSize: scaledSize(13), fontWeight: '600' }}>Albatros s'engage pour une app accessible à toutes et tous, sans barrières.</Text>
              </View>
            </View>
          </View>
        </Modal>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.glassBackground, borderColor: colors.error }]}
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel={t('logout')}
        >
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={[styles.logoutText, { fontSize: scaledSize(16), color: colors.error }]}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  title: { fontWeight: '700', marginBottom: 20 },
  profileCard: {
    marginBottom: 10, padding: 20, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
  },
  avatarCircle: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontWeight: '600', color: '#fff' },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: { fontWeight: '600' },
  profileRole: { marginTop: 2 },
  sectionTitle: {
    fontWeight: '600',
    letterSpacing: 1, marginLeft: 4, marginTop: 25, marginBottom: 10,
    textTransform: 'uppercase',
  },
  group: {
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 1,
  },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, minHeight: 52 },
  itemBorder: { borderBottomWidth: 1 },
  itemIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(120,120,120,0.1)',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  itemTitle: { fontWeight: '500' },
  itemSub: { marginTop: 2 },
  scaleRow: { flexDirection: 'row', gap: 8, padding: 12 },
  scaleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderWidth: 1, minHeight: 44,
  },
  scaleBtnText: { fontWeight: '600' },
  logoutBtn: {
    borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    marginTop: 25, gap: 10, minHeight: 48,
  },
  logoutText: { fontWeight: '600' },
});

export default SettingsScreen;
