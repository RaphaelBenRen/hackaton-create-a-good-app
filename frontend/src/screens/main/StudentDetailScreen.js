import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity,
   Modal, FlatList,
 } from 'react-native';
 import * as WebBrowser from 'expo-web-browser';
import * as Speech from 'expo-speech';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import ToastBanner from '../../components/ToastBanner';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { offersAPI, applicationsAPI } from '../../services/api';

const searchStatusConfig = {
  active: { color: COLORS.success, labelKey: 'activeSearch' },
  open: { color: COLORS.warning, labelKey: 'openToOffers' },
  not_searching: { color: COLORS.textTertiary, labelKey: 'notSearching' },
};

const StudentDetailScreen = ({ route }) => {
  const { student } = route.params;
  const { t, scaledSize, session, userRole, profile, language, colors, isDarkMode } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [inviting, setInviting] = useState(false);
  const [invitedOffers, setInvitedOffers] = useState([]); // Array of offer IDs already invited
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [companyOffers, setCompanyOffers] = useState([]);
  const [showOfferPicker, setShowOfferPicker] = useState(false);
  const toast = useRef(null);

  const initials = `${(student.first_name || '')[0] || ''}${(student.last_name || '')[0] || ''}`.toUpperCase();

  const skillsList = Array.isArray(student.skills)
    ? student.skills
    : typeof student.skills === 'string'
      ? student.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const statusKey = student.search_status || 'active';
  const statusInfo = searchStatusConfig[statusKey] || searchStatusConfig.active;

  // Fetch company offers for invite and check if already invited
  useEffect(() => {
    if (userRole === 'company' && profile?.id) {
      // Fetch offers
      offersAPI.mine()
        .then((data) => {
          if (data) setCompanyOffers(data);
        })
        .catch((err) => {
          toast.current?.show({ message: t('error'), subtext: err.message, type: 'error' });
        });
      
      // General check: fetch all offers this company has invited this student for
      applicationsAPI.checkAsCompany(student.user_id || student.id)
        .then(res => {
          if (res.invitedOfferIds) setInvitedOffers(res.invitedOfferIds);
        })
        .catch(err => console.log('Check general invitation error:', err));
    }
  }, [userRole, profile, student.id, student.user_id]);

  const handleToggleSpeech = async () => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) { Speech.stop(); setIsSpeaking(false); return; }
    const lang = language === 'en' ? 'en-US' : 'fr-FR';

    const educationText = Array.isArray(student.education) && student.education.length > 0
      ? 'Formations : ' + student.education.map(e => `${e.degree || ''} à ${e.institution || ''}${e.year ? ', ' + e.year : ''}`).join('. ')
      : '';

    const expText = Array.isArray(student.experiences) && student.experiences.length > 0
      ? 'Expériences : ' + student.experiences.map(e => `${e.title || ''} chez ${e.company || ''}${e.duration ? ', ' + e.duration : ''}`).join('. ')
      : '';

    const qualitiesText = Array.isArray(student.qualities) && student.qualities.length > 0
      ? 'Qualités : ' + student.qualities.join(', ')
      : '';

    const parts = [
      `${student.first_name || ''} ${student.last_name || ''}`.trim(),
      student.study_field ? `Domaine d'études : ${student.study_field}` : '',
      student.city ? `Ville : ${student.city}` : '',
      student.bio || '',
      educationText,
      expText,
      skillsList.length > 0 ? `Compétences : ${skillsList.join(', ')}` : '',
      qualitiesText,
      student.search_type ? `Type de recherche : ${student.search_type}` : '',
    ].filter(Boolean);

    setIsSpeaking(true);
    Speech.speak(parts.join('. '), {
      language: lang, rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleInvite = async (offerId) => {
    setShowOfferPicker(false);
    setInviting(true);

    try {
      const payload = {
        offer_id: offerId,
        student_id: student.user_id || student.id,
        company_id: profile.id,
        status: 'pending',
        type: 'invite', // Explicitly set type to invite
        cover_letter: t('inviteStudent'),
      };
      await applicationsAPI.create(payload);
      Alert.alert(t('success'), t('invitationSent') || 'Invitation envoyée !');
      setInvitedOffers(prev => [...prev, offerId]);
    } catch (err) {
      if (err.message?.includes('23505') || err.message?.includes('duplicate')) {
        Alert.alert('', t('alreadyInvited'));
      } else {
        Alert.alert(t('error'), err.message);
      }
    } finally {
      setInviting(false);
    }
  };

  const onInvitePress = () => {
    if (companyOffers.length === 0) {
      Alert.alert('', t('noOffers') || 'Vous devez d\'abord créer une offre');
      return;
    }
    if (companyOffers.length === 1) {
      handleInvite(companyOffers[0].id);
      return;
    }
    setShowOfferPicker(true);
  };

  const handleContact = () => {
    navigation.navigate('Chat', {
      conversationId: null,
      otherUserId: student.user_id,
      otherName: `${student.first_name} ${student.last_name}`,
      offerId: null,
    });
  };

  const handleDownloadCV = async () => {
    if (!student.cv_url) return;
    try {
      await WebBrowser.openBrowserAsync(student.cv_url);
    } catch (err) {
      Alert.alert(t('error'), 'Impossible d\'ouvrir le CV.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '?';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <>
    <GradientBackground variant="subtle">
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Feather name="chevron-left" size={24} color={isDarkMode ? "#fff" : colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: scaledSize(17), color: colors.text }]}>
          {t('studentDetails')}
        </Text>
        <TouchableOpacity
          onPress={handleToggleSpeech}
          style={[styles.backButton, isSpeaking && { backgroundColor: colors.accent + '40', borderColor: colors.accent, borderWidth: 1.5 }]}
          accessibilityRole="button"
          accessibilityLabel={isSpeaking ? 'Arrêter la lecture' : 'Lire le profil à voix haute'}
          accessibilityHint="Lit les informations du profil à voix haute"
        >
            <Feather name={isSpeaking ? 'volume-x' : 'volume-2'} size={20} color={isSpeaking ? colors.accent : (isDarkMode ? '#fff' : colors.text)} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={[styles.initialsText, { fontSize: scaledSize(28) }]}>{initials}</Text>
          </LinearGradient>

          <Text style={[styles.studentName, { fontSize: scaledSize(22), color: colors.text }]}>
            {student.first_name} {student.last_name}
          </Text>

          {student.study_field && (
            <Text style={[styles.studyField, { fontSize: scaledSize(14), color: colors.textSecondary }]}>
              {student.study_field}
            </Text>
          )}

          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color, fontSize: scaledSize(13) }]}>
              {t(statusInfo.labelKey)}
            </Text>
          </View>
        </View>

        {/* About */}
        {student.bio ? (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>
              {t('bio')}
            </Text>
            <Text style={[styles.bodyText, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{student.bio}</Text>
          </GlassCard>
        ) : null}

        {/* Education */}
        {Array.isArray(student.education) && student.education.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>Formations</Text>
            {student.education.map((edu, idx) => (
              <View key={idx} style={{ marginBottom: 12, borderBottomWidth: idx < student.education.length - 1 ? 1 : 0, borderBottomColor: colors.glassBorder, paddingBottom: 8 }}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: scaledSize(15) }}>{edu.degree}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: scaledSize(14) }}>{edu.institution}</Text>
                {edu.year ? <Text style={{ color: colors.accent, fontSize: scaledSize(13), marginTop: 2 }}>{edu.year}</Text> : null}
              </View>
            ))}
          </GlassCard>
        )}

        {/* Experiences */}
        {Array.isArray(student.experiences) && student.experiences.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>Expériences</Text>
            {student.experiences.map((exp, idx) => (
              <View key={idx} style={{ marginBottom: 12, borderBottomWidth: idx < student.experiences.length - 1 ? 1 : 0, borderBottomColor: colors.glassBorder, paddingBottom: 8 }}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: scaledSize(15) }}>{exp.title}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: scaledSize(14) }}>{exp.company}</Text>
                {exp.duration ? <Text style={{ color: colors.accent, fontSize: scaledSize(13), marginTop: 2 }}>{exp.duration}</Text> : null}
              </View>
            ))}
          </GlassCard>
        )}

        {/* Skills */}
        {skillsList.length > 0 && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>
              {t('skills')}
            </Text>
            <View style={styles.chips}>
              {skillsList.map((skill, index) => (
                <View key={index} style={[styles.skillChip, { borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}>
                  <Text style={[styles.skillChipText, { fontSize: scaledSize(13), color: colors.text }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Search preferences */}
        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>
            {t('searchType')}
          </Text>

          {student.search_type && (
            <View style={styles.infoRow}>
              <Feather name="target" size={18} color={colors.accent} />
              <Text style={[styles.infoText, { fontSize: scaledSize(14), color: colors.text }]}>
                {student.search_type === 'stage' ? t('stage') :
                 student.search_type === 'alternance' ? t('alternance') : t('both')}
              </Text>
            </View>
          )}

          {student.city && (
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={18} color={colors.accent} />
              <Text style={[styles.infoText, { fontSize: scaledSize(14), color: colors.text }]}>
                {student.city}
                {student.mobility_radius ? ` (${student.mobility_radius} km)` : ''}
              </Text>
            </View>
          )}

          {(student.contract_start_date || student.contract_end_date) && (
            <View style={styles.infoRow}>
              <Feather name="calendar" size={18} color={colors.accent} />
              <Text style={[styles.infoText, { fontSize: scaledSize(14), color: colors.text }]}>
                {formatDate(student.contract_start_date)} — {formatDate(student.contract_end_date)}
              </Text>
            </View>
          )}

          {student.phone && (
            <View style={styles.infoRow}>
              <Feather name="phone" size={18} color={colors.accent} />
              <Text style={[styles.infoText, { fontSize: scaledSize(14), color: colors.text }]}>
                {student.phone}
              </Text>
            </View>
          )}
        </GlassCard>

        {/* CV section */}
        {student.cv_url && (
          <GlassCard style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>CV</Text>

            {/* CV file info */}
            <View style={styles.cvFileRow}>
              <View style={styles.cvFileIcon}>
                <Feather name="file-text" size={24} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cvFileName, { fontSize: scaledSize(14), color: colors.text }]} numberOfLines={1}>
                  {student.cv_url.split('/').pop() || 'cv.pdf'}
                </Text>
                <Text style={[styles.cvFileSub, { fontSize: scaledSize(12), color: colors.textSecondary }]}>PDF</Text>
              </View>
            </View>

            {/* Open CV button */}
            <TouchableOpacity
              style={[styles.cvButton, { borderColor: colors.accent, backgroundColor: colors.accent + '15' }]}
              onPress={handleDownloadCV}
              accessibilityRole="button"
              accessibilityLabel={t('downloadCV')}
            >
              <Feather name="external-link" size={18} color={colors.accent} />
              <Text style={[styles.cvButtonText, { fontSize: scaledSize(14), color: colors.accent }]}>
                {t('openCV')}
              </Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Company actions */}
        {userRole === 'company' && (
          <View style={styles.actionsSection}>
            <AnimatedButton
              text={
                companyOffers.length === 1 && invitedOffers.includes(companyOffers[0]?.id)
                  ? (t('invitationSent') || 'Invitation envoyée !')
                  : (inviting ? t('loading') : t('inviteStudent'))
              }
              onPress={onInvitePress}
              disabled={inviting || (companyOffers.length === 1 && invitedOffers.includes(companyOffers[0]?.id))}
            />
            <View style={{ height: 12 }} />
            <AnimatedButton
              text={t('contactStudent')}
              onPress={handleContact}
              variant="secondary"
            />
          </View>
        )}
      </ScrollView>

      {/* Offer picker modal */}
      <Modal visible={showOfferPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.glassBorder }]}>
            <Text style={[styles.modalTitle, { fontSize: scaledSize(18), color: colors.text }]}>
              {t('chooseOffer') || 'Choisir une offre'}
            </Text>
            <Text style={[styles.modalSubtitle, { fontSize: scaledSize(13), color: colors.textSecondary }]}>
              {t('chooseOfferDesc') || 'Pour quelle offre voulez-vous inviter cet·te étudiant·e ?'}
            </Text>
            <FlatList
              data={companyOffers}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.offerItem, 
                    { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)', borderColor: colors.glassBorder },
                    invitedOffers.includes(item.id) && { opacity: 0.6 }
                  ]}
                  onPress={() => !invitedOffers.includes(item.id) && handleInvite(item.id)}
                  disabled={invitedOffers.includes(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                >
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={[styles.offerItemTitle, { fontSize: scaledSize(15), color: colors.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.offerItemType, { fontSize: scaledSize(12), color: colors.textSecondary }]}>
                      {invitedOffers.includes(item.id) ? (t('invitationSent') || 'Déjà invité') : (item.type === 'stage' ? t('stage') : t('alternance'))}
                    </Text>
                  </View>
                  {invitedOffers.includes(item.id) ? (
                    <Feather name="check-circle" size={18} color={COLORS.success} />
                  ) : (
                    <Feather name="chevron-right" size={18} color={colors.accent} />
                  )}
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowOfferPicker(false)}
              accessibilityRole="button"
              accessibilityLabel={t('cancel')}
            >
              <Text style={[styles.modalCancelText, { fontSize: scaledSize(15) }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: 'rgba(120,120,120,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  headerTitle: { fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  // Profile header
  profileHeader: { alignItems: 'center', marginBottom: 20, marginTop: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initialsText: { fontWeight: 'bold', color: '#fff' },
  studentName: { fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  studyField: { color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontWeight: '600' },

  // Sections
  section: { marginTop: 14 },
  sectionTitle: { fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  bodyText: { color: COLORS.textSecondary, lineHeight: 22 },

  // Skills
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  skillChipText: { color: COLORS.text, fontWeight: '500' },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { color: COLORS.text, fontWeight: '500' },

  // CV
  cvFileRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12,
  },
  cvFileIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  cvFileName: { color: COLORS.text, fontWeight: '600' },
  cvFileSub: { color: COLORS.textSecondary, marginTop: 2 },
  cvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    minHeight: 44,
  },
  cvButtonText: { color: COLORS.accent, fontWeight: '600' },

  // Actions
  actionsSection: { marginTop: 24 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  modalTitle: { fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  modalSubtitle: { color: COLORS.textSecondary, marginBottom: 16 },
  offerItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(120,120,120,0.05)',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(120,120,120,0.1)',
  },
  offerItemTitle: { fontWeight: '600', color: COLORS.text },
  offerItemType: { color: COLORS.textSecondary, marginTop: 2 },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
    minHeight: 44,
  },
  modalCancelText: { color: COLORS.error, fontWeight: '600' },
});

export default StudentDetailScreen;
