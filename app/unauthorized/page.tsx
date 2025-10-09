/**
 * Unauthorized Access Page
 * Displays when a user attempts to access a route they don't have permission for
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShieldAlert, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function UnauthorizedPage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Fetch user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('name, email, role')
    .eq('id', user.id)
    .single();

  const roleName = profile?.role === 'depot_manager' 
    ? 'Depot Manager' 
    : profile?.role === 'inspector' 
    ? 'Inspector' 
    : 'Admin';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Access Denied
          </h1>

          {/* Message */}
          <p className="text-center text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Name:</span>
                <span className="text-sm text-gray-900 ml-2">{profile?.name || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email:</span>
                <span className="text-sm text-gray-900 ml-2">{profile?.email || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Current Role:</span>
                <span className="text-sm text-gray-900 ml-2">{roleName}</span>
              </div>
            </div>
          </div>

          {/* Available Actions */}
          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full" variant="default">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>

            <Link href="mailto:admin@railtrack.com?subject=Access Request" className="block">
              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Contact Admin
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-xs text-center text-gray-500 mt-6">
            If you believe you should have access to this page, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
