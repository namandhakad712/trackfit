/**
 * API permission validation utilities
 * Provides functions to validate user permissions for API endpoints
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserRole } from './roles';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  depot_location: string | null;
  phone: string | null;
}

export interface PermissionValidationResult {
  authorized: boolean;
  user?: User;
  error?: string;
}

/**
 * Validate API permission for a request
 * @param request - The Next.js request object
 * @param requiredRoles - Array of roles that are allowed to access the endpoint
 * @returns Permission validation result with user data if authorized
 */
export async function validateApiPermission(
  request: NextRequest,
  requiredRoles: UserRole[]
): Promise<PermissionValidationResult> {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Get authenticated user from session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return {
        authorized: false,
        error: 'Unauthorized - No valid session',
      };
    }

    // Fetch user profile with role from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, role, depot_location, phone')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return {
        authorized: false,
        error: 'User profile not found',
      };
    }

    // Check if user's role is in the required roles
    if (!requiredRoles.includes(profile.role)) {
      return {
        authorized: false,
        user: profile as User,
        error: `Insufficient permissions - Required roles: ${requiredRoles.join(', ')}`,
      };
    }

    // Authorization successful
    return {
      authorized: true,
      user: profile as User,
    };
  } catch (error) {
    console.error('Permission validation error:', error);
    return {
      authorized: false,
      error: 'Internal server error during permission validation',
    };
  }
}

/**
 * Get authenticated user with role from request
 * @param request - The Next.js request object
 * @returns User object if authenticated, null otherwise
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<User | null> {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, role, depot_location, phone')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile as User;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Check if user has any of the specified roles
 * @param user - The user object
 * @param roles - Array of roles to check
 * @returns true if user has any of the roles
 */
export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

/**
 * Check if user has a specific role
 * @param user - The user object
 * @param role - The role to check
 * @returns true if user has the role
 */
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

/**
 * Check if user is an admin
 * @param user - The user object
 * @returns true if user is an admin
 */
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

/**
 * Check if user is a depot manager
 * @param user - The user object
 * @returns true if user is a depot manager
 */
export function isDepotManager(user: User): boolean {
  return user.role === 'depot_manager';
}

/**
 * Check if user is an inspector
 * @param user - The user object
 * @returns true if user is an inspector
 */
export function isInspector(user: User): boolean {
  return user.role === 'inspector';
}

/**
 * Validate depot manager has depot location assigned
 * @param user - The user object
 * @returns true if user is not a depot manager or has depot location
 */
export function hasValidDepotLocation(user: User): boolean {
  if (user.role !== 'depot_manager') {
    return true;
  }
  return user.depot_location !== null && user.depot_location !== '';
}

/**
 * Create a standardized API error response
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @returns Response object
 */
export function createErrorResponse(message: string, statusCode: number) {
  return Response.json(
    { error: message },
    { status: statusCode }
  );
}

/**
 * Create a 401 Unauthorized response
 * @param message - Optional custom message
 * @returns Response object
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return createErrorResponse(message, 401);
}

/**
 * Create a 403 Forbidden response
 * @param message - Optional custom message
 * @returns Response object
 */
export function forbiddenResponse(message: string = 'Forbidden - Insufficient permissions') {
  return createErrorResponse(message, 403);
}

/**
 * Create a 404 Not Found response
 * @param message - Optional custom message
 * @returns Response object
 */
export function notFoundResponse(message: string = 'Resource not found') {
  return createErrorResponse(message, 404);
}

/**
 * Create a 500 Internal Server Error response
 * @param message - Optional custom message
 * @returns Response object
 */
export function serverErrorResponse(message: string = 'Internal server error') {
  return createErrorResponse(message, 500);
}
