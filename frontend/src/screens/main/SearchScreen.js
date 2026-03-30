import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, ScrollView,
  StyleSheet, Animated, Alert, Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import { COLORS, SIZES } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { offersAPI, studentsAPI, referencesAPI } from '../../services/api';

/* ──────────────────── type chip color ──────────────────── */
const getTypeColor = (type, palette) => {
  if (type === 'stage') return palette.info;
  if (type === 'alternance') return palette.success;
  return palette.accent;
};

/* ──────────────────── component ──────────────────── */

const SearchScreen = () => {
  const navigation = useNavigation();
  const { t, scaledSize, userRole, profile, colors, isDarkMode } = useApp();

  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [dynamicSectors, setDynamicSectors] = useState([]);
  const [isSectorModalVisible, setIsSectorModalVisible] = useState(false);

  const debounceRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    
    // Fetch sectors for filter
    referencesAPI.list().then(data => {
      if (data && data.sectors) setDynamicSectors(data.sectors.map(s => s.name));
    }).catch(() => {});
  }, [fadeAnim]);

  /* ── types ── */
  const types = [
    { key: 'all', label: t('allTypes') },
    { key: 'stage', label: t('stage') },
    { key: 'alternance', label: t('alternance') },
  ];

  /* ── sectors ── */
  const sectorItems = [
    { key: 'all', label: t('allSectors') },
    ...dynamicSectors.map((s) => ({ key: s, label: s })),
  ];

  /* ── execute search ── */
  const executeSearch = useCallback(async (text, type, sector, city) => {
    setHasSearched(true);

    try {
      if (userRole === 'student') {
        const data = await offersAPI.search({ q: text, type: type, sector: sector, city: city });
        if (data) setResults(data);
      } else {
        const data = await studentsAPI.search({ q: text });
        if (data) setResults(data);
      }
    } catch (err) {
      Alert.alert(t('error'), err.message);
    }
  }, [userRole]);

  /* ── debounced search trigger ── */
  const triggerSearch = useCallback((text, type, sector, city) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      executeSearch(text, type, sector, city);
    }, 500);
  }, [executeSearch]);

  /* re-search when filters change or component mounts */
  useEffect(() => {
    triggerSearch(searchText, typeFilter, sectorFilter, cityFilter);
  }, [typeFilter, sectorFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeSearch = (text) => {
    setSearchText(text);
    triggerSearch(text, typeFilter, sectorFilter, cityFilter);
  };

  const onChangeCityFilter = (text) => {
    setCityFilter(text);
    triggerSearch(searchText, typeFilter, sectorFilter, text);
  };

  const clearSearch = () => {
    setSearchText('');
    setResults([]);
    setHasSearched(false);
  };

  /* ── offer result card (for students) ── */
  const renderOfferResult = ({ item }) => (
    <GlassCard style={styles.card} noPadding>
      <TouchableOpacity
        style={styles.cardBody}
        onPress={() => navigation.navigate('OfferDetail', { offer: item })}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.companies?.company_name || ''}, ${item.location || ''}`}
      >
        <View style={styles.iconBox}>
          <Feather name="briefcase" size={22} color={colors.text} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { fontSize: scaledSize(16) }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.cardSecondary, { fontSize: scaledSize(13) }]} numberOfLines={1}>
            {item.companies?.company_name}{item.location ? ` \u2022 ${item.location}` : ''}
          </Text>

          {/* type chip */}
          <View style={styles.chipRow}>
            <View style={[styles.typeChip, { backgroundColor: `${getTypeColor(item.type, colors)}20` }]}>
              <Text style={[styles.typeChipText, { color: getTypeColor(item.type, colors), fontSize: scaledSize(13) }]}>
                {item.type === 'stage' ? t('stage') : item.type === 'alternance' ? t('alternance') : item.type}
              </Text>
            </View>
          </View>

          {/* skills */}
          {item.skills_required && item.skills_required.length > 0 && (
            <View style={styles.skillsRow}>
              {item.skills_required.slice(0, 3).map((skill, i) => (
                <View key={i} style={styles.skillChip}>
                  <Text style={[styles.skillChipText, { fontSize: scaledSize(13) }]}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {/* duration + salary */}
          {(item.duration || item.salary) && (
            <Text style={[styles.infoLine, { fontSize: scaledSize(13) }]}>
              {item.duration || ''}{item.duration && item.salary ? ' \u2022 ' : ''}{item.salary || ''}
            </Text>
          )}
        </View>
        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    </GlassCard>
  );

  /* ── student result card (for companies) ── */
  const renderStudentResult = ({ item }) => {
    const initials = `${(item.first_name || '')[0] || ''}${(item.last_name || '')[0] || ''}`.toUpperCase();
    const statusColors = { active: colors.success, open: colors.info };
    const dotColor = statusColors[item.search_status] || colors.textTertiary;

    return (
      <GlassCard style={styles.card} noPadding>
        <TouchableOpacity
          style={styles.cardBody}
          onPress={() => navigation.navigate('StudentDetail', { student: item })}
          accessibilityRole="button"
          accessibilityLabel={`${item.first_name} ${item.last_name}, ${item.study_field || ''}, ${item.city || ''}`}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient colors={[colors.accent, colors.primary]} style={styles.avatarGradient}>
              <Text style={[styles.avatarText, { fontSize: scaledSize(16), color: '#fff' }]}>{initials}</Text>
            </LinearGradient>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { fontSize: scaledSize(16), color: colors.text }]} numberOfLines={1}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={[styles.cardSecondary, { fontSize: scaledSize(13), color: colors.textSecondary }]} numberOfLines={1}>
              {item.study_field}{item.city ? ` \u2022 ${item.city}` : ''}
            </Text>

            {/* status */}
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
              <Text style={[styles.statusLabel, { color: dotColor, fontSize: scaledSize(13) }]}>
                {item.search_status}
              </Text>
            </View>

            {/* skills */}
            {item.skills && item.skills.length > 0 && (
              <View style={styles.skillsRow}>
                {item.skills.slice(0, 4).map((skill, i) => (
                  <View key={i} style={styles.skillChip}>
                    <Text style={[styles.skillChipText, { fontSize: scaledSize(13), color: colors.text }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* search type + dates */}
            {(item.search_type || item.contract_start) && (
              <Text style={[styles.infoLine, { fontSize: scaledSize(13), color: colors.textTertiary }]}>
                {item.search_type || ''}
                {item.contract_start ? ` \u2022 ${item.contract_start}` : ''}
                {item.contract_end ? ` - ${item.contract_end}` : ''}
              </Text>
            )}
          </View>
          <Feather name="chevron-right" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </GlassCard>
    );
  };

  /* ── render ── */
  return (
    <GradientBackground variant="subtle">
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* header */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: scaledSize(22), color: colors.text }]} accessibilityRole="header">
            {t('search')}
          </Text>
        </View>

        {/* search bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)', borderColor: colors.glassBorder }]}>
            <Feather name="search" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { fontSize: scaledSize(16), color: colors.text }]}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={searchText}
              onChangeText={onChangeSearch}
              accessible
              accessibilityLabel={t('search')}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                accessibilityRole="button"
                accessibilityLabel={t('clear')}
                style={styles.clearBtn}
              >
                <Feather name="x" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* filters for students */}
        {userRole === 'student' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* type chips */}
            <View style={styles.filterRow}>
              {types.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  onPress={() => setTypeFilter(type.key)}
                  style={[styles.filterChip, typeFilter === type.key && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: typeFilter === type.key }}
                  accessibilityLabel={type.label}
                >
                  <Text style={[
                    styles.filterChipText,
                    { fontSize: scaledSize(13), color: typeFilter === type.key ? '#fff' : colors.textSecondary },
                  ]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* sector button opening modal */}
            <TouchableOpacity
              onPress={() => setIsSectorModalVisible(true)}
              style={[styles.filterChip, sectorFilter !== 'all' && { backgroundColor: colors.accent, borderColor: colors.accent }, { marginLeft: 20, marginBottom: 12, alignSelf: 'flex-start' }]}
            >
              <Text style={[styles.filterChipText, { color: sectorFilter !== 'all' ? '#fff' : colors.textSecondary }]}>
                {sectorFilter === 'all' ? t('allSectors') + ' ▾' : sectorFilter + ' ▾'}
              </Text>
            </TouchableOpacity>

            {/* city filter */}
            <View style={styles.cityFilterContainer}>
              <View style={[styles.cityFilterBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)', borderColor: colors.glassBorder }]}>
                <Feather name="map-pin" size={16} color={colors.textTertiary} />
                <TextInput
                  style={[styles.cityInput, { fontSize: scaledSize(14), color: colors.text }]}
                  placeholder={t('cityFilter') || 'Ville...'}
                  placeholderTextColor={colors.textTertiary}
                  value={cityFilter}
                  onChangeText={onChangeCityFilter}
                  accessible
                  accessibilityLabel={t('cityFilter') || 'City filter'}
                />
                {cityFilter.length > 0 && (
                  <TouchableOpacity
                    onPress={() => { setCityFilter(''); triggerSearch(searchText, typeFilter, sectorFilter, ''); }}
                    accessibilityRole="button"
                    accessibilityLabel={t('clear')}
                  >
                    <Feather name="x" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>
        )}

        {/* results list */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={userRole === 'student' ? renderOfferResult : renderStudentResult}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            hasSearched ? (
              <GlassCard style={styles.empty}>
                <Feather name="search" size={60} color={colors.textTertiary} />
                <Text style={[styles.emptyTitle, { fontSize: scaledSize(18), color: colors.text }]}>{t('noResults')}</Text>
                <Text style={[styles.emptyDesc, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{t('noResultsDesc')}</Text>
              </GlassCard>
            ) : null
          }
        />

        {/* Modal Secteur */}
        <Modal visible={isSectorModalVisible} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalContainer}>
              <Text style={[styles.modalTitle, { fontSize: scaledSize(18) }]}>Sélectionner un secteur</Text>
              <ScrollView style={{ maxHeight: '80%' }}>
                {sectorItems.map(sector => (
                  <TouchableOpacity
                    key={sector.key}
                    style={[styles.modalItem, sectorFilter === sector.key && styles.modalItemActive]}
                    onPress={() => {
                      setSectorFilter(sector.key);
                      setIsSectorModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, sectorFilter === sector.key && styles.modalItemTextActive]}>
                      {sector.label}
                    </Text>
                    {sectorFilter === sector.key && <Feather name="check" size={20} color={colors.accent} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsSectorModalVisible(false)}>
                <Text style={styles.modalCloseText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </GradientBackground>
  );
};

/* ──────────────────── styles ──────────────────── */

const styles = StyleSheet.create({
  header: { paddingBottom: 8, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontWeight: '700' },

  /* search bar */
  searchContainer: { paddingHorizontal: 20, marginBottom: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    gap: 10,
  },
  searchInput: { flex: 1 },
  clearBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },

  /* filters */
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 10 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterChipText: { color: COLORS.textSecondary },
  filterChipTextActive: { color: '#fff', fontWeight: 'bold' },

  sectorScroll: { marginBottom: 10 },
  sectorScrollContent: { paddingHorizontal: 20, gap: 8 },

  cityFilterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  cityFilterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    gap: 8,
  },
  cityInput: { flex: 1 },

  /* results list */
  list: { paddingHorizontal: 20, paddingBottom: 100 },

  /* card */
  card: { marginBottom: 12 },
  cardBody: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(120,120,120,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, marginLeft: 14 },
  cardTitle: { fontWeight: '600' },
  cardSecondary: { color: COLORS.textSecondary, marginTop: 3 },

  /* type chip */
  chipRow: { flexDirection: 'row', marginTop: 8 },
  typeChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeChipText: { fontWeight: '600' },

  /* skills */
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
  skillChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  skillChipText: { fontWeight: '500' },

  /* info line */
  infoLine: { color: COLORS.textTertiary, marginTop: 6 },

  /* avatar */
  avatarContainer: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden' },
  avatarGradient: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', color: '#fff' },

  /* status */
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontWeight: '500' },

  /* empty */
  empty: { alignItems: 'center', padding: 30, marginTop: 40 },
  emptyTitle: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptyDesc: { textAlign: 'center' },

  /* modal */
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: COLORS.glassBackground, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.glassBorder },
  modalTitle: { fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1 },
  modalItemActive: { backgroundColor: 'rgba(120,120,120,0.05)' },
  modalItemText: { fontSize: 16 },
  modalItemTextActive: { fontWeight: 'bold' },
  modalCloseBtn: { marginTop: 20, padding: 14, alignItems: 'center', backgroundColor: 'rgba(120,120,120,0.1)', borderRadius: 12 },
  modalCloseText: { fontWeight: 'bold' }
});

export default SearchScreen;
