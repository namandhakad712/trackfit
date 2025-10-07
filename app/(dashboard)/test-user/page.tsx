import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function TestUserPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="p-8">
      <h1 className=