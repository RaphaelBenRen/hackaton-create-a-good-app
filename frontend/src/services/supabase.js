import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nosqttsuzrpbizujevnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vc3F0dHN1enJwYml6dWpldm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzk2NDksImV4cCI6MjA4OTkxNTY0OX0.AST71F0M_ZUzI6cDU1uaa3kGpGy_dgZ2U7lTbuMMh5Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
