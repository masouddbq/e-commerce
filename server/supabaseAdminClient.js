/* eslint-env node */
import { createClient } from '@supabase/supabase-js';
import process from 'node:process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL تنظیم نشده است');
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY تنظیم نشده است');
}

// ایجاد Supabase client با تنظیمات بهینه
// استفاده از REST API URL (نه PostgreSQL connection string)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'lent-shop-api',
    },
  },
});

// تابع برای refresh connection (در صورت نیاز)
export const refreshSupabaseConnection = () => {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'lent-shop-api-refreshed',
      },
    },
});
};

export default supabaseAdmin;


