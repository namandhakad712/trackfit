import { createClient } from './lib/supabase/server';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    const supabase = await createClient();
    
    // Test basic connection by fetching a count of users (if any)
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: true, head: true });
    
    if (error) {
      console.error('Error testing connection:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    console.log('User count:', count);
    return true;
  } catch (error) {
    console.error('Unexpected error testing connection:', error);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('Supabase connection test passed');
  } else {
    console.log('Supabase connection test failed');
  }
  process.exit(0);
});