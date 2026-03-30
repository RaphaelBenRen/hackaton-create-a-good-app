import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Animated, Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { offersAPI, studentsAPI, recommendationsAPI } from '../../services/api';

/* ── helpers ── */
const typeColor = (type) => type === 'stage' ? COLORS.info : type === 'alternance' ? COLORS.success : COLORS.accent;

/* ── component ── */
const HomeScreen = () => {
  const navigation = useNavigation();
  const { t, scaledSize, userRole, profile, session, colors } = useApp();

  // Company has 2 sub-tabs: Profils / Mes offres
  const [companyTab, setCompanyTab] = useState('profiles');
  const [items, setItems] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /* ── fetch students (for company) using Recommendations API ── */
  const fetchStudents = async (companyOffers) => {
    try {
      let data = [];
      const activeOffer = companyOffers?.find(o => o.is_active);
      
      if (activeOffer) {
        // Use the new Recommendation Engine against their first active offer
        data = await recommendationsAPI.getForOffer(activeOffer.id);
      } else {
        // Fallback to all students if no active offers
        data = await studentsAPI.list();
      }
      
      if (data) setItems(data);
    } catch (err) {
      console.log('Error fetching students:', err);
      Alert.alert(t('error'), 'Erreur lors de la récupération des profils');
    }
  };

  /* ── fetch offers (for student) using Recommendations API ── */
  const fetchOffers = async () => {
    if (!profile?.user_id) return;
    try {
      // Use the new Recommendation Engine
      const data = await recommendationsAPI.getForStudent(profile.user_id);
      if (data) setItems(data);
    } catch (err) {
      console.log('Error fetching offers:', err);
      Alert.alert(t('error'), 'Erreur lors de la récupération des offres recommandées');
    }
  };

  /* ── fetch my offers (for company) ── */
  const fetchMyOffers = async () => {
    if (!profile?.id) return [];
    try {
      const data = await offersAPI.mine();
      if (data) {
        setMyOffers(data);
        return data;
      }
    } catch (err) {
      Alert.alert(t('error'), err.message);
    }
    return [];
  };

  const fetchData = useCallback(async () => {
    if (userRole === 'student') {
      await fetchOffers();
    } else {
      const offers = await fetchMyOffers();
      await fetchStudents(offers);
    }
  }, [userRole, profile]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const toggleOffer = async (offer) => {
    try {
      await offersAPI.update(offer.id, { is_active: !offer.is_active });
      setMyOffers(prev => prev.map(o => o.id === offer.id ? { ...o, is_active: !o.is_active } : o));
    } catch (err) {
      Alert.alert(t('error'), err.message);
    }
  };

  const deleteOffer = (offer) => {
    Alert.alert(t('deleteOffer'), t('confirmDelete'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'), style: 'destructive',
        onPress: async () => {
          try {
            await offersAPI.delete(offer.id);
            setMyOffers(prev => prev.filter(o => o.id !== offer.id));
          } catch (err) {
            Alert.alert(t('error'), err.message);
          }
        },
      },
    ]);
  };

  /* ── offer card (student view) ── */
  const renderOfferCard = ({ item }) => (
    <GlassCard style={styles.card} noPadding>
      <TouchableOpacity
        style={styles.cardBody}
        onPress={() => navigation.navigate('OfferDetail', { offer: item })}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View style={styles.iconBox}>
          <Feather name="briefcase" size={22} color={colors.text} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { fontSize: scaledSize(16), color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.cardSub, { fontSize: scaledSize(13), color: colors.textSecondary }]} numberOfLines={1}>
            {item.companies?.company_name}{item.location ? ` · ${item.location}` : ''}
          </Text>
          <View style={styles.chipRow}>
            <View style={[styles.typeChip, { backgroundColor: `${typeColor(item.type)}20` }]}>
              <Text style={[styles.typeChipText, { color: typeColor(item.type), fontSize: scaledSize(12) }]}>
                {item.type === 'stage' ? t('stage') : t('alternance')}
              </Text>
            </View>
            {item.matchPercentage !== undefined && (
              <View style={[styles.typeChip, { backgroundColor: `${COLORS.accent}20`, marginLeft: 6 }]}>
                <Text style={{ color: COLORS.accent, fontSize: scaledSize(12), fontWeight: 'bold' }}>
                  {item.matchPercentage}% Match 🔥
                </Text>
              </View>
            )}
          </View>
          {item.matchedSkills?.length > 0 && (
            <View style={styles.skillsRow}>
              {item.matchedSkills.slice(0, 3).map((s, i) => (
                <View key={i} style={[styles.skillChip, { borderColor: COLORS.accent }]}>
                  <Text style={[styles.skillChipText, { fontSize: scaledSize(12), color: COLORS.accent }]}>{s}</Text>
                </View>
              ))}
            </View>
          )}
          <Text style={[styles.infoLine, { fontSize: scaledSize(12), color: colors.textTertiary }]}>
            {item.duration || ''}{item.duration && item.salary ? ' · ' : ''}{item.salary || ''}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('OfferDetail', { offer: item })} accessibilityLabel={t('viewDetails')}>
          <Text style={[styles.actionBtnText, { fontSize: scaledSize(13), color: colors.text }]}>{t('viewDetails')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => navigation.navigate('OfferDetail', { offer: item })} accessibilityLabel={t('apply')}>
          <Text style={[styles.actionBtnText, { fontSize: scaledSize(13), color: '#fff' }]}>{t('apply')}</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  /* ── student card (company view) ── */
  const renderStudentCard = ({ item }) => {
    const initials = `${(item.first_name || '')[0] || ''}${(item.last_name || '')[0] || ''}`.toUpperCase();
    const dotColor = item.search_status === 'active' ? COLORS.success : item.search_status === 'open' ? COLORS.info : COLORS.textTertiary;

    return (
      <GlassCard style={styles.card} noPadding>
        <TouchableOpacity
          style={styles.cardBody}
          onPress={() => navigation.navigate('StudentDetail', { student: item })}
          accessibilityRole="button"
          accessibilityLabel={`${item.first_name} ${item.last_name}`}
        >
          <View style={styles.avatarWrap}>
            <LinearGradient colors={[COLORS.accent, COLORS.primary]} style={styles.avatar}>
              <Text style={[styles.avatarText, { fontSize: scaledSize(16) }]}>{initials}</Text>
            </LinearGradient>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { fontSize: scaledSize(16), color: colors.text }]} numberOfLines={1}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={[styles.cardSub, { fontSize: scaledSize(13), color: colors.textSecondary }]} numberOfLines={1}>
              {item.study_field}{item.city ? ` · ${item.city}` : ''}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
              <Text style={[styles.statusLabel, { color: dotColor, fontSize: scaledSize(12) }]}>
                {item.search_status === 'active' ? t('activeSearch') : item.search_status === 'open' ? t('openToOffers') : t('notSearching')}
              </Text>
              {item.matchPercentage !== undefined && (
                <View style={[styles.typeChip, { backgroundColor: `${colors.accent}20`, marginLeft: 8 }]}>
                  <Text style={{ color: colors.accent, fontSize: scaledSize(12), fontWeight: 'bold' }}>
                    {item.matchPercentage}% Match 🔥
                  </Text>
                </View>
              )}
            </View>
            {item.matchedSkills?.length > 0 && (
              <View style={styles.skillsRow}>
                {item.matchedSkills.slice(0, 3).map((s, i) => (
                  <View key={i} style={[styles.skillChip, { borderColor: colors.accent, borderColor: colors.glassBorder }]}>
                    <Text style={[styles.skillChipText, { fontSize: scaledSize(12), color: colors.accent }]}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('StudentDetail', { student: item })} accessibilityLabel={t('viewDetails')}>
            <Text style={[styles.actionBtnText, { fontSize: scaledSize(13), color: colors.text }]}>{t('viewDetails')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => navigation.navigate('StudentDetail', { student: item })} accessibilityLabel={t('invite')}>
            <Text style={[styles.actionBtnText, { fontSize: scaledSize(13), color: '#fff' }]}>{t('invite')}</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  };

  /* ── my offer card (company) ── */
  const renderMyOfferCard = ({ item }) => (
    <GlassCard style={styles.card} noPadding>
      <TouchableOpacity
        style={styles.cardBody}
        onPress={() => navigation.navigate('OfferDetail', { offer: { ...item, companies: profile } })}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View style={styles.iconBox}>
          <Feather name="briefcase" size={22} color={colors.text} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { fontSize: scaledSize(16), color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.chipRow, { gap: 6 }]}>
            <View style={[styles.typeChip, { backgroundColor: `${typeColor(item.type)}20` }]}>
              <Text style={[styles.typeChipText, { color: typeColor(item.type), fontSize: scaledSize(12) }]}>
                {item.type === 'stage' ? t('stage') : t('alternance')}
              </Text>
            </View>
            <View style={[styles.typeChip, { backgroundColor: item.is_active ? `${colors.success}20` : `${colors.error}20` }]}>
              <Text style={{ color: item.is_active ? colors.success : colors.error, fontSize: scaledSize(12), fontWeight: '600' }}>
                {item.is_active ? t('active') : t('inactive')}
              </Text>
            </View>
          </View>
          <Text style={[styles.infoLine, { fontSize: scaledSize(12), color: colors.textSecondary }]}>
            {item.location || ''}{item.duration ? ` · ${item.duration}` : ''}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleOffer(item)} accessibilityLabel={item.is_active ? 'Pause' : 'Activer'}>
          <Feather name={item.is_active ? 'pause' : 'play'} size={14} color={colors.text} />
          <Text style={[styles.actionBtnText, { fontSize: scaledSize(12), marginLeft: 4, color: colors.text }]}>{item.is_active ? 'Pause' : 'Activer'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => deleteOffer(item)} accessibilityLabel={t('delete')}>
          <Feather name="trash-2" size={14} color={colors.error} />
          <Text style={[styles.actionBtnText, { fontSize: scaledSize(12), marginLeft: 4, color: colors.error }]}>{t('delete')}</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  /* ── empty ── */
  const EmptyProfiles = () => (
    <GlassCard style={styles.empty}>
      <Feather name="star" size={50} color={colors.accent} />
      <Text style={[styles.emptyTitle, { fontSize: scaledSize(18), color: colors.text }]}>{userRole === 'student' ? "Aucune recommandation" : "Aucun profil recommandé"}</Text>
      <Text style={[styles.emptyDesc, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{userRole === 'student' ? "Mettez à jour votre profil et votre CV pour avoir de meilleures recommandations." : "Créez une offre pour que l'IA vous recommande les meilleurs profils."}</Text>
    </GlassCard>
  );

  const EmptyOffers = () => (
    <GlassCard style={styles.empty}>
      <Feather name="file-plus" size={50} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { fontSize: scaledSize(18), color: colors.text }]}>{t('noOffers')}</Text>
      <Text style={[styles.emptyDesc, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{t('noOffersCompanyDesc')}</Text>
      <AnimatedButton text={t('createOffer')} onPress={() => navigation.navigate('CreateOffer')} style={{ marginTop: 16, width: '100%' }} />
    </GlassCard>
  );

  /* ── current data ── */
  const isCompanyOffers = userRole === 'company' && companyTab === 'myoffers';
  const listData = isCompanyOffers ? myOffers : items;
  const renderItem = userRole === 'student' ? renderOfferCard : isCompanyOffers ? renderMyOfferCard : renderStudentCard;
  const emptyComponent = isCompanyOffers ? <EmptyOffers /> : <EmptyProfiles />;

  return (
    <GradientBackground variant="default">
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { fontSize: scaledSize(22), color: colors.text }]} accessibilityRole="header">
              Recommandations ✨
            </Text>
            <Text style={[styles.headerSub, { fontSize: scaledSize(14), color: colors.textSecondary }]}>
              {profile?.first_name
                ? `${t('welcome')} ${profile.first_name}`
                : profile?.company_name
                  ? `${t('welcome')} ${profile.company_name}`
                  : t('appName')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {userRole === 'company' && (
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={() => navigation.navigate('CreateOffer')}
                accessibilityRole="button"
                accessibilityLabel={t('createOffer')}
              >
                <Feather name="plus" size={20} color={colors.text} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate('Conversations')}
              accessibilityRole="button"
              accessibilityLabel={t('messages')}
            >
              <Feather name="message-circle" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* company sub-tabs */}
        {userRole === 'company' && (
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, companyTab === 'profiles' && styles.tabActive]}
              onPress={() => setCompanyTab('profiles')}
              accessibilityRole="tab"
              accessibilityState={{ selected: companyTab === 'profiles' }}
            >
              <Feather name="star" size={16} color={companyTab === 'profiles' ? '#fff' : colors.textTertiary} />
              <Text style={[styles.tabText, { fontSize: scaledSize(13), color: colors.textTertiary }, companyTab === 'profiles' && styles.tabTextActive]}>
                Top Profils
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, companyTab === 'myoffers' && styles.tabActive]}
              onPress={() => setCompanyTab('myoffers')}
              accessibilityRole="tab"
              accessibilityState={{ selected: companyTab === 'myoffers' }}
            >
              <Feather name="briefcase" size={16} color={companyTab === 'myoffers' ? '#fff' : colors.textTertiary} />
              <Text style={[styles.tabText, { fontSize: scaledSize(13), color: colors.textTertiary }, companyTab === 'myoffers' && styles.tabTextActive]}>
                {t('myOffers')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* list */}
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={emptyComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerLeft: { flex: 1 },
  headerTitle: { fontWeight: '700' },
  headerSub: { marginTop: 2 },
  headerBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(120,120,120,0.1)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.glassBorder,
  },
  // Sub-tabs for company
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 8, gap: 8 },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 12,
    backgroundColor: 'rgba(120,120,120,0.05)', borderWidth: 1, borderColor: COLORS.glassBorder,
    minHeight: 44,
  },
  tabActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  tabText: { fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '700' },

  list: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 100 },
  card: { marginBottom: 14 },
  cardBody: { flexDirection: 'row', padding: 14, alignItems: 'flex-start' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(120,120,120,0.1)', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontWeight: '600' },
  cardSub: { color: COLORS.textSecondary, marginTop: 2 },
  chipRow: { flexDirection: 'row', marginTop: 6, flexWrap: 'wrap', gap: 4 },
  typeChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 1 },
  typeChipText: { fontWeight: '600' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 4 },
  skillChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(120,120,120,0.05)', borderWidth: 1, borderColor: COLORS.glassBorder },
  skillChipText: { fontWeight: '500' },
  infoLine: { marginTop: 4 },
  actionBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.glassBorder, padding: 8, gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(120,120,120,0.05)', alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  actionBtnPrimary: { backgroundColor: COLORS.accent },
  actionBtnText: { fontWeight: '600' },
  avatarWrap: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden' },
  avatar: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', color: '#fff' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontWeight: '500' },
  empty: { alignItems: 'center', padding: 30, marginTop: 40 },
  emptyTitle: { fontWeight: 'bold', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  emptyDesc: { textAlign: 'center' },
});

export default HomeScreen;
