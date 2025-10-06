import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Service role client for server-side operations that bypass RLS
export const createServiceRoleClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Some operations may fail.');
    return null;
  }
  
  // Validate that the service role key appears to be a valid JWT
  // (has the correct format with 3 parts separated by dots)
  const parts = serviceRoleKey.split('.');
  if (parts.length !== 3) {
    console.error('Invalid SUPABASE_SERVICE_ROLE_KEY format. Key must be a valid JWT.');
    return null;
  }
  
  try {
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
  } catch (error) {
    console.error('Error creating service role client:', error);
    return null;
  }
};