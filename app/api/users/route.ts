/**
 * Users Management API
 * Admin-only endpoints for managing users
 */

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { NextRequest, NextResponse } from 'next/server';
import { 
  validateApiPermission,
  forbiddenResponse,
  serverErrorResponse 
} from '@/lib/permissions/api';

/**
 * GET /api/users - List all users
 */
export async function GET(request: NextRequest) {
  try {
    // Validate admin permission
    const validation = await validateApiPermission(request, ['admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error || 'Admin access required');
    }

    const supabase = await createClient();

    // Fetch all users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, depot_location, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return NextResponse.json({
      users: users || [],
    });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return serverErrorResponse('Failed to fetch users');
  }
}

/**
 * POST /api/users - Create new user
 */
export async function POST(request: NextRequest) {
  try {
    // Validate admin permission
    const validation = await validateApiPermission(request, ['admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error || 'Admin access required');
    }

    const body = await request.json();
    const { email, password, name, role, depot_location, phone } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name, role' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['inspector', 'depot_manager', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be inspector, depot_manager, or admin' },
        { status: 400 }
      );
    }

    // Validate depot_location for depot_manager
    if (role === 'depot_manager' && !depot_location) {
      return NextResponse.json(
        { error: 'depot_location is required for depot_manager role' },
        { status: 400 }
      );
    }

    // Use service role client to create user in auth
    const serviceRoleClient = createServiceRoleClient();
    
    if (!serviceRoleClient) {
      return serverErrorResponse('Service role client not available');
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await serviceRoleClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user' },
        { status: 400 }
      );
    }

    // Create user profile in users table
    const { data: userProfile, error: profileError } = await serviceRoleClient
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        depot_location: depot_location || null,
        phone: phone || null,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      
      // Rollback: delete auth user if profile creation fails
      await serviceRoleClient.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: userProfile,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return serverErrorResponse('Failed to create user');
  }
}

/**
 * PUT /api/users - Update user
 */
export async function PUT(request: NextRequest) {
  try {
    // Validate admin permission
    const validation = await validateApiPermission(request, ['admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error || 'Admin access required');
    }

    const body = await request.json();
    const { id, email, name, role, depot_location, phone } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !['inspector', 'depot_manager', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be inspector, depot_manager, or admin' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build update object
    const updates: any = {};
    if (email !== undefined) updates.email = email;
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (depot_location !== undefined) updates.depot_location = depot_location;
    if (phone !== undefined) updates.phone = phone;

    // Update user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (profileError) {
      console.error('Error updating user profile:', profileError);
      throw profileError;
    }

    // If email changed, update in auth
    if (email) {
      const serviceRoleClient = createServiceRoleClient();
      if (serviceRoleClient) {
        await serviceRoleClient.auth.admin.updateUserById(id, { email });
      }
    }

    return NextResponse.json({
      user: userProfile,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/users:', error);
    return serverErrorResponse('Failed to update user');
  }
}

/**
 * DELETE /api/users - Deactivate user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Validate admin permission
    const validation = await validateApiPermission(request, ['admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error || 'Admin access required');
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // Use service role client to delete user
    const serviceRoleClient = createServiceRoleClient();
    
    if (!serviceRoleClient) {
      return serverErrorResponse('Service role client not available');
    }

    // Delete user from auth (this will cascade to users table if FK is set up)
    const { error: authError } = await serviceRoleClient.auth.admin.deleteUser(id);

    if (authError) {
      console.error('Error deleting user:', authError);
      return NextResponse.json(
        { error: authError.message || 'Failed to delete user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/users:', error);
    return serverErrorResponse('Failed to delete user');
  }
}
