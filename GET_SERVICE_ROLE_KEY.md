# How to Get Your Supabase Service Role Key

## Step-by-Step Instructions

1. **Access Your Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/vtcsqfovdqevbazuxpcr

2. **Navigate to Project Settings**:
   - Click on the "Settings" icon in the left sidebar
   - Select "API" from the settings menu

3. **Find the Service Role Key**:
   - Look for the "Project API keys" section
   - You'll see three keys:
     - `anon (Supabase Anon key)` - Already configured
     - `service_role (Supabase Service Role key)` - This is what you need
     - `url (Supabase URL)` - Already configured

4. **Copy the Service Role Key**:
   - The service role key will be a long JWT string starting with "eyJ..."
   - Copy this entire string

5. **Update Your Environment File**:
   - Open `.env.local` in your project root
   - Replace `YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE` with the copied key
   - Also update `SUPABASE_JWT_SECRET` with the same key

## Example Configuration:
```
NEXT_PUBLIC_SUPABASE_URL=https://vtcsqfovdqevbazuxpcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODkyMTAsImV4cCI6MjA3NTE2NTIxMH0.XIMHVwKs5g0w9XsTv86egSL7jhsy0XlJVyhupltT2Mc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODEyNzA4MCwiZXhwIjoyMDM4MTk5MDgwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODEyNzA4MCwiZXhwIjoyMDM4MTk5MDgwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Why This Key is Needed

The service role key is required for:
- Server-side database operations that bypass Row Level Security (RLS)
- Creating fittings, inspections, and other records from API routes
- Generating system alerts and performing system-level operations
- File uploads to Supabase Storage

## Security Notes

- Never commit the .env.local file to version control
- The service role key has full database access, so keep it secure
- Only use it in server-side code, never expose it to the client
- If the key is compromised, regenerate it in the Supabase dashboard

## After Setting the Key

1. Restart your development server (`npm run dev`)
2. The `createServiceRoleClient` function should work properly
3. Fitting creation should succeed without errors