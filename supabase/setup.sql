-- ============================================================================
-- RailTrack QR - Complete Database Setup Script
-- ============================================================================
-- This script sets up the complete database schema, indexes, RLS policies,
-- and storage configuration for the RailTrack QR system.
--
-- Execute this script in the Supabase SQL Editor to set up the database.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: CREATE TABLES
-- ============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('depot_manager', 'inspector', 'admin')),
  depot_location TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fittings Table
CREATE TABLE IF NOT EXISTS fittings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code TEXT UNIQUE NOT NULL,
  part_type TEXT NOT NULL CHECK (part_type IN ('elastic_rail_clip', 'rail_pad', 'liner', 'sleeper')),
  manufacturer TEXT NOT NULL,
  lot_number TEXT NOT NULL,
  supply_date DATE NOT NULL,
  warranty_months INTEGER NOT NULL,
  warranty_expiry DATE NOT NULL,
  quantity INTEGER DEFAULT 1,
  current_location TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'under_inspection', 'failed', 'replaced')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Inspections Table
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fitting_id UUID NOT NULL REFERENCES fittings(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES users(id),
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('manufacturing', 'supply', 'in_service', 'maintenance')),
  status TEXT NOT NULL CHECK (status IN ('pass', 'fail', 'needs_attention')),
  notes TEXT,
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  images TEXT[],
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_code TEXT UNIQUE NOT NULL,
  vendor_name TEXT NOT NULL,
  total_supplies INTEGER DEFAULT 0,
  total_inspections INTEGER DEFAULT 0,
  failed_inspections INTEGER DEFAULT 0,
  failure_rate DECIMAL(5, 2) DEFAULT 0.00,
  quality_score DECIMAL(5, 2) DEFAULT 100.00,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fitting_id UUID NOT NULL REFERENCES fittings(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('warranty_expiry', 'vendor_quality', 'failure_prediction', 'duplicate_inspection')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitting Overlays Table
CREATE TABLE IF NOT EXISTS fitting_overlays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fitting_type TEXT NOT NULL CHECK (fitting_type IN ('elastic_rail_clip', 'rail_pad', 'liner', 'sleeper')),
  part_type TEXT NOT NULL,
  overlay_image_url TEXT NOT NULL,
  default_size INTEGER DEFAULT 32,
  default_rotation INTEGER DEFAULT 0,
  category TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Logs Table
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('udm', 'tms')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: CREATE INDEXES
-- ============================================================================

-- Fittings indexes
CREATE INDEX IF NOT EXISTS idx_fittings_qr_code ON fittings(qr_code);
CREATE INDEX IF NOT EXISTS idx_fittings_status ON fittings(status);
CREATE INDEX IF NOT EXISTS idx_fittings_part_type ON fittings(part_type);
CREATE INDEX IF NOT EXISTS idx_fittings_manufacturer ON fittings(manufacturer);
CREATE INDEX IF NOT EXISTS idx_fittings_warranty_expiry ON fittings(warranty_expiry);
CREATE INDEX IF NOT EXISTS idx_fittings_part_type_status ON fittings(part_type, status);
CREATE INDEX IF NOT EXISTS idx_fittings_manufacturer_status ON fittings(manufacturer, status);
CREATE INDEX IF NOT EXISTS idx_fittings_lot_number ON fittings(lot_number);
CREATE INDEX IF NOT EXISTS idx_fittings_created_by ON fittings(created_by);

-- Inspections indexes
CREATE INDEX IF NOT EXISTS idx_inspections_fitting_id ON inspections(fitting_id);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector_id ON inspections(inspector_id);
CREATE INDEX IF NOT EXISTS idx_inspections_timestamp ON inspections(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspections_fitting_timestamp ON inspections(fitting_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector_timestamp ON inspections(inspector_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_type ON inspections(inspection_type);

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_fitting_id ON alerts(fitting_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved_severity ON alerts(resolved, severity) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_alerts_fitting_resolved ON alerts(fitting_id, resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(alert_type);

-- Fitting overlays indexes
CREATE INDEX IF NOT EXISTS idx_fitting_overlays_fitting_type ON fitting_overlays(fitting_type);
CREATE INDEX IF NOT EXISTS idx_fitting_overlays_part_type ON fitting_overlays(part_type);
CREATE INDEX IF NOT EXISTS idx_fitting_overlays_category ON fitting_overlays(category);

-- Vendors indexes
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_code ON vendors(vendor_code);
CREATE INDEX IF NOT EXISTS idx_vendors_quality_score ON vendors(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_failure_rate ON vendors(failure_rate DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_last_sync ON vendors(last_sync DESC);

-- Sync logs indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_type ON sync_logs(sync_type);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp ON sync_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_type_status ON sync_logs(sync_type, status);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fittings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: CREATE RLS POLICIES
-- ============================================================================

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Fittings policies
CREATE POLICY "Authenticated users can view fittings" ON fittings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Depot managers can create fittings" ON fittings FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('depot_manager', 'admin')));
CREATE POLICY "Depot managers can update fittings" ON fittings FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('depot_manager', 'admin')));
CREATE POLICY "Admins can delete fittings" ON fittings FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Inspections policies
CREATE POLICY "Authenticated users can view inspections" ON inspections FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Inspectors can create inspections" ON inspections FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('inspector', 'depot_manager', 'admin')));
CREATE POLICY "Users can update own recent inspections" ON inspections FOR UPDATE USING (inspector_id = auth.uid() AND timestamp > NOW() - INTERVAL '24 hours');
CREATE POLICY "Admins can update any inspection" ON inspections FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete inspections" ON inspections FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Vendors policies
CREATE POLICY "Authenticated users can view vendors" ON vendors FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can create vendors" ON vendors FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update vendors" ON vendors FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete vendors" ON vendors FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Alerts policies
CREATE POLICY "Authenticated users can view alerts" ON alerts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create alerts" ON alerts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Depot managers can update alerts" ON alerts FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('depot_manager', 'admin')));
CREATE POLICY "Admins can delete alerts" ON alerts FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Sync logs policies
CREATE POLICY "Authenticated users can view sync logs" ON sync_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create sync logs" ON sync_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete sync logs" ON sync_logs FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- STEP 5: CREATE STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('inspection-images', 'inspection-images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload inspection images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'inspection-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view inspection images" ON storage.objects FOR SELECT USING (bucket_id = 'inspection-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own recent images" ON storage.objects FOR UPDATE USING (bucket_id = 'inspection-images' AND owner = auth.uid() AND created_at > NOW() - INTERVAL '24 hours');
CREATE POLICY "Users can delete own recent images" ON storage.objects FOR DELETE USING (bucket_id = 'inspection-images' AND owner = auth.uid() AND created_at > NOW() - INTERVAL '24 hours');
CREATE POLICY "Admins can delete any inspection image" ON storage.objects FOR DELETE USING (bucket_id = 'inspection-images' AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Database schema, indexes, RLS policies, and storage are now configured.
-- Next steps:
-- 1. Create test users in the users table
-- 2. Verify RLS policies are working
-- 3. Test file upload to storage bucket
-- 4. Connect your Next.js application
-- ============================================================================
