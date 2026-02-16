/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Environment variables are REQUIRED for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase URL or Anon Key.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            persistSession: false, // DEBUG: Disable to rule out LocalStorage issues
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    }
);
