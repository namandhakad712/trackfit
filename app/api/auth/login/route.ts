import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { loginSchema } from '@/lib/validations/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = loginSchema.parse(body);
    
    const supabase = await createClient();
    
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (!data.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    // Use service role client to bypass RLS and fetch user role from users table
    const serviceRoleSupabase = createServiceRoleClient();
    
    let userData, userError;
    
    if (serviceRoleSupabase) {
      const result = await serviceRoleSupabase
        .from('users')
        .select('role, name, depot_location')
        .eq('id', data.user.id)
        .single();
      
      userData = result.data;
      userError = result.error;
    } else {
      // Fall back to regular client if service role key is not available
      const supabase = await createClient();
      const result = await supabase
        .from('users')
        .select('role, name, depot_location')
        .eq('id', data.user.id)
        .single();
      
      userData = result.data;
      userError = result.error;
    }
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userData.role,
        name: userData.name,
        depot_location: userData.depot_location,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
