# RailTrack QR - Stack Details & Configuration

## 🚀 Complete Technical Stack Configuration

### Supabase Configuration

**Project URL:** `https://vtcsqfovdqevbazuxpcr.supabase.co`

**API Keys:**
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODkyMTAsImV4cCI6MjA3NTE2NTIxMH0.XIMHVwKs5g0w9XsTv86egSL7jhsy0XlJVyhupltT2Mc`

**Database Access:**
- **Dashboard:** https://supabase.com/dashboard/project/vtcsqfovdqevbazuxpcr
- **API Docs:** https://supabase.com/docs/guides/api
- **Table Editor:** https://supabase.com/dashboard/project/vtcsqfovdqevbazuxpcr/editor

### Environment Variables (.env.local)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vtcsqfovdqevbazuxpcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODkyMTAsImV4cCI6MjA3NTE2NTIxMH0.XIMHVwKs5g0w9XsTv86egSL7jhsy0XlJVyhupltT2Mc

# Optional: Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: JWT Secret (if needed for custom auth)
SUPABASE_JWT_SECRET=your_jwt_secret_here
```

### Technology Stack

#### Frontend Framework
- **Next.js 14** (App Router)
- **React 18.2.0**
- **TypeScript 5.3.0**

#### Styling & UI
- **Tailwind CSS 3.4.0**
- **shadcn/ui** (Radix UI components)
- **Lucide React 0.300.0** (icons)
- **Class Variance Authority 0.7.0** (styling variants)

#### Database & Backend
- **Supabase** (PostgreSQL)
- **Supabase Auth** (authentication)
- **Supabase Storage** (file uploads)

#### QR Code & Scanning
- **qrcode 1.5.3** (QR generation)
- **html5-qrcode 2.3.8** (camera scanning)

#### Data & Forms
- **React Hook Form 7.49.0** (form handling)
- **Zod 3.22.0** (validation)
- **date-fns 3.0.0** (date utilities)

#### Charts & Analytics
- **Recharts 2.10.0** (data visualization)

### Dependencies (package.json)

#### Production Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/auth-helpers-nextjs": "^0.8.0",
  "qrcode": "^1.5.3",
  "html5-qrcode": "^2.3.8",
  "recharts": "^2.10.0",
  "date-fns": "^3.0.0",
  "zod": "^3.22.0",
  "react-hook-form": "^7.49.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "lucide-react": "^0.300.0",
  "tailwindcss": "^3.4.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

#### Development Dependencies
```json
{
  "@types/node": "^20.10.0",
  "@types/react": "^18.2.0",
  "typescript": "^5.3.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

### Installation Commands

```bash
# Install all dependencies
npm install

# Or using pnpm (if preferred)
pnpm install

# Or using yarn (if preferred)
yarn install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### External API Integrations

#### Mock UDM Integration
- **System:** Unified Depot Management (UDM)
- **Website:** www.ireps.gov.in
- **Mock Endpoint:** `/api/sync/udm`
- **Purpose:** Vendor data synchronization

#### Mock TMS Integration
- **System:** Track Management System (TMS)
- **Website:** www.irecept.gov.in
- **Mock Endpoint:** `/api/sync/tms`
- **Purpose:** Track section data synchronization

### Database Schema Tables

1. **users** - User authentication and role management
2. **fittings** - Main inventory of track fittings
3. **inspections** - Inspection records and history
4. **vendors** - Vendor data for UDM/TMS integration
5. **alerts** - AI-generated alerts and notifications
6. **sync_logs** - Integration tracking logs

### Deployment Configuration

#### Vercel Deployment
- **Platform:** Vercel
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

#### Supabase Settings
- **Region:** Auto-detected
- **Database:** PostgreSQL 15
- **Storage:** Enabled for inspection images
- **Auth:** Enabled with email/password

### Development Setup Checklist

- [ ] Clone repository
- [ ] Install Node.js (v18+ recommended)
- [ ] Install dependencies (`npm install`)
- [ ] Copy `.env.local` and configure Supabase keys
- [ ] Set up Supabase database schema
- [ ] Run database migrations/seeds
- [ ] Start development server (`npm run dev`)

### API Endpoints Structure

```
app/api/
├── fittings/           # CRUD operations for fittings
├── inspections/        # Inspection management
├── alerts/            # AI alert system
├── ai/                # AI analysis endpoints
│   ├── analyze/       # General analysis
│   └── predict/       # Failure prediction
└── sync/              # External integrations
    ├── udm/           # UDM mock sync
    └── tms/           # TMS mock sync
```

### File Storage

- **Inspection Images:** Supabase Storage bucket
- **QR Codes:** Generated client-side, downloadable as PNG
- **Reports:** CSV/PDF exports (client-side generation)

### Authentication Flow

1. **Client-side:** Next.js middleware for route protection
2. **Server-side:** API route guards using Supabase Auth
3. **Roles:** depot_manager, inspector, admin
4. **Session Management:** HttpOnly cookies + JWT tokens

### QR Code Configuration

- **Format:** `IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]`
- **Example:** `IR-CLIP-ABC-LOT123-1704384000`
- **Generation:** Client-side using qrcode library
- **Scanning:** Camera input via html5-qrcode

### Mobile Responsiveness

- **Framework:** Tailwind CSS responsive utilities
- **Camera Access:** Progressive Web App features
- **Touch Optimization:** Mobile-first design approach
- **GPS Integration:** Geolocation API for inspections

### AI & Analytics Setup

- **Alert Engine:** `/lib/ai/alertEngine.ts`
- **Vendor Scoring:** `/lib/ai/vendorScoring.ts`
- **Failure Prediction:** `/lib/ai/failurePrediction.ts`
- **Charts:** Recharts components in `/components/charts/`

### Testing Configuration

- **Unit Tests:** Jest (if added later)
- **E2E Tests:** Playwright (if added later)
- **Manual Testing:** QR code scanning with test data

### Performance Optimization

- **Images:** Supabase Storage with optimization
- **Database:** Indexed queries for fittings and inspections
- **Caching:** Next.js built-in caching strategies
- **Bundle:** Code splitting and lazy loading

### Security Considerations

- **API Keys:** Environment variables (not in code)
- **CORS:** Supabase handles cross-origin requests
- **Authentication:** Supabase Auth with RLS policies
- **File Uploads:** Image validation and size limits

---

**Last Updated:** October 2025
**Project:** RailTrack QR - Smart India Hackathon 2025
**Maintainer:** Development Team
