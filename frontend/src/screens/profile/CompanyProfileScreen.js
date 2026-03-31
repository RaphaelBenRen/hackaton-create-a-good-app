import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView,
  Platform, StyleSheet, Alert, TouchableOpacity, Modal, FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { companiesAPI, referencesAPI } from '../../services/api';

const CompanyProfileScreen = () => {
  const { t, scaledSize, loadProfile, logout, colors, isDarkMode } = useApp();
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [sectorsList, setSectorsList] = useState([]);
  const [topSectors, setTopSectors] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  React.useEffect(() => {
    const fetchRefs = async () => {
      try {
        const data = await referencesAPI.list();
        setSectorsList(data.sectors.map(s => s.name));
        setTopSectors(data.sectors.filter(s => s.is_top).map(s => s.name));
        setCitiesList(data.cities.map(c => c.name));
      } catch (err) {
        console.log('Error fetching references:', err);
      }
    };
    fetchRefs();
  }, []);

  const sizes = [
    { key: '1-10', label: t('size_1_10') },
    { key: '11-50', label: t('size_11_50') },
    { key: '51-200', label: t('size_51_200') },
    { key: '200+', label: t('size_200plus') },
  ];

  const handleSave = async () => {
    if (!companyName.trim()) {
      return Alert.alert('', t('required'));
    }

    setLoading(true);
    try {
      const data = await companiesAPI.create({
        company_name: companyName.trim(),
        sector: sector || null,
        company_size: companySize || null,
        description: description.trim() || null,
        location: location.trim() || null,
        website: website.trim() || null,
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
      });
      await loadProfile();
    } catch (error) {
      Alert.alert(t('error'), error.message);
    }
    setLoading(false);
  };

  const renderChips = (items, selected, onSelect) => (
    <View style={styles.chips}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => onSelect(item.key)}
          style={[styles.chip, selected === item.key && styles.chipActive]}
          accessible={true}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === item.key }}
          accessibilityLabel={item.label}
        >
          <Text style={[
            styles.chipText,
            { fontSize: scaledSize(13) },
            selected === item.key && styles.chipTextActive,
          ]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const SearchableDropdown = ({ label, placeholder, value, onSelect, data, topData }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');
    
    let displayData = [];
    if (search.trim() === '') {
      displayData = topData || data.slice(0, 15);
    } else {
      displayData = data.filter(item => item.toLowerCase().includes(search.toLowerCase()));
      if (!data.some(d => d.toLowerCase() === search.toLowerCase().trim())) {
        displayData.unshift(search.trim());
      }
    }

    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 0, color: colors.text }]}>{label}</Text>
        <TouchableOpacity 
          style={[styles.input, { justifyContent: 'center' }]} 
          onPress={() => { setModalVisible(true); setSearch(''); }}
        >
          <Text style={{ color: value ? colors.text : colors.textTertiary, fontSize: scaledSize(16) }}>
            {value || placeholder}
          </Text>
        </TouchableOpacity>
        
        <Modal visible={modalVisible} transparent animationType="slide">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
             <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' }}>
               <View style={{ backgroundColor: colors.secondary, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30, height: '85%', padding: 20 }}>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>Saisissez votre choix</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}><Feather name="x" size={24} color={colors.error} /></TouchableOpacity>
                 </View>

                 <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 10 }}>Sélectionnez dans la liste ou tapez pour ajouter  👇</Text>
                 
                 <TextInput 
                   style={[styles.input, { marginBottom: 15, borderColor: colors.accent, borderWidth: 2, color: colors.text }]} 
                   placeholder="Rechercher..." 
                   placeholderTextColor={colors.textTertiary}
                   value={search}
                   onChangeText={setSearch}
                   autoFocus
                 />
                 
                 <FlatList
                   data={displayData}
                   keyExtractor={(item, index) => `${item}-${index}`}
                   keyboardShouldPersistTaps="handled"
                   renderItem={({ item, index }) => {
                     const isCustom = index === 0 && search.trim() !== '' && !data.some(d => d.toLowerCase() === search.toLowerCase().trim());
                     return (
                       <TouchableOpacity 
                         style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.glassBorder, flexDirection: 'row', alignItems: 'center' }}
                         onPress={() => { onSelect(item); setModalVisible(false); }}
                       >
                         {isCustom && <Feather name="plus-circle" size={16} color={colors.success} style={{ marginRight: 10 }} />}
                         <Text style={{ color: isCustom ? colors.success : colors.text, fontSize: 16, fontWeight: isCustom ? 'bold' : 'normal' }}>
                           {isCustom ? `Ajouter "${item}"` : item}
                         </Text>
                       </TouchableOpacity>
                     );
                   }}
                 />
               </View>
             </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  };

  return (
    <GradientBackground variant="topRight">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <Text style={[styles.title, { fontSize: scaledSize(26), color: colors.text }]} accessibilityRole="header">
            {t('createProfile')}
          </Text>
          <Text style={[styles.subtitle, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{t('company')}</Text>

          {/* Identité */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="briefcase" size={16} color={colors.text} />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>
                Identité de l'entreprise
              </Text>
            </View>

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('companyName')} *</Text>
            <TextInput
              style={[styles.input, { fontSize: scaledSize(16), color: colors.text }]}
              placeholder={t('companyName')}
              placeholderTextColor={colors.textTertiary}
              value={companyName}
              onChangeText={setCompanyName}
              autoCorrect={false}
              accessibilityLabel={t('companyName')}
            />

            <SearchableDropdown 
              label="Secteur d'activité"
              placeholder="Sélectionnez un secteur d'activité..."
              value={sector}
              onSelect={setSector}
              data={sectorsList}
              topData={topSectors}
            />

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('companySize')}</Text>
            {renderChips(sizes, companySize, setCompanySize)}
          </GlassCard>

          {/* À propos */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={16} color={colors.text} />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>
                À propos
              </Text>
            </View>

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('description')}</Text>
            <TextInput
              style={[styles.input, styles.multiline, { fontSize: scaledSize(16), color: colors.text }]}
              placeholder={t('descriptionPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              accessibilityLabel={t('description')}
            />

            <SearchableDropdown 
              label="Localisation (Ville)"
              placeholder="Ex: Paris, Lyon..."
              value={location}
              onSelect={setLocation}
              data={citiesList}
            />

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('website')}</Text>
            <TextInput
              style={[styles.input, { fontSize: scaledSize(16), color: colors.text }]}
              placeholder="https://www.exemple.com"
              placeholderTextColor={colors.textTertiary}
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={t('website')}
            />
          </GlassCard>

          {/* Contact */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="mail" size={16} color={colors.text} />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.text }]}>
                Contact
              </Text>
            </View>

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('contactEmail')}</Text>
            <TextInput
              style={[styles.input, { fontSize: scaledSize(16), color: colors.text }]}
              placeholder="contact@entreprise.com"
              placeholderTextColor={colors.textTertiary}
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={t('contactEmail')}
            />

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('contactPhone')}</Text>
            <TextInput
              style={[styles.input, { fontSize: scaledSize(16), color: colors.text }]}
              placeholder="01 23 45 67 89"
              placeholderTextColor={colors.textTertiary}
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
              accessibilityLabel={t('contactPhone')}
            />
          </GlassCard>

          {/* Save */}
          <View style={styles.saveContainer}>
            <AnimatedButton
              text={loading ? t('loading') : t('save')}
              onPress={handleSave}
              disabled={loading}
            />
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={[styles.logoutText, { color: colors.error }]}>{t('logout')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontWeight: 'bold' },
  subtitle: { marginTop: 4, marginBottom: 4 },
  card: { marginTop: 20, padding: 26 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 10 },
  sectionTitle: { fontWeight: '700' },
  label: { fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: 'rgba(120,120,120,0.05)',
    borderRadius: 16, padding: 15,
    borderWidth: 1, borderColor: COLORS.glassBorder, minHeight: 48,
  },
  multiline: {
    height: 120,
    borderRadius: 12,
    textAlignVertical: 'top',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: 'rgba(120,120,120,0.05)', borderWidth: 1, borderColor: COLORS.glassBorder,
    minHeight: 44, justifyContent: 'center',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.accent },
  chipText: { fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  saveContainer: { marginTop: 24, marginBottom: 20 },
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 40,
  },
  logoutText: { color: COLORS.error, fontWeight: '600', fontSize: 16 },
});

export default CompanyProfileScreen;
