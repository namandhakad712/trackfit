import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { signupSchema } from '@/lib/validations/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = signupSchema.parse(body);
    
    const supabase = await createClient();
    
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
          role: validatedData.role,
        },
      },
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    if (!data.user) {
      return NextResponse.json(
        { error: 'Signup failed' },
        { status: 400 }
      );
    }
    
    // Use service role client to bypass RLS and create user profile
    const serviceRoleSupabase = createServiceRoleClient();
    
    let insertError;
    
    if (serviceRoleSupabase) {
      // Create user record in users table using service role client to bypass RLS
      // Check if user already exists to prevent duplicate key errors
      const { data: existingUsers } = await serviceRoleSupabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .limit(1);

      if (!existingUsers || existingUsers.length === 0) {
        // Only insert if the user doesn't already exist
        const result = await serviceRoleSupabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: validatedData.email,
            name: validatedData.name,
            role: validatedData.role,
            depot_location: validatedData.depot_location || null,
            phone: validatedData.phone || null,
          }]);
        
        insertError = result.error;
      }
    } else {
      // Fall back to regular client if service role key is not available
      const supabase = await createClient();
      
      // Check if user already exists to prevent duplicate key errors
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .limit(1);

      if (!existingUsers || existingUsers.length === 0) {
        // Only insert if the user doesn't already exist
        const result = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: validatedData.email,
            name: validatedData.name,
            role: validatedData.role,
            depot_location: validatedData.depot_location || null,
            phone: validatedData.phone || null,
          }]);
        
        insertError = result.error;
      }
    }
    
    if (insertError) {
      console.error('Error creating user profile:', insertError);
      // If user profile creation fails, try to clean up the auth user
      try {
        // Use service role or admin client for deleting auth users
        const serviceRoleSupabase = createServiceRoleClient();
        if (serviceRoleSupabase) {
          await serviceRoleSupabase.auth.admin.deleteUser(data.user.id);
        } else {
          // Fallback to regular client - though this may not have admin permissions
          const adminSupabase = await createClient();
          await adminSupabase.auth.admin.deleteUser(data.user.id);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up failed signup:', cleanupError);
      }
      
      return NextResponse.json(
        { error: 'Failed to create user profile: ' + (insertError?.message || 'Unknown error') },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: validatedData.role,
        name: validatedData.name,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    
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
