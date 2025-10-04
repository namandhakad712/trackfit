import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';

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

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('name, role, depot_location')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={profile?.role} />
      <div className="lg:pl-64">
        <Header
          user={
            profile
              ? {
                  name: profile.name,
                  email: user.email || '',
                  role: profile.role,
                }
              : undefined
          }
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
