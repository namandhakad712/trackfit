-- RailTrack QR Database Indexes
-- Optimized for handling 235 million fittings with efficient query performance

-- ============================================================================
-- FITTINGS TABLE INDEXES
-- ============================================================================

-- Primary lookup by QR code (most frequent query)
CREATE INDEX IF NOT EXISTS idx_fittings_qr_code 
ON fittings(qr_code);

-- Filter by status (active, failed, replaced)
CREATE INDEX IF NOT EXISTS idx_fittings_status 
ON fittings(status);

-- Filter by part type
CREATE INDEX IF NOT EXISTS idx_fittings_part_type 
ON fittings(part_type);

-- Filter by manufacturer
CREATE INDEX IF NOT EXISTS idx_fittings_manufacturer 
ON fittings(manufacturer);

-- Sort and filter by warranty expiry (for alerts)
CREATE INDEX IF NOT EXISTS idx_fittings_warranty_expiry 
ON fittings(warranty_expiry);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_fittings_part_type_status 
ON fittings(part_type, status);

-- Composite index for manufacturer and status
CREATE INDEX IF NOT EXISTS idx_fittings_manufacturer_status 
ON fittings(manufacturer, status);

-- Index for lot number lookups (for failure prediction)
CREATE INDEX IF NOT EXISTS idx_fittings_lot_number 
ON fittings(lot_number);

-- Index for created_by (depot manager queries)
CREATE INDEX IF NOT EXISTS idx_fittings_created_by 
ON fittings(created_by);

-- ============================================================================
-- INSPECTIONS TABLE INDEXES
-- ============================================================================

-- Foreign key index for fitting lookups
CREATE INDEX IF NOT EXISTS idx_inspections_fitting_id 
ON inspections(fitting_id);

-- Foreign key index for inspector queries
CREATE INDEX IF NOT EXISTS idx_inspections_inspector_id 
ON inspections(inspector_id);

-- Sort by timestamp (most recent first)
CREATE INDEX IF NOT EXISTS idx_inspections_timestamp 
ON inspections(timestamp DESC);

-- Filter by inspection status
CREATE INDEX IF NOT EXISTS idx_inspections_status 
ON inspections(status);

-- Composite index for fitting + timestamp (inspection history)
CREATE INDEX IF NOT EXISTS idx_inspections_fitting_timestamp 
ON inspections(fitting_id, timestamp DESC);

-- Composite index for inspector + timestamp (inspector activity)
CREATE INDEX IF NOT EXISTS idx_inspections_inspector_timestamp 
ON inspections(inspector_id, timestamp DESC);

-- Index for inspection type filtering
CREATE INDEX IF NOT EXISTS idx_inspections_type 
ON inspections(inspection_type);

-- ============================================================================
-- ALERTS TABLE INDEXES
-- ============================================================================

-- Foreign key index for fitting lookups
CREATE INDEX IF NOT EXISTS idx_alerts_fitting_id 
ON alerts(fitting_id);

-- Filter by resolved status (unresolved alerts dashboard)
CREATE INDEX IF NOT EXISTS idx_alerts_resolved 
ON alerts(resolved);

-- Filter by severity (critical alerts first)
CREATE INDEX IF NOT EXISTS idx_alerts_severity 
ON alerts(severity);

-- Sort by creation date
CREATE INDEX IF NOT EXISTS idx_alerts_created_at 
ON alerts(created_at DESC);

-- Composite index for unresolved alerts by severity
CREATE INDEX IF NOT EXISTS idx_alerts_resolved_severity 
ON alerts(resolved, severity) WHERE resolved = FALSE;

-- Composite index for fitting + resolved status
CREATE INDEX IF NOT EXISTS idx_alerts_fitting_resolved 
ON alerts(fitting_id, resolved);

-- Index for alert type filtering
CREATE INDEX IF NOT EXISTS idx_alerts_type 
ON alerts(alert_type);

-- ============================================================================
-- VENDORS TABLE INDEXES
-- ============================================================================

-- Primary lookup by vendor code
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_code 
ON vendors(vendor_code);

-- Sort by quality score (best/worst vendors)
CREATE INDEX IF NOT EXISTS idx_vendors_quality_score 
ON vendors(quality_score DESC);

-- Sort by failure rate
CREATE INDEX IF NOT EXISTS idx_vendors_failure_rate 
ON vendors(failure_rate DESC);

-- Index for last sync timestamp
CREATE INDEX IF NOT EXISTS idx_vendors_last_sync 
ON vendors(last_sync DESC);

-- ============================================================================
-- SYNC LOGS TABLE INDEXES
-- ============================================================================

-- Filter by sync type (udm/tms)
CREATE INDEX IF NOT EXISTS idx_sync_logs_type 
ON sync_logs(sync_type);

-- Filter by status (success/failed)
CREATE INDEX IF NOT EXISTS idx_sync_logs_status 
ON sync_logs(status);

-- Sort by timestamp (most recent first)
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp 
ON sync_logs(timestamp DESC);

-- Composite index for type + status
CREATE INDEX IF NOT EXISTS idx_sync_logs_type_status 
ON sync_logs(sync_type, status);

-- ============================================================================
-- USERS TABLE INDEXES
-- ============================================================================

-- Index for email lookups (login)
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users(email);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role);

-- ============================================================================
-- PERFORMANCE NOTES
-- ============================================================================
-- 1. All foreign key columns have indexes for efficient joins
-- 2. Composite indexes are created for common filter combinations
-- 3. DESC indexes are used for timestamp columns (most recent first)
-- 4. Partial indexes (WHERE clauses) are used for frequently filtered subsets
-- 5. All indexes support the pagination requirements (50 items per page)
