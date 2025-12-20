
import { createClient } from '@supabase/supabase-js';

// These are injected by Vercel at build/runtime
const supabaseUrl = process.env.SUPABASE_URL || 'https://cuqpcruevsulqiphmhnt.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_HA5e8RstVOzcW0CfpAB8sg_ZKF4OcFN';

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
