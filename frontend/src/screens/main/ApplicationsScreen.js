import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
  Animated, Alert, Linking, ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import { COLORS, SIZES } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { applicationsAPI } from '../../services/api';

/* ──────────────────── status config ──────────────────── */

const statusConfig = {
  pending:  { color: COLORS.warning, icon: 'clock' },
  accepted: { color: COLORS.success, icon: 'check-circle' },
  rejected: { color: COLORS.error,   icon: 'x-circle' },
};

/* ──────────────────── component ──────────────────── */

const ApplicationsScreen = () => {
  const navigation = useNavigation();
  const { t, scaledSize, session, userRole, profile, colors, isDarkMode } = useApp();

  const FILTER_TABS = [
    { key: 'all', label: t('allApplications') },
    { key: 'pending', label: t('pendingApplications') },
    { key: 'accepted', label: t('acceptedApplications') },
    { key: 'rejected', label: t('rejectedApplications') },
  ];
  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  /* ── fetch ── */
  const fetchApplications = useCallback(async () => {
    if (!session?.user) return;

    try {
      if (userRole === 'student') {
        const data = await applicationsAPI.studentList();
        if (data) setApplications(data);
      } else {
        const data = await applicationsAPI.companyList();
        if (data) setApplications(data);
      }
    } catch (err) {
      Alert.alert(t('error'), err.message);
    }
  }, [session, userRole, profile]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  /* ── actions ── */
  const handleAccept = async (app) => {
    try {
      await applicationsAPI.update(app.id, { status: 'accepted' });
      fetchApplications();
    } catch (err) {
      Alert.alert(t('error'), err.message);
    }
  };

  const handleReject = async (app) => {
    try {
      await applicationsAPI.update(app.id, { status: 'rejected' });
      fetchApplications();
    } catch (err) {
      Alert.alert(t('error'), err.message);
    }
  };

  const handleWithdraw = (app) => {
    Alert.alert(
      t('confirmWithdraw') || 'Retirer la candidature ?',
      t('confirmWithdrawDesc') || 'Cette action est irr\u00e9versible.',
      [
        { text: t('cancel') || 'Annuler', style: 'cancel' },
        {
          text: t('withdraw') || 'Retirer',
          style: 'destructive',
          onPress: async () => {
            try {
              await applicationsAPI.delete(app.id);
              fetchApplications();
            } catch (err) {
              Alert.alert(t('error'), err.message);
            }
          },
        },
      ],
    );
  };

  /* ── helpers ── */
  const getStatusLabel = (status) => {
    const map = { pending: t('pending'), accepted: t('accepted'), rejected: t('rejected') };
    return map[status] || status;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  /* ── filtered list ── */
  const filteredApps = activeTab === 'all'
    ? applications
    : applications.filter((a) => a.status === activeTab);

  /* ── render card ── */
  const renderItem = ({ item }) => {
    const config = statusConfig[item.status] || statusConfig.pending;

    return (
      <GlassCard style={styles.card} noPadding>
        <TouchableOpacity 
          style={styles.cardBody}
          onPress={() => {
            if (userRole === 'student' && item.offers) {
              navigation.navigate('OfferDetail', { offer: item.offers });
            } else if (userRole === 'company' && item.students) {
              navigation.navigate('StudentDetail', { student: item.students });
            }
          }}
          activeOpacity={0.7}
        >
          {/* status icon */}
          <View
            style={[styles.statusIcon, { backgroundColor: `${config.color}20` }]}
            accessible
            accessibilityLabel={getStatusLabel(item.status)}
          >
            <Feather name={config.icon} size={22} color={config.color} />
          </View>

          <View style={styles.cardInfo}>
            {/* offer title */}
            <Text style={[styles.cardTitle, { fontSize: scaledSize(16), color: colors.text }]} numberOfLines={1}>
              {item.offers?.title || ''}
            </Text>

            {/* company or student name */}
            <Text style={[styles.cardSecondary, { fontSize: scaledSize(13), color: colors.textSecondary }]} numberOfLines={1}>
              {userRole === 'student'
                ? item.offers?.companies?.company_name || ''
                : `${item.students?.first_name || ''} ${item.students?.last_name || ''}`}
            </Text>

            {/* applied date */}
            <Text style={[styles.dateText, { fontSize: scaledSize(13), color: colors.textTertiary }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>

          {/* status badge */}
          <View style={[styles.statusBadge, { backgroundColor: `${config.color}20` }]}>
            <Text style={[styles.statusBadgeText, { color: config.color, fontSize: scaledSize(13) }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Cover letter & CV box for company */}
        {userRole === 'company' && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
            {item.cover_letter ? (
              <View style={styles.coverLetterBox}>
                <Text style={{ color: colors.textSecondary, fontSize: scaledSize(13), fontStyle: 'italic', lineHeight: 20 }}>
                  "{item.cover_letter}"
                </Text>
              </View>
            ) : null}
            {item.cv_url && (
              <TouchableOpacity 
                style={styles.viewCvBtn}
                onPress={() => Linking.openURL(item.cv_url)}
              >
                <Feather name="file-text" size={16} color={colors.info} style={{ marginRight: 6 }} />
                <Text style={{ color: colors.info, fontSize: scaledSize(14), fontWeight: '600' }}>Voir le CV</Text>
              </TouchableOpacity>
            )}
            {item.cover_letter_url && (
              <TouchableOpacity 
                style={[styles.viewCvBtn, { marginTop: 8 }]}
                onPress={() => Linking.openURL(item.cover_letter_url)}
              >
                <Feather name="paperclip" size={16} color={colors.info} style={{ marginRight: 6 }} />
                <Text style={{ color: colors.info, fontSize: scaledSize(14), fontWeight: '600' }}>Lettre de motivation jointe</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── action buttons ── */}
        {renderActions(item)}
      </GlassCard>
    );
  };

  const renderActions = (item) => {
    // Company: pending -> Accept + Reject
    if (userRole === 'company' && item.status === 'pending') {
      return (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${COLORS.success}20`, minHeight: 44 }]}
            onPress={() => handleAccept(item)}
            accessibilityRole="button"
            accessibilityLabel={t('accept')}
          >
            <Feather name="check" size={16} color={COLORS.success} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: COLORS.success, fontSize: scaledSize(14) }]}>
              {t('accept')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${COLORS.error}20`, minHeight: 44 }]}
            onPress={() => handleReject(item)}
            accessibilityRole="button"
            accessibilityLabel={t('reject')}
          >
            <Feather name="x" size={16} color={COLORS.error} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: COLORS.error, fontSize: scaledSize(14) }]}>
              {t('reject')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Student: pending -> Withdraw
    if (userRole === 'student' && item.status === 'pending') {
      return (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${COLORS.error}15`, minHeight: 44 }]}
            onPress={() => handleWithdraw(item)}
            accessibilityRole="button"
            accessibilityLabel={t('withdraw')}
          >
            <Feather name="trash-2" size={16} color={COLORS.error} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: COLORS.error, fontSize: scaledSize(14) }]}>
              {t('withdraw') || 'Retirer'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Accepted -> Open Chat
    if (item.status === 'accepted') {
      return (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.chatBtn, { minHeight: 44 }]}
            onPress={() => {
              navigation.navigate('Conversations');
            }}
            accessibilityRole="button"
            accessibilityLabel={t('openChat') || 'Ouvrir le chat'}
          >
            <Feather name="message-circle" size={16} color={COLORS.accent} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: COLORS.accent, fontSize: scaledSize(14) }]}>
              {t('openChat') || 'Ouvrir le chat'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  /* ── empty state ── */
  const EmptyState = () => (
    <GlassCard style={styles.empty}>
      <Feather name="file-text" size={60} color={COLORS.textTertiary} />
      <Text style={[styles.emptyTitle, { fontSize: scaledSize(18) }]}>{t('noApplications')}</Text>
      <Text style={[styles.emptyDesc, { fontSize: scaledSize(14) }]}>{t('noApplicationsDesc')}</Text>
    </GlassCard>
  );

  /* ── render ── */
  return (
    <GradientBackground variant="subtle">
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={[styles.headerTitle, { fontSize: scaledSize(22), color: isDarkMode ? '#fff' : colors.text }]} accessibilityRole="header">
            {t('applications')}
          </Text>
        </Animated.View>

        {/* filter tabs */}
        <View style={{ marginBottom: 14 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[styles.tab, isActive && styles.tabActive]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={tab.label}
                >
                  <Text style={[
                    styles.tabText,
                    { fontSize: scaledSize(13), color: isActive ? '#fff' : colors.textSecondary },
                    isActive && styles.tabTextActive,
                  ]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* list */}
        <FlatList
          data={filteredApps}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
          ListEmptyComponent={<EmptyState />}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

/* ──────────────────── styles ──────────────────── */

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: { fontWeight: '700', color: '#fff' },

  /* tabs */
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  tabText: { color: COLORS.textSecondary },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },

  /* list */
  list: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 100 },

  /* card */
  card: { marginBottom: 14 },
  cardBody: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, marginLeft: 14 },
  cardTitle: { fontWeight: '600', color: '#fff' },
  cardSecondary: { color: COLORS.textSecondary, marginTop: 3 },
  dateText: { color: COLORS.textTertiary, marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginLeft: 8 },
  statusBadgeText: { fontWeight: '600' },

  /* action bar */
  actionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorder,
    padding: 10,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { fontWeight: '600' },
  chatBtn: {
    backgroundColor: `${COLORS.accent}15`,
  },
  coverLetterBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  viewCvBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.info}20`,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  /* empty */
  empty: { alignItems: 'center', padding: 30, marginTop: 40 },
  emptyTitle: { fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  emptyDesc: { color: COLORS.textSecondary, textAlign: 'center' },
});

export default ApplicationsScreen;
