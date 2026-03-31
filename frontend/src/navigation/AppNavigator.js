import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Platform, Modal, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { useApp } from '../services/AppContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import StudentProfileScreen from '../screens/profile/StudentProfileScreen';
import CompanyProfileScreen from '../screens/profile/CompanyProfileScreen';
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import ApplicationsScreen from '../screens/main/ApplicationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CreateOfferScreen from '../screens/main/CreateOfferScreen';
import OfferDetailScreen from '../screens/main/OfferDetailScreen';
import StudentDetailScreen from '../screens/main/StudentDetailScreen';
import ChatScreen from '../screens/main/ChatScreen';
import ConversationsScreen from '../screens/main/ConversationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();

/* ─── Tab bar style ─── */
const TabNavigator = () => {
  const { t, colors = COLORS, isDarkMode = true } = useApp() || {};

  const dynamicTabBarStyle = {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    elevation: 0, borderTopWidth: isDarkMode ? 0 : 1, height: 80,
    backgroundColor: Platform.OS === 'android'
      ? (isDarkMode ? 'rgba(8, 16, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)')
      : 'transparent',
    borderTopColor: colors.glassBorder,
  };

  const dynamicTabBarBackground = () =>
    Platform.OS === 'ios'
      ? <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      : null;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: dynamicTabBarStyle,
        tabBarBackground: dynamicTabBarBackground,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginBottom: 15 },
        tabBarItemStyle: { paddingTop: 10 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          tabBarAccessibilityLabel: t('home'),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: t('search'),
          tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
          tabBarAccessibilityLabel: t('search'),
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          tabBarLabel: t('applications'),
          tabBarIcon: ({ color }) => <Feather name="file-text" size={24} color={color} />,
          tabBarAccessibilityLabel: t('applications'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('settings'),
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
          tabBarAccessibilityLabel: t('settings'),
        }}
      />
    </Tab.Navigator>
  );
};

/* ─── Main stack ─── */
const MainStackNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Tabs" component={TabNavigator} />
    <MainStack.Screen name="CreateOffer" component={CreateOfferScreen} />
    <MainStack.Screen name="OfferDetail" component={OfferDetailScreen} />
    <MainStack.Screen name="StudentDetail" component={StudentDetailScreen} />
    <MainStack.Screen name="Chat" component={ChatScreen} />
    <MainStack.Screen name="Conversations" component={ConversationsScreen} />
    <MainStack.Screen name="StudentProfile" component={StudentProfileScreen} />
    <MainStack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
  </MainStack.Navigator>
);

/* ─── Root navigator ─── */
const AppNavigator = () => {
  const { session, userRole, profile, loading, colors = COLORS } = useApp() || {};
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const storageKey = `onboardingSeen_${profile?.id || 'guest'}`;
        const val = await AsyncStorage.getItem(storageKey);
        console.log(`[AppNavigator] ${storageKey} value:`, val);
        setOnboardingDone(val === 'true');
      } catch (e) {
        console.log('[AppNavigator] Error reading storage:', e);
        setOnboardingDone(false);
      }
    };
    checkOnboarding();
  }, [profile]);

  if (loading || onboardingDone === null) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const showOnboarding = !!(session && profile && onboardingDone === false);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!session ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : !userRole ? (
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
          ) : !profile ? (
            <>
              <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
              <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
            </>
          ) : (
            <Stack.Screen name="Main" component={MainStackNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {/* Onboarding Overlay Modal */}
      <Modal 
        visible={showOnboarding} 
        animationType="slide"
        statusBarTranslucent
        transparent={false}
      >
        <OnboardingScreen onDone={() => {
          console.log('[AppNavigator] Onboarding completed!');
          setOnboardingDone(true);
        }} />
      </Modal>

      {/* Bouton de debug temporaire pour forcer l'onboarding ( visible uniquement en dev ) */}
      {session && profile && onboardingDone === true && (
        <TouchableOpacity 
          style={{ position: 'absolute', top: 50, right: 20, padding: 5, backgroundColor: 'rgba(255,0,0,0.3)', borderRadius: 10 }}
          onPress={async () => {
          const storageKey = `onboardingSeen_${profile?.id || 'guest'}`;
          await AsyncStorage.removeItem(storageKey);
            setOnboardingDone(false);
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10 }}>Reset Onboarding</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppNavigator;
