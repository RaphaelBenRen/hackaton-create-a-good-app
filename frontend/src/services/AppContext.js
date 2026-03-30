import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../constants/i18n';
import { COLORS, LIGHT_COLORS } from '../constants/theme';
import { supabase } from './supabase';
import { authAPI } from './api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    // Fallback for early render or components outside AppProvider
    return {
      colors: COLORS,
      isDarkMode: true,
      t: (k) => k,
      language: 'fr',
      textScale: 1,
      scaledSize: (s) => s,
      session: null,
      userRole: null,
      profile: null,
      loading: true,
    };
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [language, setLanguageState] = useState('fr');
  const [textScale, setTextScaleState] = useState(1);
  const [isDarkMode, setIsDarkModeState] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRoleRef = useRef(null);

  const colors = isDarkMode ? COLORS : LIGHT_COLORS;

  const t = (key) => translations[language]?.[key] || key;

  const setLanguage = async (lang) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const setTextScale = async (scale) => {
    setTextScaleState(scale);
    await AsyncStorage.setItem('textScale', String(scale));
  };

  const setDarkMode = async (value) => {
    setIsDarkModeState(value);
    await AsyncStorage.setItem('isDarkMode', value ? 'true' : 'false');
  };

  const scaledSize = (size) => Math.round(size * textScale);

  const loadProfile = async () => {
    try {
      const result = await authAPI.me();
      if (result.role) {
        setUserRole(result.role);
        userRoleRef.current = result.role;
        await AsyncStorage.setItem('userRole', result.role);
      }
      if (result.profile) {
        setProfile(result.profile);
        await AsyncStorage.setItem('cachedProfile', JSON.stringify(result.profile));
      }
    } catch (e) {
      console.log('loadProfile error:', e.message);
      const cachedRole = await AsyncStorage.getItem('userRole');
      const cachedProfile = await AsyncStorage.getItem('cachedProfile');
      if (cachedRole && cachedProfile) {
        setUserRole(cachedRole);
        userRoleRef.current = cachedRole;
        setProfile(JSON.parse(cachedProfile));
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('language');
        if (savedLang) setLanguageState(savedLang);

        const savedScale = await AsyncStorage.getItem('textScale');
        if (savedScale) setTextScaleState(parseFloat(savedScale));

        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        if (savedTheme !== null) setIsDarkModeState(savedTheme === 'true');

        const savedRole = await AsyncStorage.getItem('userRole');
        if (savedRole) {
          setUserRole(savedRole);
          userRoleRef.current = savedRole;
        }

        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          await loadProfile();
        }
      } catch (e) {
        console.error('Init error:', e);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!newSession) {
        setSession(null);
        setProfile(null);
        setUserRole(null);
        userRoleRef.current = null;
      } else if (newSession?.user) {
        setLoading(true);
        setSession(newSession);
        const savedRole = await AsyncStorage.getItem('userRole');
        if (savedRole) {
          setUserRole(savedRole);
          userRoleRef.current = savedRole;
        }
        await loadProfile();
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const selectRole = async (role) => {
    setUserRole(role);
    userRoleRef.current = role;
    await AsyncStorage.setItem('userRole', role);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.multiRemove(['userRole', 'cachedProfile']);
    setSession(null);
    setProfile(null);
    setUserRole(null);
    userRoleRef.current = null;
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, t,
      textScale, setTextScale, scaledSize,
      isDarkMode, setDarkMode, colors,
      session, userRole, selectRole, profile, setProfile,
      loading, loadProfile, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};
