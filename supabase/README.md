# Supabase Database Setup

This directory contains all SQL scripts needed to set up the RailTrack QR database schema in Supabase.

## Files

1. **schema.sql** - Core database tables and constraints
2. **indexes.sql** - Performance indexes for efficient queries
3. **rls_policies.sql** - Row Level Security policies for access control
4. **storage.sql** - Storage bucket configuration for inspection images
5. **setup.sql** - Complete setup script (runs all files in order)

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Log in to your Supabase project at https://supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `setup.sql`
5. Click **Run** to execute the script
6. Verify tables are created in the **Table Editor**

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref vtcsqfovdqevbazuxpcr

# Run migrations
supabase db push
```

### Option 3: Manual Execution

Execute each file in order:

1. Run `schema.sql` - Creates all tables
2. Run `indexes.sql` - Adds performance indexes
3. Run `rls_policies.sql` - Enables Row Level Security
4. Run `storage.sql` - Configures storage bucket

## Database Schema Overview

### Tables

#### users
- Stores user accounts with role-based access
- Roles: depot_manager, inspector, admin
- Linked to Supabase Auth

#### fittings
- Railway track fitting inventory
- QR code format: IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
- Tracks warranty expiry and status

#### inspections
- Inspection records with GPS and images
- Supports 4 inspection types
- Stores up to 5 images per inspection

#### vendors
- Vendor quality metrics
- Calculated quality scores and failure rates
- Synced with mock UDM system

#### alerts
- AI-generated alerts for proactive maintenance
- 4 alert types with severity levels
- Tracks resolution status

#### sync_logs
- UDM/TMS integration sync history
- Tracks success/failure of sync operations

### Indexes

All tables have optimized indexes for:
- Fast QR code lookups
- Efficient filtering and sorting
- Pagination support (50 items per page)
- Foreign key relationships

### Row Level Security (RLS)

All tables have RLS enabled with role-based policies:

- **depot_manager**: Can create fittings, view all data
- **inspector**: Can create inspections, view all data
- **admin**: Full access to all operations

### Storage

- **Bucket**: inspection-images
- **Access**: Private (authenticated users only)
- **File size limit**: 5MB per image
- **Max images**: 5 per inspection

## Verification

After running the setup, verify the installation:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check storage bucket exists
SELECT * FROM storage.buckets 
WHERE id = 'inspection-images';
```

## Sample Data

To populate the database with test data for development:

```sql
-- Create test users
INSERT INTO users (email, name, role, depot_location) VALUES
('manager@railway.in', 'Test Manager', 'depot_manager', 'Delhi Depot'),
('inspector@railway.in', 'Test Inspector', 'inspector', 'Mumbai Section'),
('admin@railway.in', 'Test Admin', 'admin', NULL);

-- Create test vendor
INSERT INTO vendors (vendor_code, vendor_name) VALUES
('ABC123', 'ABC Industries');
```

## Troubleshooting

### Issue: RLS policies blocking queries

**Solution**: Ensure you're authenticated and have the correct role assigned.

```sql
-- Check current user role
SELECT role FROM users WHERE id = auth.uid();
```

### Issue: Storage bucket not accessible

**Solution**: Verify storage policies are created and bucket exists.

```sql
-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'inspection-images';
```

### Issue: Indexes not being used

**Solution**: Run ANALYZE to update query planner statistics.

```sql
ANALYZE fittings;
ANALYZE inspections;
ANALYZE alerts;
```

## Performance Considerations

- Database is optimized for 235 million fittings
- All foreign keys have indexes
- Composite indexes for common filter combinations
- Partial indexes for frequently filtered subsets
- Pagination implemented for large result sets

## Security Notes

- All tables have RLS enabled
- Storage bucket is private (not publicly accessible)
- Policies enforce role-based access control
- Service role bypasses RLS for system operations

## Next Steps

After database setup:

1. Update `.env.local` with Supabase credentials
2. Test authentication flow
3. Create test users with different roles
4. Verify API routes can access database
5. Test file upload to storage bucket

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review error logs in Supabase Dashboard
- Verify environment variables are correct
