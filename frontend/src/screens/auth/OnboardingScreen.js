import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated, StatusBar, AccessibilityInfo,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../services/AppContext';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'globe',
    color: '#6c63ff',
    gradient: ['#1a1040', '#0d0826'],
    titleFr: 'Bienvenue sur Albatros ♿',
    titleEn: 'Welcome to Albatros ♿',
    textFr: "Une application pensée pour toutes et tous. Nous croyons que l'accès à l'emploi doit être universel, sans barrières ni discriminations.",
    textEn: 'An app designed for everyone. We believe access to employment should be universal — without barriers or discrimination.',
    badge: 'Application Inclusive',
  },
  {
    id: '2',
    icon: 'eye',
    color: '#3b82f6',
    gradient: ['#0a1628', '#162d50'],
    titleFr: 'Accessibilité Visuelle',
    titleEn: 'Visual Accessibility',
    textFr: "Contraste élevé (≥ 4.5:1), mode sombre, taille de texte ajustable dans les réglages, et compatibilité totale avec VoiceOver & TalkBack.",
    textEn: 'High contrast (≥ 4.5:1), dark mode, adjustable text size in settings, and full VoiceOver & TalkBack compatibility.',
    badge: 'Lecteur d\'écran',
  },
  {
    id: '3',
    icon: 'cpu',
    color: '#00b894',
    gradient: ['#00251e', '#0a3329'],
    titleFr: 'Accessibilité Cognitive',
    titleEn: 'Cognitive Accessibility',
    textFr: "Interface simple et prévisible, icônes claires avec étiquettes, instructions détaillées, et feedback immédiat à chaque action.",
    textEn: 'Simple and predictable interface, clear icons with labels, detailed instructions, and immediate feedback on every action.',
    badge: 'UX Inclusive',
  },
  {
    id: '4',
    icon: 'users',
    color: '#fdcb6e',
    gradient: ['#1f1800', '#2d2200'],
    titleFr: 'Inclusion Sociale & Culturelle',
    titleEn: 'Social & Cultural Inclusion',
    textFr: "Application disponible en Français et en Anglais. Écriture inclusive (é·e), respect des différences culturelles, zéro biais discriminant.",
    textEn: 'Available in French and English. Inclusive writing, respect for cultural differences, zero discriminatory bias.',
    badge: 'Multilingue',
  },
  {
    id: '5',
    icon: 'zap',
    color: '#e17055',
    gradient: ['#1f0a00', '#2d1200'],
    titleFr: 'Performance & Accessibilité',
    titleEn: 'Performance & Accessibility',
    textFr: "Albatros est et restera 100% gratuit pour tous les utilisateurs. L'inclusion économique, c'est notre priorité.",
    textEn: 'Albatros is and will always be 100% free for all users. Economic inclusion is our priority.',
    badge: 'Gratuit & Performant',
  },
];

const OnboardingScreen = ({ onDone }) => {
  const { language, t, scaledSize, colors, isDarkMode } = useApp();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isEn = language === 'en';

  const handleDone = async () => {
    await AsyncStorage.setItem('onboardingSeen', 'true');
    if (onDone) onDone();
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleDone();
    }
  };

  const renderSlide = ({ item }) => (
    <LinearGradient colors={item.gradient} style={styles.slide}>
      {/* Badge inclusif */}
      <View style={[styles.badge, { borderColor: item.color }]}>
        <Text style={[styles.badgeText, { color: item.color }]} accessibilityRole="text">
          {item.badge}
        </Text>
      </View>

      {/* Icône centrale animée */}
      <View style={[styles.iconCircle, { backgroundColor: item.color + '22', borderColor: item.color + '55' }]}>
        <View style={[styles.iconInner, { backgroundColor: item.color + '44' }]}>
          <Feather name={item.icon} size={56} color={item.color} accessibilityLabel={item.badge} />
        </View>
      </View>

      <Text
        style={[styles.slideTitle, { fontSize: scaledSize(26), color: '#fff' }]}
        accessibilityRole="header"
      >
        {isEn ? item.titleEn : item.titleFr}
      </Text>
      <Text
        style={[styles.slideText, { fontSize: scaledSize(16), color: 'rgba(255,255,255,0.8)' }]}
        accessibilityRole="text"
      >
        {isEn ? item.textEn : item.textFr}
      </Text>
    </LinearGradient>
  );

  const lastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>


      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        scrollEventThrottle={16}
      />

      {/* Indicateurs de pagination */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20, backgroundColor: isDarkMode ? 'rgba(10,22,40,0.95)' : 'rgba(255,255,255,0.95)' }]} accessibilityLabel={`Slide ${currentIndex + 1} sur ${SLIDES.length}`}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: SLIDES[currentIndex]?.color || '#3b82f6' }]}
              />
            );
          })}
        </View>

        <View style={styles.footerBtns}>
          {!lastSlide && (
            <TouchableOpacity
              onPress={handleDone}
              style={styles.skipBtn}
              accessibilityLabel={isEn ? 'Skip onboarding' : "Passer l'introduction"}
              accessibilityRole="button"
            >
              <Text style={styles.skipText}>{isEn ? 'Skip' : 'Passer'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={goNext}
            style={[styles.nextBtn, { backgroundColor: SLIDES[currentIndex]?.color || '#3b82f6' }]}
            accessibilityLabel={lastSlide ? (isEn ? 'Get started' : 'Commencer') : (isEn ? 'Next' : 'Suivant')}
            accessibilityRole="button"
            accessibilityHint={lastSlide ? (isEn ? 'Opens the app' : "Ouvre l'application") : (isEn ? 'Goes to next slide' : 'Passe au slide suivant')}
          >
            <Text style={styles.nextBtnText}>
              {lastSlide ? (isEn ? '🚀 Commencer' : '🚀 Commencer') : (isEn ? 'Next →' : 'Suivant →')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width, minHeight: height * 0.85,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, paddingTop: 60, paddingBottom: 40,
  },
  badge: {
    borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 32,
  },
  badgeText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  iconCircle: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
  },
  iconInner: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  slideTitle: {
    fontWeight: '800', textAlign: 'center', marginBottom: 16, lineHeight: 34,
  },
  slideText: {
    textAlign: 'center', lineHeight: 26,
  },
  footer: {
    paddingHorizontal: 24, paddingTop: 20,
  },
  dots: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 20,
  },
  dot: { height: 8, borderRadius: 4 },
  footerBtns: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  skipBtn: { padding: 14 },
  skipText: { color: 'gray', fontSize: 15, fontWeight: '600' },
  nextBtn: {
    flex: 1, marginLeft: 12, paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default OnboardingScreen;
