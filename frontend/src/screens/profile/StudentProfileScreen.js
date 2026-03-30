import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView,
  Platform, StyleSheet, Alert, TouchableOpacity, Modal, ActivityIndicator, FlatList
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { studentsAPI, storageAPI, referencesAPI } from '../../services/api';

const StudentProfileScreen = ({ route, navigation }) => {
  const { t, scaledSize, loadProfile, logout, profile: appProfile, colors, isDarkMode } = useApp();
  
  // Utiliser le profil passé en paramètre ou le profil global de l'app si disponible
  const existingProfile = route?.params?.profile || appProfile || null;
  const isEditing = !!existingProfile;
  
  // Identité
  const [firstName, setFirstName] = useState(existingProfile?.first_name || '');
  const [lastName, setLastName] = useState(existingProfile?.last_name || '');
  const [phone, setPhone] = useState(existingProfile?.phone || '');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [studyField, setStudyField] = useState(existingProfile?.study_field || '');
  const [targetJob, setTargetJob] = useState(existingProfile?.target_job || ''); 
  
  // Tableaux dynamiques au lieu de texte simple
  const [skills, setSkills] = useState(existingProfile?.skills || []);
  const [qualities, setQualities] = useState(existingProfile?.qualities || []);
  const [experiences, setExperiences] = useState(existingProfile?.experiences || []);
  const [education, setEducation] = useState(existingProfile?.education || []);

  // Préférences
  const [searchStatus, setSearchStatus] = useState(existingProfile?.search_status || 'active');
  const [searchType, setSearchType] = useState(existingProfile?.search_type || 'both');
  const [city, setCity] = useState(existingProfile?.city || '');
  const [mobilityRadius, setMobilityRadius] = useState(existingProfile?.mobility_radius ? String(existingProfile.mobility_radius) : '50');
  const [contractStart, setContractStart] = useState(existingProfile?.contract_start_date ? new Date(existingProfile.contract_start_date) : null);
  const [contractEnd, setContractEnd] = useState(existingProfile?.contract_end_date ? new Date(existingProfile.contract_end_date) : null);

  
  // Upload CV
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Nouvelles listes exhaustives chargées depuis le backend
  const [jobsList, setJobsList] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  const [sectorsList, setSectorsList] = useState([]);
  const [topSectors, setTopSectors] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  React.useEffect(() => {
    const fetchRefs = async () => {
      try {
        const data = await referencesAPI.list();
        setJobsList(data.jobs.map(j => j.name));
        setTopJobs(data.jobs.filter(j => j.is_top).map(j => j.name));
        setSectorsList(data.sectors.map(s => s.name));
        setTopSectors(data.sectors.filter(s => s.is_top).map(s => s.name));
        setCitiesList(data.cities.map(c => c.name));
      } catch (err) {
        console.log('Error fetching references:', err);
      }
    };
    fetchRefs();
  }, []);
  const searchStatuses = [
    { key: 'active', label: t('activeSearch') },
    { key: 'open', label: t('openToOffers') },
    { key: 'not_searching', label: t('notSearching') },
  ];

  const searchTypes = [
    { key: 'stage', label: t('stage') },
    { key: 'alternance', label: t('alternance') },
    { key: 'both', label: t('both') },
  ];

  const toISODate = (date) => (date ? new Date(date).toISOString().split('T')[0] : null);

  // Analyse IA
  const analyzeCVFile = async (file) => {
    setAiAnalyzing(true);
    try {
      const data = await storageAPI.analyzeCV(file.uri, file.name, file.mimeType);
      
      if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
      if (data.qualities && Array.isArray(data.qualities)) setQualities(data.qualities);
      if (data.experiences && Array.isArray(data.experiences)) setExperiences(data.experiences);
      if (data.education && Array.isArray(data.education)) setEducation(data.education);

      Alert.alert("Succès ✨", "Votre CV a été analysé. Les champs de votre profil ont été pré-remplis automatiquement !");
    } catch (err) {
      console.log('AI parsing error:', err);
      Alert.alert('Erreur', "Le CV a été joint, mais l'analyse automatique a échouée.");
    }
    setAiAnalyzing(false);
  };

  const handlePickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.size > 5 * 1024 * 1024) return Alert.alert(t('error'), 'Le fichier dépasse 5 Mo');
        setCvFile(file);
        analyzeCVFile(file);
      }
    } catch (err) {
      Alert.alert(t('error'), t('errorGeneric'));
    }
  };

  const uploadCV = async () => {
    if (!cvFile) return null;
    try {
      const result = await storageAPI.uploadCV(cvFile.uri, cvFile.name, cvFile.mimeType);
      return result.cv_url;
    } catch (err) {
      return null;
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) return Alert.alert('', t('required'));
    setLoading(true);

    let cvUrl = null;
    if (cvFile) cvUrl = await uploadCV();

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        study_field: studyField || null,
        target_job: targetJob.trim() || null,
        skills: skills.map(s => s.trim()).filter(Boolean),
        qualities: qualities.map(q => q.trim()).filter(Boolean),
        experiences: experiences,
        education: education,
        search_status: searchStatus,
        search_type: searchType,
        city: city.trim() || null,
        mobility_radius: parseInt(mobilityRadius) || 50,
        contract_start_date: toISODate(contractStart),
        contract_end_date: toISODate(contractEnd),
      };

      if (cvUrl !== null) {
        payload.cv_url = cvUrl;
      } else if (existingProfile?.cv_url && !cvFile) {
        // Garder l'ancien
        payload.cv_url = existingProfile.cv_url;
      }

      if (isEditing) {
        await studentsAPI.update(payload);
        Alert.alert('Succès', 'Profil mis à jour !');
        if (navigation.canGoBack()) navigation.goBack();
      } else {
        await studentsAPI.create(payload);
      }
      
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
    
    // Filtrer la liste globale ou afficher les principaux
    let displayData = [];
    if (search.trim() === '') {
      displayData = topData || data.slice(0, 15);
    } else {
      displayData = data.filter(item => item.toLowerCase().includes(search.toLowerCase()));
      // Ajouter la recherche personnalisée si elle n'existe pas dans la liste
      if (!data.some(d => d.toLowerCase() === search.toLowerCase().trim())) {
        displayData.unshift(search.trim());
      }
    }

    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 0 }]}>{label}</Text>
        <TouchableOpacity 
          style={[styles.input, { justifyContent: 'center' }]} 
          onPress={() => { setModalVisible(true); setSearch(''); }}
        >
          <Text style={{ color: value ? (isDarkMode ? '#fff' : colors.text) : colors.textTertiary, fontSize: scaledSize(16) }}>
            {value || placeholder}
          </Text>
        </TouchableOpacity>
        
        <Modal visible={modalVisible} transparent animationType="slide">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.dateModalOverlay}>
              <View style={[styles.dateModalContent, { backgroundColor: colors.secondary, height: '85%', padding: 20 }]}>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>Saisissez votre choix</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}><Feather name="x" size={24} color={colors.error} /></TouchableOpacity>
                 </View>

                 <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 10 }}>Sélectionnez dans la liste ou tapez pour ajouter  👇</Text>
                 
                 <TextInput 
                   style={[styles.input, { marginBottom: 15, borderColor: colors.accent, borderWidth: 2, color: colors.text }]} 
                   placeholder="Rechercher ou écrire un nouveau métier..." 
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

  // Dynamic Array Handlers
  const upArray = (arr, setter, index, val) => { const n = [...arr]; n[index] = val; setter(n); };
  const rmArray = (arr, setter, index) => setter(arr.filter((_, i) => i !== index));

  return (
    <GradientBackground variant="topRight">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={[styles.title, { fontSize: scaledSize(26) }]}>
                {isEditing ? 'Modifier mon profil' : t('createProfile')}
              </Text>
              <Text style={[styles.subtitle, { fontSize: scaledSize(14) }]}>{t('student')}</Text>
            </View>
            {isEditing && (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                <Feather name="x" size={28} color={isDarkMode ? "#fff" : colors.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* 1. Identité */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="user" size={16} color="#fff" />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16) }]}>Identité</Text>
            </View>
            <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 0 }]}>{t('firstName')} *</Text>
            <TextInput style={[styles.input, { fontSize: scaledSize(16), color: colors.text }]} value={firstName} onChangeText={setFirstName} />
            <Text style={[styles.label, { fontSize: scaledSize(14) }]}>{t('lastName')} *</Text>
            <TextInput style={[styles.input, { fontSize: scaledSize(16), color: colors.text }]} value={lastName} onChangeText={setLastName} />
            <Text style={[styles.label, { fontSize: scaledSize(14) }]}>{t('phone')}</Text>
            <TextInput style={[styles.input, { fontSize: scaledSize(16), color: colors.text }]} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Text style={[styles.label, { fontSize: scaledSize(14) }]}>{t('bio')}</Text>
            <TextInput style={[styles.input, styles.multiline, { fontSize: scaledSize(16), color: colors.text }]} value={bio} onChangeText={setBio} multiline />
          </GlassCard>

          {/* 2. Upload CV Intelligent */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="cpu" size={16} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16), color: colors.accent }]}>Import Intelligent (CV)</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 15, fontSize: scaledSize(13) }}>
              Chargez votre CV : notre algorithme remplira automatiquement toutes vos expériences, formations, compétences et qualités ci-dessous !
            </Text>

            <TouchableOpacity
              style={[styles.uploadButton, (cvFile || existingProfile?.cv_url) && styles.uploadButtonDone]}
              onPress={handlePickCV}
              disabled={aiAnalyzing}
            >
              {aiAnalyzing ? (
                <ActivityIndicator color={colors.success} size="large" />
              ) : (
                <Feather
                  name={(cvFile || existingProfile?.cv_url) ? 'check-circle' : 'upload-cloud'}
                  size={28}
                  color={(cvFile || existingProfile?.cv_url) ? colors.success : (isDarkMode ? '#fff' : colors.text)}
                />
              )}
              <Text style={[styles.uploadText, { fontSize: scaledSize(15) }]}>
                {aiAnalyzing ? "Analyse en cours..." : (cvFile ? cvFile.name : (existingProfile?.cv_url ? "Remplacer mon CV" : "Sélectionner mon CV"))}
              </Text>
            </TouchableOpacity>

            {cvFile && !aiAnalyzing && (
              <TouchableOpacity
                onPress={() => { setCvFile(null); setExperiences([]); setEducation([]); setSkills([]); setQualities([]); }}
                style={styles.removeFile}
              >
                <Feather name="trash" size={16} color={colors.error} />
                <Text style={[styles.removeFileText, { fontSize: scaledSize(13), color: colors.error }]}>Retirer le CV</Text>
              </TouchableOpacity>
            )}
          </GlassCard>



          {/* 4. Compétences & Qualités */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="award" size={16} color="#fff" />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16) }]}>Compétences & Soft Skills</Text>
            </View>
            
            <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 0 }]}>Vos Compétences Techniques</Text>
            {skills.map((s, index) => (
              <View key={`skill-${index}`} style={[styles.dynamicBox, { padding: 4, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }]}>
                <TextInput style={[styles.dynamicInput, { flex: 1, marginBottom: 0, color: colors.text }]} value={s} onChangeText={v => upArray(skills, setSkills, index, v)} placeholder="Ex: React JS, Python..." placeholderTextColor={colors.textTertiary} />
                <TouchableOpacity onPress={() => rmArray(skills, setSkills, index)} style={{ padding: 10 }}><Feather name="x" size={18} color={colors.error} /></TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: `${colors.success}15` }]} onPress={() => setSkills([...skills, ''])}>
              <Feather name="plus" size={16} color={colors.success} />
              <Text style={[styles.addBtnText, { color: colors.success }]}>Ajouter une compétence</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 24 }]}>Vos Qualités</Text>
            {qualities.map((q, index) => (
              <View key={`qual-${index}`} style={[styles.dynamicBox, { padding: 4, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }]}>
                <TextInput style={[styles.dynamicInput, { flex: 1, marginBottom: 0, color: colors.text }]} value={q} onChangeText={v => upArray(qualities, setQualities, index, v)} placeholder="Ex: Travail en équipe, Rigoureux..." placeholderTextColor={colors.textTertiary} />
                <TouchableOpacity onPress={() => rmArray(qualities, setQualities, index)} style={{ padding: 10 }}><Feather name="x" size={18} color={colors.error} /></TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: `${colors.success}15` }]} onPress={() => setQualities([...qualities, ''])}>
              <Feather name="plus" size={16} color={colors.success} />
              <Text style={[styles.addBtnText, { color: colors.success }]}>Ajouter une qualité</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* 5. Expériences */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="briefcase" size={16} color="#fff" />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16) }]}>Expériences pro</Text>
            </View>
            {experiences.map((exp, index) => (
              <View key={`exp-${index}`} style={styles.dynamicBox}>
                <TouchableOpacity onPress={() => { const n = [...experiences]; n.splice(index, 1); setExperiences(n); }} style={styles.removeBtn}>
                   <Feather name="x" size={18} color={colors.error} />
                </TouchableOpacity>
                <TextInput style={[styles.dynamicInput, { color: colors.text }]} placeholder="Poste (ex: Développeur)" placeholderTextColor={colors.textTertiary} value={exp.title} onChangeText={v => { const n = [...experiences]; n[index].title = v; setExperiences(n); }} />
                <TextInput style={[styles.dynamicInput, { color: colors.text }]} placeholder="Entreprise" placeholderTextColor={colors.textTertiary} value={exp.company} onChangeText={v => { const n = [...experiences]; n[index].company = v; setExperiences(n); }} />
                <TextInput style={[styles.dynamicInput, { color: colors.text }]} placeholder="Durée (ex: 6 mois)" placeholderTextColor={colors.textTertiary} value={exp.duration} onChangeText={v => { const n = [...experiences]; n[index].duration = v; setExperiences(n); }} />
              </View>
            ))}
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: `${colors.success}15` }]} onPress={() => setExperiences([...experiences, { title: '', company: '', duration: '' }])}>
              <Feather name="plus" size={16} color={colors.success} />
              <Text style={[styles.addBtnText, { color: colors.success }]}>Ajouter une expérience</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* 6. Formations */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="book-open" size={16} color="#fff" />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16) }]}>Formations</Text>
            </View>
            {education.map((edu, index) => (
              <View key={`edu-${index}`} style={styles.dynamicBox}>
                <TouchableOpacity onPress={() => { const n = [...education]; n.splice(index, 1); setEducation(n); }} style={styles.removeBtn}>
                   <Feather name="x" size={18} color={colors.error} />
                </TouchableOpacity>
                <TextInput style={[styles.dynamicInput, { color: colors.text }]} placeholder="Diplôme (ex: Master IT)" placeholderTextColor={colors.textTertiary} value={edu.degree} onChangeText={v => { const n = [...education]; n[index].degree = v; setEducation(n); }} />
                <TextInput style={[styles.dynamicInput, { color: colors.text }]} placeholder="Établissement" placeholderTextColor={colors.textTertiary} value={edu.institution} onChangeText={v => { const n = [...education]; n[index].institution = v; setEducation(n); }} />
                <TextInput style={[styles.dynamicInput, { color: colors.text }]} placeholder="Année" placeholderTextColor={colors.textTertiary} value={edu.year} onChangeText={v => { const n = [...education]; n[index].year = v; setEducation(n); }} />
              </View>
            ))}
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: `${colors.success}15` }]} onPress={() => setEducation([...education, { degree: '', institution: '', year: '' }])}>
              <Feather name="plus" size={16} color={colors.success} />
              <Text style={[styles.addBtnText, { color: colors.success }]}>Ajouter une formation</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Métier Recherché */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={16} color="#fff" />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16) }]}>Métier Recherché</Text>
            </View>
            
            <SearchableDropdown 
              label="Secteur global (Domaine d'études)"
              placeholder="Sélectionnez un domaine d'études..."
              value={studyField}
              onSelect={setStudyField}
              data={sectorsList}
              topData={topSectors}
            />

            <SearchableDropdown 
              label="Poste exact recherché (Stage ou Alternance)"
              placeholder="Ex: Développeur Full-Stack, Chef de projet..."
              value={targetJob}
              onSelect={setTargetJob}
              data={jobsList}
              topData={topJobs}
            />

          </GlassCard>

          {/* 7. Préférences */}
          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Feather name="search" size={16} color="#fff" />
              <Text style={[styles.sectionTitle, { fontSize: scaledSize(16) }]}>Préférences de recherche</Text>
            </View>
            <Text style={[styles.label, { fontSize: scaledSize(14), marginTop: 0 }]}>{t('searchStatus')}</Text>
            {renderChips(searchStatuses, searchStatus, setSearchStatus)}
            <Text style={[styles.label, { fontSize: scaledSize(14) }]}>{t('searchType')}</Text>
            {renderChips(searchTypes, searchType, setSearchType)}
          </GlassCard>

          {/* 8. Divers */}
          <GlassCard style={styles.card}>
             <View style={styles.sectionHeader}>
               <Feather name="map-pin" size={16} color="#fff" />
               <Text style={[styles.sectionTitle, { fontSize: scaledSize(16) }]}>Localisation</Text>
             </View>
             
             <SearchableDropdown 
               label="Ville"
               placeholder="Ex: Paris, Lyon..."
               value={city}
               onSelect={setCity}
               data={citiesList}
             />

             <Text style={[styles.label, { fontSize: scaledSize(14) }]}>{t('mobilityRadius')} (en km)</Text>
             <TextInput style={[styles.input, { fontSize: scaledSize(16), width: 120, color: colors.text }]} value={mobilityRadius} onChangeText={setMobilityRadius} keyboardType="numeric" />
          </GlassCard>

          <View style={styles.saveContainer}>
            <AnimatedButton text={loading ? t('loading') : (isEditing ? 'Mettre à jour' : t('save'))} onPress={handleSave} disabled={loading} />
          </View>

          {!isEditing && (
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Text style={[styles.logoutText, { color: colors.error }]}>{t('logout')}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontWeight: 'bold', color: '#fff' },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 4, marginBottom: 4 },
  card: { marginTop: 20, padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontWeight: '700', color: '#fff' },
  label: { fontWeight: '600', color: '#fff', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 15,
    color: '#fff', borderWidth: 1, borderColor: COLORS.glassBorder, minHeight: 48,
  },
  multiline: { height: 100, borderRadius: 12, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: COLORS.glassBorder,
    minHeight: 44, justifyContent: 'center',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.accent },
  chipText: { color: 'rgba(255,255,255,0.85)' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  dateModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  dateModalContent: { backgroundColor: COLORS.secondary, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  uploadButton: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 24, borderRadius: 16,
    borderWidth: 2, borderColor: COLORS.accent, borderStyle: 'dashed', backgroundColor: 'rgba(255,255,255,0.05)'
  },
  uploadButtonDone: { borderColor: COLORS.success, borderStyle: 'solid', backgroundColor: 'rgba(0,184,148,0.08)' },
  uploadText: { color: '#fff', fontWeight: '600', marginTop: 10, textAlign: 'center' },
  removeFile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 6 },
  removeFileText: { color: COLORS.error, fontWeight: '600' },
  saveContainer: { marginTop: 24, marginBottom: 20 },
  logoutBtn: { alignItems: 'center', paddingVertical: 14, marginBottom: 40 },
  logoutText: { color: COLORS.error, fontWeight: '600', fontSize: 16 },
  dynamicBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  dynamicInput: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10,
    color: '#fff', marginBottom: 6, fontSize: 14,
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12,
    marginTop: 4, borderRadius: 12, backgroundColor: 'rgba(0, 184, 148, 0.1)',
  },
  addBtnText: { color: COLORS.success, fontWeight: '600', marginLeft: 8 },
  removeBtn: { position: 'absolute', top: 10, right: 10, zIndex: 1, padding: 4 }
});

export default StudentProfileScreen;
