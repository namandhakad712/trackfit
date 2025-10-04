-- RailTrack QR Row Level Security (RLS) Policies
-- Implements role-based access control for all tables

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fittings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- FITTINGS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view fittings
CREATE POLICY "Authenticated users can view fittings"
ON fittings
FOR SELECT
USING (auth.role() = 'authenticated');

-- Depot managers can create fittings
CREATE POLICY "Depot managers can create fittings"
ON fittings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role IN ('depot_manager', 'admin')
  )
);

-- Depot managers and admins can update fittings
CREATE POLICY "Depot managers can update fittings"
ON fittings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role IN ('depot_manager', 'admin')
  )
);

-- Only admins can delete fittings
CREATE POLICY "Admins can delete fittings"
ON fittings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- INSPECTIONS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view inspections
CREATE POLICY "Authenticated users can view inspections"
ON inspections
FOR SELECT
USING (auth.role() = 'authenticated');

-- Inspectors, depot managers, and admins can create inspections
CREATE POLICY "Inspectors can create inspections"
ON inspections
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role IN ('inspector', 'depot_manager', 'admin')
  )
);

-- Users can update their own inspections within 24 hours
CREATE POLICY "Users can update own recent inspections"
ON inspections
FOR UPDATE
USING (
  inspector_id = auth.uid() AND
  timestamp > NOW() - INTERVAL '24 hours'
);

-- Admins can update any inspection
CREATE POLICY "Admins can update any inspection"
ON inspections
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete inspections
CREATE POLICY "Admins can delete inspections"
ON inspections
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- VENDORS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view vendors
CREATE POLICY "Authenticated users can view vendors"
ON vendors
FOR SELECT
USING (auth.role() = 'authenticated');

-- Only admins can create vendors
CREATE POLICY "Admins can create vendors"
ON vendors
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can update vendors
CREATE POLICY "Admins can update vendors"
ON vendors
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete vendors
CREATE POLICY "Admins can delete vendors"
ON vendors
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- ALERTS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view alerts
CREATE POLICY "Authenticated users can view alerts"
ON alerts
FOR SELECT
USING (auth.role() = 'authenticated');

-- System can create alerts (via service role)
-- Note: This policy allows authenticated users to create alerts
-- In production, you may want to restrict this to service role only
CREATE POLICY "Authenticated users can create alerts"
ON alerts
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Depot managers and admins can update alerts (mark as resolved)
CREATE POLICY "Depot managers can update alerts"
ON alerts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role IN ('depot_manager', 'admin')
  )
);

-- Only admins can delete alerts
CREATE POLICY "Admins can delete alerts"
ON alerts
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- SYNC LOGS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view sync logs
CREATE POLICY "Authenticated users can view sync logs"
ON sync_logs
FOR SELECT
USING (auth.role() = 'authenticated');

-- System can create sync logs (via service role)
CREATE POLICY "Authenticated users can create sync logs"
ON sync_logs
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Only admins can delete sync logs
CREATE POLICY "Admins can delete sync logs"
ON sync_logs
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
-- 1. All tables have RLS enabled to enforce access control
-- 2. Policies are role-based: depot_manager, inspector, admin
-- 3. Authenticated users can view most data (read-only)
-- 4. Write operations are restricted by role
-- 5. Admins have full access to all operations
-- 6. Inspectors can only update their own recent inspections
-- 7. Service role bypasses RLS for system operations (alerts, sync logs)
