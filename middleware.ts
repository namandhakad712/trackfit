import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { canAccessRoute, type UserRole } from '@/lib/permissions/roles';

/**
 * Log unauthorized access attempt for audit purposes
 */
async function logUnauthorizedAccess(
  userId: string,
  userRole: UserRole,
  attemptedPath: string,
  supabase: any
) {
  try {
    // Note: This will be enhanced when audit_logs table is created in task 17
    console.warn('Unauthorized access attempt:', {
      userId,
      userRole,
      attemptedPath,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging unauthorized access:', error);
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes
  const protectedRoutes = ['/dashboard', '/fittings', '/inspections', '/scan', '/alerts', '/vendors', '/users', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based route protection
  if (isProtectedRoute && user) {
    try {
      // Fetch user profile with role from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching user role:', profileError);
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const userRole = profile.role as UserRole;
      const currentPath = request.nextUrl.pathname;

      // Check if user has permission to access the route
      if (!canAccessRoute(userRole, currentPath)) {
        // Log unauthorized access attempt
        await logUnauthorizedAccess(user.id, userRole, currentPath, supabase);

        // Redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      console.error('Error in role-based route protection:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
