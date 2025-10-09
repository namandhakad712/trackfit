-- Fix infinite recursion in users table RLS policies
-- Drop ALL existing policies on users table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON users';
    END LOOP;
END $$;

-- Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Policy 1: Users can read their own data using auth.uid() directly
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own data using auth.uid() directly
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Service role can do everything (for admin operations via service role client)
CREATE POLICY "Service role full access"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Note: Admin access to other users should be done via service role client in API routes
-- This avoids the infinite recursion problem
