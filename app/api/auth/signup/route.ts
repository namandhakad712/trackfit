import { createClient } from '@/lib/supabase/server';
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
    
    // Create user record in users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        depot_location: validatedData.depot_location || null,
        phone: validatedData.phone || null,
      });
    
    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
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
