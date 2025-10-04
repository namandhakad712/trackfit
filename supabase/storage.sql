-- RailTrack QR Storage Configuration
-- Supabase Storage bucket for inspection images

-- ============================================================================
-- CREATE STORAGE BUCKET
-- ============================================================================

-- Create bucket for inspection images
INSERT INTO storage.buckets (id, name, public)
VALUES ('inspection-images', 'inspection-images', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload inspection images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'inspection-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to view images
CREATE POLICY "Authenticated users can view inspection images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'inspection-images' AND
  auth.role() = 'authenticated'
);

-- Allow users to update their own uploaded images (within 24 hours)
CREATE POLICY "Users can update own recent images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'inspection-images' AND
  owner = auth.uid() AND
  created_at > NOW() - INTERVAL '24 hours'
);

-- Allow users to delete their own uploaded images (within 24 hours)
CREATE POLICY "Users can delete own recent images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'inspection-images' AND
  owner = auth.uid() AND
  created_at > NOW() - INTERVAL '24 hours'
);

-- Allow admins to delete any image
CREATE POLICY "Admins can delete any inspection image"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'inspection-images' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- STORAGE CONFIGURATION NOTES
-- ============================================================================
-- Bucket: inspection-images
-- Public: false (requires authentication)
-- File size limit: 5MB per image (enforced client-side and in API)
-- Allowed file types: JPG, PNG, WEBP (enforced client-side)
-- Max images per inspection: 5 (enforced in application logic)
-- 
-- File naming convention: {inspection_id}/{timestamp}_{random}.{ext}
-- Example: 550e8400-e29b-41d4-a716-446655440000/1704384000_abc123.jpg
-- 
-- Storage path structure:
-- inspection-images/
--   ├── {inspection_id}/
--   │   ├── {timestamp}_{random}.jpg
--   │   ├── {timestamp}_{random}.jpg
--   │   └── ...
--
-- Cleanup policy: Images are retained indefinitely
-- Future enhancement: Implement automatic cleanup for deleted inspections
