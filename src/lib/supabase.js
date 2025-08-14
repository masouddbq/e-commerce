import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid credentials
let supabase = null

try {
  if (supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && 
      supabaseAnonKey && supabaseAnonKey !== 'placeholder-key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
} catch (error) {
  console.warn('Supabase client creation failed:', error)
}

export { supabase }