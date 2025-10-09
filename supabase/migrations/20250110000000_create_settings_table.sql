-- Create settings table for system configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

-- Insert default settings
INSERT INTO settings (key, value, category, description) VALUES
  ('app_name', '"RailTrack QR"', 'general', 'Application name'),
  ('app_timezone', '"Asia/Kolkata"', 'general', 'Application timezone'),
  ('app_language', '"en"', 'general', 'Default language'),
  ('udm_api_url', '""', 'integrations', 'UDM API endpoint URL'),
  ('udm_api_key', '""', 'integrations', 'UDM API key'),
  ('udm_sync_enabled', 'true', 'integrations', 'Enable UDM synchronization'),
  ('tms_api_url', '""', 'integrations', 'TMS API endpoint URL'),
  ('tms_api_key', '""', 'integrations', 'TMS API key'),
  ('tms_sync_enabled', 'true', 'integrations', 'Enable TMS synchronization'),
  ('email_notifications', 'true', 'notifications', 'Enable email notifications'),
  ('alert_notifications', 'true', 'notifications', 'Enable alert notifications'),
  ('notification_email', '""', 'notifications', 'Notification recipient email'),
  ('default_warranty_months', '24', 'defaults', 'Default warranty period in months'),
  ('default_inspection_type', '"in_service"', 'defaults', 'Default inspection type')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read settings
CREATE POLICY "Admins can read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Only admins can update settings
CREATE POLICY "Admins can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
