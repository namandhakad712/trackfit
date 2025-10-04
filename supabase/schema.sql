-- RailTrack QR Database Schema
-- This schema supports tracking 23.5 crore (235 million) railway track fittings

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('depot_manager', 'inspector', 'admin')),
  depot_location TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FITTINGS TABLE
-- ============================================================================
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

-- ============================================================================
-- INSPECTIONS TABLE
-- ============================================================================
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

-- ============================================================================
-- VENDORS TABLE
-- ============================================================================
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

-- ============================================================================
-- ALERTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fitting_id UUID NOT NULL REFERENCES fittings(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('warranty_expiry', 'vendor_quality', 'failure_prediction', 'duplicate_inspection')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SYNC LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('udm', 'tms')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE users IS 'User accounts with role-based access control';
COMMENT ON TABLE fittings IS 'Railway track fitting inventory with QR codes';
COMMENT ON TABLE inspections IS 'Inspection records with GPS and images';
COMMENT ON TABLE vendors IS 'Vendor quality metrics and performance data';
COMMENT ON TABLE alerts IS 'AI-generated alerts for proactive maintenance';
COMMENT ON TABLE sync_logs IS 'UDM/TMS integration sync history';

COMMENT ON COLUMN fittings.qr_code IS 'Format: IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]';
COMMENT ON COLUMN fittings.warranty_expiry IS 'Calculated as supply_date + warranty_months';
COMMENT ON COLUMN vendors.quality_score IS 'Formula: 100 - (failure_rate × 2) - (late_deliveries × 0.5)';
