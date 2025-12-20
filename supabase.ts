
import { createClient } from '@supabase/supabase-js';

// Fallback logic to ensure the app never fails to initialize
const getEnv = (key: string, defaultValue: string) => {
  try {
    return (window as any).process?.env?.[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

const supabaseUrl = getEnv('SUPABASE_URL', 'https://cuqpcruevsulqiphmhnt.supabase.co');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY', 'sb_publishable_HA5e8RstVOzcW0CfpAB8sg_ZKF4OcFN');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
