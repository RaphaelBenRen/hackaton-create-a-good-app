import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import ToastBanner from '../../components/ToastBanner';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { applicationsAPI, storageAPI } from '../../services/api';

const OfferDetailScreen = ({ route }) => {
  const { offer } = route.params;
  const { t, scaledSize, session, userRole, profile, language, colors } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const checkApplication = async () => {
      if (userRole !== 'student' || !session?.user) {
        setCheckingApplied(false);
        return;
      }
      try {
        const { applied } = await applicationsAPI.check(offer.id);
        if (applied) setHasApplied(true);
      } catch (err) {
        Alert.alert(t('error'), err.message);
      }
      setCheckingApplied(false);
    };
    checkApplication();
  }, [offer.id, session, userRole]);

  const handlePickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCvFile(result.assets[0]);
      }
    } catch (err) {}
  };

  const handlePickCoverLetter = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCoverLetterFile(result.assets[0]);
      }
    } catch (err) {}
  };

  const handleApply = async () => {
    if (!cvFile && !profile?.cv_url) {
      toast.current?.show({ message: 'Un CV est obligatoire pour postuler.', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    try {
      let applyCvUrl = profile?.cv_url || null;
      if (cvFile) {
         const data = await storageAPI.uploadCV(cvFile.uri, cvFile.name, cvFile.mimeType || 'application/pdf');
         applyCvUrl = data.cv_url;
      }

      let applyCoverLetterUrl = null;
      if (coverLetterFile) {
         const clData = await storageAPI.uploadDocument(coverLetterFile.uri, coverLetterFile.name, coverLetterFile.mimeType || 'application/pdf');
         applyCoverLetterUrl = clData.url;
      }

      await applicationsAPI.create({
        offer_id: offer.id,
        student_id: session.user.id,
        company_id: offer.company_id,
        status: 'pending',
        cover_letter: coverLetter,
        cv_url: applyCvUrl,
        cover_letter_url: applyCoverLetterUrl
      });
      setHasApplied(true);
      setModalVisible(false);
      setCoverLetter('');
      toast.current?.show({ message: t('applicationSent'), subtext: offer.title, type: 'success', duration: 4000 });
    } catch (err) {
      toast.current?.show({ message: t('error'), subtext: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSpeech = async () => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    const lang = language === 'en' ? 'en-US' : 'fr-FR';
    const text = [
      offer.title,
      offer.companies?.company_name ? `Entreprise : ${offer.companies.company_name}` : '',
      offer.location ? `Lieu : ${offer.location}` : '',
      offer.duration ? `Durée : ${offer.duration}` : '',
      offer.salary ? `Rémunération : ${offer.salary}` : '',
      offer.description || '',
      Array.isArray(offer.skills_required) && offer.skills_required.length > 0
        ? `Compétences requises : ${offer.skills_required.join(', ')}`
        : '',
    ].filter(Boolean).join('. ');

    setIsSpeaking(true);
    Speech.speak(text, {
      language: lang,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const company = offer.companies || {};
  const skillsList = Array.isArray(offer.skills_required)
    ? offer.skills_required
    : typeof offer.skills_required === 'string'
      ? offer.skills_required.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const typeBadgeColor = offer.type === 'alternance' ? colors.accent : colors.success;

  return (
    <>
    <GradientBackground variant="subtle">
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('back') || 'Back'}
        >
          <Feather name="chevron-left" size={24} color={isDarkMode ? "#fff" : colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: scaledSize(22) }]} accessibilityRole="header">
          {t('offerDetails')}
        </Text>
        {/* Audio TTS button */}
        <TouchableOpacity
          onPress={handleToggleSpeech}
          style={[styles.backButton, isSpeaking && { backgroundColor: colors.accent + '40', borderColor: colors.accent, borderWidth: 1.5 }]}
          accessibilityRole="button"
          accessibilityLabel={isSpeaking ? 'Arrêter la lecture' : "Lire l'offre à voix haute"}
          accessibilityHint="Lit les détails de l'offre à voix haute grâce au synthétiseur vocal"
        >
          <Feather name={isSpeaking ? 'volume-x' : 'volume-2'} size={20} color={isSpeaking ? colors.accent : (isDarkMode ? '#fff' : colors.text)} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Main offer info */}
        <GlassCard>
          <Text style={[styles.offerTitle, { fontSize: scaledSize(22), color: colors.text }]}>{offer.title}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, { backgroundColor: `${typeBadgeColor}20`, borderColor: typeBadgeColor }]}>
              <Text style={[styles.typeBadgeText, { color: typeBadgeColor, fontSize: scaledSize(13) }]}>
                {offer.type === 'alternance' ? t('alternance') : t('stage')}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Feather name="briefcase" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { fontSize: scaledSize(14), color: colors.textSecondary }]}>
              {company.company_name || ''}
            </Text>
          </View>
          {offer.location ? (
            <View style={styles.metaRow}>
              <Feather name="map-pin" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{offer.location}</Text>
            </View>
          ) : null}
        </GlassCard>

        {/* Description */}
        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scaledSize(18), color: colors.text }]}>Description</Text>
          <Text style={[styles.bodyText, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{offer.description}</Text>
        </GlassCard>

        {/* Skills */}
        {skillsList.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(18), color: colors.text }]}>{t('requiredSkills')}</Text>
            <View style={styles.chips}>
              {skillsList.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={[styles.skillChipText, { fontSize: scaledSize(13), color: colors.text }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Info details */}
        <GlassCard style={styles.section}>
          {offer.duration ? (
            <View style={styles.infoRow}>
              <Feather name="clock" size={18} color={colors.accent} />
              <Text style={[styles.infoText, { fontSize: scaledSize(14), color: colors.text }]}>{offer.duration}</Text>
            </View>
          ) : null}
          {offer.salary ? (
            <View style={styles.infoRow}>
              <Feather name="dollar-sign" size={18} color={colors.accent} />
              <Text style={[styles.infoText, { fontSize: scaledSize(14), color: colors.text }]}>{offer.salary}</Text>
            </View>
          ) : null}
          {(offer.start_date || offer.end_date) ? (
            <View style={styles.infoRow}>
              <Feather name="calendar" size={18} color={colors.accent} />
              <Text style={[styles.infoText, { fontSize: scaledSize(14), color: colors.text }]}>
                {offer.start_date || '?'} — {offer.end_date || '?'}
              </Text>
            </View>
          ) : null}
        </GlassCard>

        {/* Original PDF Offer */}
        {offer.pdf_url && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), marginBottom: 12, color: colors.text }]}>Document Original</Text>
            <TouchableOpacity
              style={styles.cvButton}
              onPress={() => WebBrowser.openBrowserAsync(offer.pdf_url)}
            >
              <Feather name="external-link" size={18} color={colors.accent} />
              <Text style={[styles.cvButtonText, { fontSize: scaledSize(14), color: colors.accent }]}>
                Voir l'offre en PDF
              </Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* About company */}
        {company.company_name ? (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(18) }]}>{t('aboutCompany')}</Text>
            <Text style={[styles.companyName, { fontSize: scaledSize(16) }]}>{company.company_name}</Text>
            {company.sector ? (
              <View style={styles.metaRow}>
                <Feather name="grid" size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { fontSize: scaledSize(13), color: colors.textSecondary }]}>{company.sector}</Text>
              </View>
            ) : null}
            {company.company_size ? (
              <View style={styles.metaRow}>
                <Feather name="users" size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { fontSize: scaledSize(13), color: colors.textSecondary }]}>{company.company_size}</Text>
              </View>
            ) : null}
            {company.description ? (
              <Text style={[styles.bodyText, { fontSize: scaledSize(14), marginTop: 10 }]}>
                {company.description}
              </Text>
            ) : null}
          </GlassCard>
        ) : null}

        {/* Apply button (students only) */}
        {userRole === 'student' && !checkingApplied && (
          <View style={styles.applySection}>
            {hasApplied ? (
              <AnimatedButton
                text={t('alreadyApplied')}
                disabled={true}
                variant="secondary"
                accessibilityLabel={t('alreadyApplied')}
              />
            ) : (
              <AnimatedButton
                text={t('apply') || 'Postuler'}
                onPress={() => setModalVisible(true)}
                accessibilityLabel={t('apply') || 'Postuler'}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Application Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.modalOverlay, { backgroundColor: colors.background }]}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('close') || 'Close'}
          />
          <ScrollView contentContainerStyle={styles.modalContent}>
            <GlassCard style={{ marginTop: insets.top + 20 }}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { fontSize: scaledSize(18), color: colors.text }]}>
                  {t('apply') || 'Postuler'}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={t('close') || 'Close'}
                >
                  <Feather name="x" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>
                {t('coverLetter') || 'Message / Lettre de motivation'} (Optionnel)
              </Text>
              <TextInput
                style={[styles.input, styles.multiline, { fontSize: scaledSize(16), color: colors.text, borderColor: colors.glassBorder }]}
                placeholder={t('coverLetterPlaceholder') || 'Écrire un message court...'}
                placeholderTextColor={colors.textTertiary}
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                accessible={true}
                accessibilityLabel={t('coverLetter') || 'Lettre de motivation'}
              />
              <TouchableOpacity
                style={[styles.input, { flexDirection: 'row', alignItems: 'center', minHeight: 50, marginTop: 12, borderColor: colors.glassBorder }]}
                onPress={handlePickCoverLetter}
              >
                <Feather name={coverLetterFile ? "check" : "upload"} size={20} color={coverLetterFile ? colors.success : colors.textTertiary} style={{ marginRight: 10 }}/>
                <Text style={{ color: coverLetterFile ? colors.success : colors.text, flex: 1 }}>
                  {coverLetterFile ? coverLetterFile.name : "Ou joindre une lettre de motivation (PDF)"}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 16 }]}>
                {t('resume') || 'CV'} * (Obligatoire)
              </Text>
              <TouchableOpacity
                style={[styles.input, { flexDirection: 'row', alignItems: 'center', minHeight: 50, borderColor: colors.glassBorder }]}
                onPress={handlePickCV}
              >
                <Feather name={cvFile ? "check" : "upload"} size={20} color={cvFile ? colors.success : colors.textTertiary} style={{ marginRight: 10 }}/>
                <Text style={{ color: cvFile ? colors.success : colors.text, flex: 1 }}>
                  {cvFile ? cvFile.name : (profile?.cv_url ? "Utiliser le CV de mon profil" : "Joindre un CV (PDF)")}
                </Text>
              </TouchableOpacity>

              <AnimatedButton
                text={submitting ? '...' : (t('send') || 'Envoyer')}
                onPress={handleApply}
                disabled={submitting}
                style={{ marginTop: 16 }}
                accessibilityLabel={t('send') || 'Envoyer'}
              />
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </GradientBackground>
    <ToastBanner ref={toast} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  offerTitle: { fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  badgeRow: { flexDirection: 'row', marginBottom: 14 },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeBadgeText: { fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  metaText: { color: COLORS.textSecondary },
  section: { marginTop: 14 },
  sectionTitle: { fontWeight: '700', color: '#fff', marginBottom: 10 },
  bodyText: { color: COLORS.textSecondary, lineHeight: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  skillChipText: { color: '#fff' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { color: '#fff', fontWeight: '500' },
  companyName: { fontWeight: '600', color: '#fff', marginBottom: 6 },
  applySection: { marginTop: 20 },
  cvButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.accent,
    backgroundColor: 'rgba(59,130,246,0.08)', minHeight: 44,
  },
  cvButtonText: { color: COLORS.accent, fontWeight: '600' },
  // Modal
  modalOverlay: { flex: 1 },
  modalContent: { paddingHorizontal: 20, paddingBottom: 40 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: { fontWeight: '700', color: '#fff' },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontWeight: '600', color: '#fff', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  multiline: { minHeight: 140, textAlignVertical: 'top' },
});

export default OfferDetailScreen;
