# Quick Start Guide

Get RailTrack QR running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Git installed

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/railtrack-qr.git
cd railtrack-qr

# Install dependencies
npm install

# Install missing dependency
npm install @radix-ui/react-switch
```

## Step 2: Supabase Setup (2 minutes)

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project
3. Wait for project to be ready
4. Go to Settings → API
5. Copy your credentials

## Step 3: Environment Variables (1 minute)

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Database Setup (1 minute)

```bash
# Link to your Supabase project
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push
```

## Step 5: Create Admin User (1 minute)

Go to Supabase SQL Editor and run:

```sql
-- Create admin user (replace with your email/password)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
VALUES ('admin@example.com', crypt('admin123', gen_salt('bf')), NOW(), 'authenticated');

-- Get the user ID from the response, then:
INSERT INTO public.users (id, email, name, role)
VALUES ('paste-user-id-here', 'admin@example.com', 'Admin User', 'admin');
```

## Step 6: Run! (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Login

- Email: `admin@example.com`
- Password: `admin123` (or what you set)

## What's Next?

1. **Explore the Dashboard**: See admin features
2. **Create Users**: Go to Users page, add inspectors and depot managers
3. **Add Fittings**: Go to Fittings page, create some test fittings
4. **Scan QR Codes**: Use the Scan page to test QR scanning
5. **Log Inspections**: Create test inspections

## Common Issues

### "Module not found: @radix-ui/react-switch"
```bash
npm install @radix-ui/react-switch
```

### "Infinite recursion in policy"
```bash
# Run the fix migration
npx supabase db push
```

### "Failed to fetch user role"
- Check your Supabase credentials in `.env.local`
- Ensure RLS policies are applied
- Verify user exists in `users` table

### Build errors
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

## Need Help?

- 📖 Read the [full README](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 Open an [issue](https://github.com/yourusername/railtrack-qr/issues)
- 💬 Start a [discussion](https://github.com/yourusername/railtrack-qr/discussions)

---

**That's it!** You're ready to use RailTrack QR! 🎉
