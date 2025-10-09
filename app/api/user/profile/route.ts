/**
 * User Profile API Endpoint
 * GET /api/user/profile - Fetch authenticated user's profile with role and depot_location
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  unauthorizedResponse, 
  serverErrorResponse 
} from '@/lib/permissions/api';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Get authenticated user from session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return unauthorizedResponse('No valid session found');
    }

    // Fetch user profile with role from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, role, depot_location, phone, created_at')
      .eq('id', authUser.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return serverErrorResponse('Failed to fetch user profile');
    }

    if (!profile) {
      return Response.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Return user profile
    return Response.json({
      user: profile
    });

  } catch (error) {
    console.error('Unexpected error in profile endpoint:', error);
    return serverErrorResponse('An unexpected error occurred');
  }
}
