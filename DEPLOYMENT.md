# Deployment Guide

This guide covers deploying RailTrack QR to production.

## Prerequisites

- Supabase project (production)
- Vercel account (or other hosting platform)
- Domain name (optional)
- Node.js 18+

## 1. Supabase Setup

### Create Production Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note down your project credentials:
   - Project URL
   - Anon (public) key
   - Service role key

### Run Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your production project
npx supabase link --project-ref your-production-project-ref

# Push all migrations
npx supabase db push
```

### Configure Storage

1. Go to Storage in Supabase Dashboard
2. Create bucket: `inspection-images`
3. Set bucket to **public** or configure RLS policies
4. Configure CORS if needed

### Create First Admin User

```sql
-- Run this in Supabase SQL Editor
-- Replace with your admin email
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@example.com', crypt('your-secure-password', gen_salt('bf')), NOW());

-- Get the user ID from the above insert
INSERT INTO public.users (id, email, name, role)
VALUES ('user-id-from-above', 'admin@example.com', 'Admin User', 'admin');
```

## 2. Environment Variables

### Production Environment Variables

Create these in your hosting platform (Vercel, etc.):

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# App Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

## 3. Vercel Deployment

### Option A: Deploy via GitHub

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Deploy!

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["bom1"]
}
```

## 4. Post-Deployment Checklist

### Security

- [ ] All environment variables are set correctly
- [ ] Service role key is never exposed to client
- [ ] RLS policies are enabled on all tables
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled (if applicable)

### Database

- [ ] All migrations are applied
- [ ] Indexes are created (see PERFORMANCE.md)
- [ ] Backup strategy is in place
- [ ] Connection pooling is configured

### Monitoring

- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Performance monitoring is enabled
- [ ] Uptime monitoring is configured
- [ ] Log aggregation is set up

### Testing

- [ ] Test all user roles (Inspector, Depot Manager, Admin)
- [ ] Test QR code scanning
- [ ] Test image uploads
- [ ] Test all CRUD operations
- [ ] Test on mobile devices
- [ ] Test in different browsers

### Performance

- [ ] Images are optimized
- [ ] Database queries are optimized
- [ ] Caching is configured
- [ ] CDN is set up (if needed)

## 5. Domain Configuration

### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### DNS Records

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 6. Monitoring & Maintenance

### Health Checks

Set up monitoring for:
- `/api/health` endpoint (create this)
- Database connectivity
- Storage availability
- Authentication service

### Backup Strategy

- **Database**: Supabase provides automatic backups
- **Storage**: Configure backup for inspection images
- **Code**: Keep GitHub repository as source of truth

### Update Strategy

1. Test changes in development
2. Deploy to staging (if available)
3. Run smoke tests
4. Deploy to production
5. Monitor for errors
6. Rollback if needed

## 7. Scaling Considerations

### Database

- Monitor connection pool usage
- Add read replicas if needed
- Optimize slow queries
- Consider connection pooling (PgBouncer)

### Storage

- Monitor storage usage
- Implement image compression
- Consider CDN for images
- Set up lifecycle policies

### Compute

- Monitor response times
- Scale Vercel instances if needed
- Optimize bundle size
- Implement caching strategies

## 8. Troubleshooting

### Common Issues

**Issue**: RLS policy errors
- **Solution**: Check RLS policies in Supabase Dashboard
- Ensure service role key is used for admin operations

**Issue**: Image upload fails
- **Solution**: Check storage bucket permissions
- Verify CORS configuration
- Check file size limits

**Issue**: Slow queries
- **Solution**: Add database indexes
- Optimize query patterns
- Use connection pooling

**Issue**: Authentication errors
- **Solution**: Verify Supabase credentials
- Check JWT expiration settings
- Ensure redirect URLs are configured

## 9. Rollback Procedure

If deployment fails:

```bash
# Vercel CLI
vercel rollback

# Or via Dashboard
# Go to Deployments → Select previous deployment → Promote to Production
```

## 10. Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Supabase Documentation](https://supabase.com/docs)
- Open an issue on GitHub

---

**Important**: Always test in a staging environment before deploying to production!
