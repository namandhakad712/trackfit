import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { redirect } from 'next/navigation';
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SupabaseConnectionStatus } from '@/components/ui/SupabaseConnectionStatus';

type UserProfile = {
  name: string;
  role: 'depot_manager' | 'inspector' | 'admin';
  depot_location: string | null;
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Try to fetch user profile with regular client first
  let { data: profile, error: profileError } = await supabase
    .from('users')
    .select('name, role, depot_location')
    .eq('id', user.id)
    .single<UserProfile>();

  // If regular client fails, try with service role client to bypass RLS
  if (profileError || !profile) {
    const serviceRoleSupabase = createServiceRoleClient();
    
    if (serviceRoleSupabase) {
      const result = await serviceRoleSupabase
        .from('users')
        .select('name, role, depot_location')
        .eq('id', user.id)
        .single<UserProfile>();
      
      profile = result.data;
      profileError = result.error;
    }
  }

  const userRole = profile?.role;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        userRole={userRole} 
        userName={profile?.name}
      />
      <div className="lg:pl-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
      <SupabaseConnectionStatus />
    </div>
  );
}
