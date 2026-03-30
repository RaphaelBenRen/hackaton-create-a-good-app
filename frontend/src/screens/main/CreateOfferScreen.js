import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView,
  Platform, StyleSheet, Alert, TouchableOpacity, Modal, ActivityIndicator, FlatList,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { offersAPI, storageAPI, referencesAPI } from '../../services/api';

const CreateOfferScreen = () => {
  const { t, scaledSize, profile, colors, isDarkMode } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offerType, setOfferType] = useState('stage');
  const [sector, setSector] = useState('');
  const [location, setLocation] = useState('');
  const [durationAmount, setDurationAmount] = useState('');
  const [durationPeriod, setDurationPeriod] = useState('mois');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('€');
  const [salaryPeriod, setSalaryPeriod] = useState('/ mois');
  const [skills, setSkills] = useState([]);
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const [sectorsList, setSectorsList] = useState([]);
  const [topSectors, setTopSectors] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [topSkills, setTopSkills] = useState([]);

  React.useEffect(() => {
    const fetchRefs = async () => {
      try {
        const data = await referencesAPI.list();
        setSectorsList(data.sectors.map(s => s.name));
        setTopSectors(data.sectors.filter(s => s.is_top).map(s => s.name));
        setCitiesList(data.cities.map(c => c.name));
        setTopCities(data.cities.filter(c => c.is_top).map(c => c.name));
        if (data.skills) {
          setSkillsList(data.skills.map(s => s.name));
          setTopSkills(data.skills.filter(s => s.is_top).map(s => s.name));
        }
      } catch (err) {
        console.log('Error fetching references:', err);
      }
    };
    fetchRefs();
  }, []);

  const analyzeOfferPDF = async (file) => {
    setAiAnalyzing(true);
    try {
      const data = await storageAPI.analyzeOffer(file.uri, file.name, file.mimeType || 'application/pdf');
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.type) setOfferType(data.type);
      if (data.location) setLocation(data.location);
      if (data.duration) setDurationAmount(data.duration.replace(/[^0-9]/g, ''));
      if (data.salary) setSalaryAmount(data.salary.replace(/[^0-9]/g, ''));
      if (data.skills_required && Array.isArray(data.skills_required)) setSkills(data.skills_required);
      if (data.startDate) setStartDateStr(data.startDate);
      if (data.endDate) setEndDateStr(data.endDate);
      Alert.alert("Succès ✨", "Votre offre a été analysée. Les champs ont été pré-remplis automatiquement !");
    } catch (err) {
      console.log('AI parsing error:', err);
      Alert.alert('Erreur', "L'analyse automatique a échoué.");
    }
    setAiAnalyzing(false);
  };

  const handlePickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.size > 5 * 1024 * 1024) return Alert.alert(t('error'), "Le fichier dépasse 5 Mo");
        setPdfFile(file);
        analyzeOfferPDF(file);
      }
    } catch (err) {
      Alert.alert(t('error'), t('errorGeneric'));
    }
  };

  const offerTypes = [
    { key: 'stage', label: t('stage') },
    { key: 'alternance', label: t('alternance') },
  ];

  const currencies = [
    { key: '€', label: '€' },
    { key: '$', label: '$' }
  ];

  const periods = [
    { key: '/ mois', label: '/ mois' },
    { key: '/ an', label: '/ an' },
    { key: '/ heure', label: '/ heure' }
  ];

  const handleDateChange = (text, setter) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 4) {
      formatted = formatted.slice(0, 5) + '/' + cleaned.slice(4, 8);
    }
    setter(formatted);
  };

  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      return Alert.alert('', t('required'));
    }

    setLoading(true);
    try {
      let documentUrl = null;
      if (pdfFile) {
        const docRes = await storageAPI.uploadDocument(pdfFile.uri, pdfFile.name, pdfFile.mimeType || 'application/pdf');
        documentUrl = docRes.url;
      }

      await offersAPI.create({
        company_id: profile.id,
        title: title.trim(),
        description: description.trim() || null,
        type: offerType,
        sector: sector || null,
        location: location.trim() || null,
        duration: durationAmount ? `${durationAmount} ${durationPeriod}` : null,
        salary: salaryAmount ? `${salaryAmount}${salaryCurrency} ${salaryPeriod}` : null,
        skills_required: skills.map(s => s.trim()).filter(Boolean),
        start_date: parseDateString(startDateStr),
        end_date: parseDateString(endDateStr),
        pdf_url: documentUrl,
        is_active: true,
      });
      Alert.alert(t('success'), t('offerPublished'));
      navigation.goBack();
    } catch (err) {
      Alert.alert(t('error'), err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderChips = (items, selected, onSelect) => (
    <View style={styles.chips}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => onSelect(item.key)}
          style={[styles.chip, { borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }, selected === item.key && { backgroundColor: colors.primary, borderColor: colors.accent }]}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === item.key }}
          accessibilityLabel={item.label}
        >
          <Text style={[
            styles.chipText,
            { fontSize: scaledSize(13), color: selected === item.key ? (isDarkMode ? '#fff' : colors.text) : colors.textSecondary },
            selected === item.key && { fontWeight: 'bold' },
          ]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const upArray = (arr, setter, index, val) => { const n = [...arr]; n[index] = val; setter(n); };
  const rmArray = (arr, setter, index) => setter(arr.filter((_, i) => i !== index));

  const SearchableDropdown = ({ label, placeholder, value, onSelect, data, topData, variant }) => {
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

    const modalContent = (
        <Modal visible={modalVisible} transparent animationType="slide">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
             <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' }}>
               <View style={{ backgroundColor: colors.secondary, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30, height: '85%', padding: 20 }}>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>Saisissez votre choix</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}><Feather name="x" size={24} color={colors.error} /></TouchableOpacity>
                 </View>

                 <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 10 }}>Sélectionnez dans la liste ou tapez pour ajouter 👇</Text>
                 
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
    );

    if (variant === 'dynamicBox') {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity 
            style={[styles.dynamicInput, { flex: 1, marginBottom: 0, justifyContent: 'center', backgroundColor: 'transparent', minHeight: 40, padding: 0 }]} 
            onPress={() => { setModalVisible(true); setSearch(''); }}
          >
            <Text style={{ color: value ? colors.text : colors.textTertiary, fontSize: scaledSize(14) }}>
              {value || placeholder}
            </Text>
          </TouchableOpacity>
          {modalContent}
        </View>
      );
    }

    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 0 }]}>{label}</Text>
        <TouchableOpacity 
          style={[styles.input, { justifyContent: 'center' }]} 
          onPress={() => { setModalVisible(true); setSearch(''); }}
        >
          <Text style={{ color: value ? colors.text : colors.textTertiary, fontSize: scaledSize(16) }}>
            {value || placeholder}
          </Text>
        </TouchableOpacity>
        {modalContent}
      </View>
    );
  };

  return (
    <GradientBackground variant="subtle">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(120,120,120,0.1)', borderColor: colors.glassBorder }]}
            accessibilityRole="button"
            accessibilityLabel={t('back')}
          >
            <Feather name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: scaledSize(17), color: colors.text }]}>
            {t('createOffer')}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <GlassCard style={{ marginTop: 8, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Feather name="cpu" size={16} color={colors.accent} />
              <Text style={{ fontSize: scaledSize(16), color: colors.accent, fontWeight: '700', marginLeft: 8 }}>Import Intelligent (PDF)</Text>
            </View>
            <TouchableOpacity
              style={[styles.uploadButton, pdfFile && styles.uploadButtonDone, { borderColor: pdfFile ? colors.success : colors.accent, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}
              onPress={handlePickPDF}
              disabled={aiAnalyzing}
            >
              {aiAnalyzing ? (
                <ActivityIndicator color={colors.success} size="large" />
              ) : (
                <Feather
                  name={pdfFile ? 'check-circle' : 'upload-cloud'}
                  size={28}
                  color={pdfFile ? colors.success : colors.text}
                />
              )}
              <Text style={[styles.uploadText, { fontSize: scaledSize(15), color: colors.text }]}>
                {aiAnalyzing ? "Analyse en cours..." : (pdfFile ? pdfFile.name : "Importer ma fiche de poste en PDF")}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 20, color: colors.text }]}>{t('offerTitle')} *</Text>
            <TextInput
              style={[styles.input, { fontSize: scaledSize(16), color: colors.text, borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}
              placeholder={t('offerTitlePlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              autoCorrect={false}
              accessibilityLabel={t('offerTitle')}
            />

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('offerDescription')}</Text>
            <TextInput
              style={[styles.input, styles.multiline, { fontSize: scaledSize(16), color: colors.text, borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}
              placeholder={t('offerDescriptionPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              accessibilityLabel={t('offerDescription')}
            />

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('offerType')}</Text>
            {renderChips(offerTypes, offerType, setOfferType)}

            <SearchableDropdown 
              label={t('sector') || "Secteur d'activité"}
              placeholder="Sélectionnez un secteur d'activité..."
              value={sector}
              onSelect={setSector}
              data={sectorsList}
              topData={topSectors}
            />

            <SearchableDropdown 
              label={t('location') || "Ville / Emplacement"}
              placeholder="Sélectionnez une ville..."
              value={location}
              onSelect={setLocation}
              data={citiesList}
              topData={topCities}
            />

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('offerDuration')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 }}>
              <TextInput
                style={[styles.input, { flex: 1, fontSize: scaledSize(16), minHeight: 44, marginBottom: 0, color: colors.text, borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}
                placeholder="Ex: 6"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                value={durationAmount}
                onChangeText={setDurationAmount}
              />
              <View style={{ flex: 1.5, flexDirection: 'row', gap: 5 }}>
                {[{key:'mois', label:'mois'}, {key:'an(s)', label:'an(s)'}].map(p => (
                  <TouchableOpacity
                    key={p.key}
                    onPress={() => setDurationPeriod(p.key)}
                    style={[styles.chip, { flex: 1, paddingHorizontal: 5, minHeight: 44, marginBottom: 0, paddingVertical: 5, backgroundColor: durationPeriod === p.key ? colors.primary : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)'), borderColor: durationPeriod === p.key ? colors.accent : colors.glassBorder }]}
                  >
                    <Text style={[styles.chipText, { textAlign: 'center', color: durationPeriod === p.key ? (isDarkMode ? '#fff' : colors.text) : colors.textSecondary }]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>Rémunération / Salaire</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 }}>
              <TextInput
                style={[styles.input, { flex: 1, fontSize: scaledSize(16), minHeight: 44, marginBottom: 0, color: colors.text, borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}
                placeholder="Ex: 1500"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                value={salaryAmount}
                onChangeText={setSalaryAmount}
              />
              <View style={{ flex: 1, flexDirection: 'row', gap: 5 }}>
                {currencies.map(c => (
                  <TouchableOpacity
                    key={c.key}
                    onPress={() => setSalaryCurrency(c.key)}
                    style={[styles.chip, { paddingHorizontal: 10, minHeight: 44, marginBottom: 0, paddingVertical: 5, backgroundColor: salaryCurrency === c.key ? colors.primary : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)'), borderColor: salaryCurrency === c.key ? colors.accent : colors.glassBorder }]}
                  >
                    <Text style={[styles.chipText, { color: salaryCurrency === c.key ? (isDarkMode ? '#fff' : colors.text) : colors.textSecondary }]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ marginBottom: 15 }}>
              {renderChips(periods, salaryPeriod, setSalaryPeriod)}
            </View>

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('offerSkills')}</Text>
            {skills.map((s, index) => (
              <View key={`skill-${index}`} style={[styles.dynamicBox, { padding: 4, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }]}>
                <SearchableDropdown 
                  variant="dynamicBox"
                  placeholder="Ex: React JS, Management..."
                  value={s}
                  onSelect={(val) => upArray(skills, setSkills, index, val)}
                  data={skillsList}
                  topData={topSkills}
                />
                <TouchableOpacity onPress={() => rmArray(skills, setSkills, index)} style={{ padding: 10 }}>
                  <Feather name="x" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: `${colors.success}15` }]} onPress={() => setSkills([...skills, ''])}>
              <Feather name="plus" size={16} color={colors.success} />
              <Text style={[styles.addBtnText, { color: colors.success }]}>Ajouter une compétence</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 20, color: colors.text }]}>{t('startDate')}</Text>
            <TextInput
              style={[styles.input, { fontSize: scaledSize(16), marginBottom: 15, color: colors.text, borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={colors.textTertiary}
              value={startDateStr}
              onChangeText={(t) => handleDateChange(t, setStartDateStr)}
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={[styles.label, { fontSize: scaledSize(14), color: colors.text }]}>{t('endDate')}</Text>
            <TextInput
              style={[styles.input, { fontSize: scaledSize(16), marginBottom: 15, color: colors.text, borderColor: colors.glassBorder, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,120,0.05)' }]}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={colors.textTertiary}
              value={endDateStr}
              onChangeText={(t) => handleDateChange(t, setEndDateStr)}
              keyboardType="numeric"
              maxLength={10}
            />

            <AnimatedButton
              text={loading ? t('loading') : t('publishOffer')}
              onPress={handlePublish}
              disabled={loading}
              style={{ marginTop: 24 }}
            />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: { fontWeight: '600', flex: 1, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  label: { fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderRadius: 16, padding: 15,
    borderWidth: 1, minHeight: 48,
  },
  multiline: { minHeight: 120, textAlignVertical: 'top', borderRadius: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, minHeight: 44, justifyContent: 'center',
  },
  chipText: { },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  uploadButton: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 24, borderRadius: 16,
    borderWidth: 2, borderStyle: 'dashed',
  },
  uploadButtonDone: { borderStyle: 'solid' },
  uploadText: { fontWeight: '600', marginTop: 10, textAlign: 'center' },
  dynamicBox: {
    padding: 12, borderRadius: 12, marginBottom: 12,
    borderWidth: 1,
  },
  dynamicInput: {
    borderRadius: 10, padding: 10,
    marginBottom: 6, fontSize: 14,
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12,
    marginTop: 4, borderRadius: 12, marginBottom: 15
  },
  addBtnText: { fontWeight: '600', marginLeft: 8 },
});

export default CreateOfferScreen;
