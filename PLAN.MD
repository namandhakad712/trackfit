FULL IMPLEMENTATION PLAN: QR Code Tracking System for Indian Railways
Smart India Hackathon 2025 - Complete Roadmap
📋 PROJECT OVERVIEW
Project Name: RailTrack QR - AI-Powered Fitting Management System
Problem Statement:
Laser-based QR code marking system for tracking 23.5 crore track fittings annually with UDM/TMS integration and AI-based quality monitoring.

Solution Components:
Hardware: Laser QR marking concept (demonstration/prototype)
Software: Web app with mobile scanning, AI analytics, mock UDM/TMS integration
AI: Predictive maintenance, vendor quality scoring, automated alerts
🛠️ TECH STACK (FINAL)
Frontend
Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS
UI Components: shadcn/ui (professional, accessible)
QR Generation: qrcode library
QR Scanning: html5-qrcode (mobile camera support)
Backend
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
Storage: Supabase Storage (for inspection images)
API: Next.js API Routes
AI/Analytics
Rule Engine: Custom TypeScript logic
Predictive Model: Simple regression (failure prediction)
Data Visualization: Recharts
Deployment
Hosting: Vercel (frontend)
Database: Supabase Cloud (already set up)
📊 DATABASE SCHEMA
-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('depot_manager', 'inspector', 'admin')),
  depot_location TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Fittings Table (Main inventory)
CREATE TABLE fittings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code TEXT UNIQUE NOT NULL,
  part_type TEXT NOT NULL CHECK (part_type IN ('elastic_rail_clip', 'rail_pad', 'liner', 'sleeper')),
  manufacturer TEXT NOT NULL,
  lot_number TEXT NOT NULL,
  supply_date DATE NOT NULL,
  warranty_months INTEGER NOT NULL,
  warranty_expiry DATE NOT NULL,
  quantity INTEGER DEFAULT 1,
  current_location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'under_inspection', 'failed', 'replaced')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- Extra fields like dimensions, weight, etc.
);

-- 3. Inspections Table
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fitting_id UUID REFERENCES fittings(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES users(id),
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('manufacturing', 'supply', 'in_service', 'maintenance')),
  status TEXT NOT NULL CHECK (status IN ('pass', 'fail', 'needs_attention')),
  notes TEXT,
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  images TEXT[], -- Array of image URLs
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 4. Vendor Data (Mock UDM/TMS)
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_code TEXT UNIQUE NOT NULL,
  vendor_name TEXT NOT NULL,
  total_supplies INTEGER DEFAULT 0,
  total_inspections INTEGER DEFAULT 0,
  failed_inspections INTEGER DEFAULT 0,
  failure_rate DECIMAL(5, 2) DEFAULT 0.00,
  quality_score DECIMAL(5, 2) DEFAULT 100.00,
  last_sync TIMESTAMP DEFAULT NOW()
);

-- 5. AI Alerts Table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fitting_id UUID REFERENCES fittings(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('warranty_expiry', 'vendor_quality', 'failure_prediction', 'duplicate_inspection')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. UDM/TMS Sync Log (Mock integration tracking)
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('udm', 'tms')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_fittings_qr ON fittings(qr_code);
CREATE INDEX idx_fittings_status ON fittings(status);
CREATE INDEX idx_inspections_fitting ON inspections(fitting_id);
CREATE INDEX idx_alerts_fitting ON alerts(fitting_id);
CREATE INDEX idx_alerts_resolved ON alerts(resolved);
🎨 PROJECT STRUCTURE
railtrack-qr/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Main dashboard
│   │   ├── fittings/
│   │   │   ├── page.tsx                # Fittings list
│   │   │   ├── add/page.tsx            # Add new fitting
│   │   │   └── [id]/page.tsx           # Fitting details
│   │   ├── inspections/
│   │   │   ├── page.tsx                # Inspections list
│   │   │   └── add/page.tsx            # Log inspection
│   │   ├── scan/
│   │   │   └── page.tsx                # QR Scanner
│   │   ├── alerts/
│   │   │   └── page.tsx                # AI Alerts dashboard
│   │   └── vendors/
│   │       └── page.tsx                # Vendor analytics
│   ├── api/
│   │   ├── fittings/
│   │   │   ├── route.ts                # CRUD operations
│   │   │   └── [id]/route.ts
│   │   ├── inspections/
│   │   │   └── route.ts
│   │   ├── alerts/
│   │   │   └── route.ts
│   │   ├── ai/
│   │   │   ├── analyze/route.ts        # AI analysis endpoint
│   │   │   └── predict/route.ts        # Failure prediction
│   │   └── sync/
│   │       ├── udm/route.ts            # Mock UDM sync
│   │       └── tms/route.ts            # Mock TMS sync
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn components
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── StatsCard.tsx
│   ├── fittings/
│   │   ├── FittingForm.tsx
│   │   ├── FittingCard.tsx
│   │   └── QRCodeDisplay.tsx
│   ├── inspections/
│   │   ├── InspectionForm.tsx
│   │   └── InspectionHistory.tsx
│   ├── scanner/
│   │   └── QRScanner.tsx
│   ├── alerts/
│   │   └── AlertCard.tsx
│   └── charts/
│       ├── VendorChart.tsx
│       └── InspectionTrends.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── ai/
│   │   ├── alertEngine.ts              # Rule-based alerts
│   │   ├── vendorScoring.ts            # Quality scoring
│   │   └── failurePrediction.ts        # ML model
│   ├── utils/
│   │   ├── qrGenerator.ts
│   │   └── dateHelpers.ts
│   └── constants.ts
├── types/
│   └── index.ts                        # TypeScript types
├── public/
│   └── images/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
⚙️ CORE FEATURES BREAKDOWN
1. Authentication & Authorization
Login/Signup: Email + password (Supabase Auth)
Role-based access:
Depot Manager: Create fittings, view all data
Inspector: Scan QR, log inspections
Admin: Full access + vendor analytics
2. Depot Manager Features
A. Add New Fitting
Form fields:
Part Type (dropdown: Clip, Pad, Liner, Sleeper)
Manufacturer (text)
Lot Number (text)
Supply Date (date picker)
Warranty Period (months)
Quantity (number)
Current Location (text)
QR Code Format: IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
Example: IR-CLIP-ABC-LOT123-1704384000
Actions:
Generate QR code (display on screen)
Download QR as PNG
Print QR label
Save to database
Auto-trigger UDM sync
B. View Fittings
Table view with filters:
Part type
Manufacturer
Status
Warranty status
Search by QR code or lot number
Export to CSV/PDF
3. Inspector Features
A. QR Scanner
Camera-based scanning (mobile-friendly)
Manual QR code entry (fallback)
Instant fitting details display
B. Log Inspection
Form fields:
Inspection Type (Manufacturing, Supply, In-Service, Maintenance)
Status (Pass, Fail, Needs Attention)
Notes (textarea)
GPS Location (auto-capture)
Upload Images (optional, max 5)
Actions:
Save inspection
Trigger AI analysis
Generate alert if needed
Update fitting status
C. Inspection History
Timeline view of all inspections for a fitting
Filter by date, status, inspector
4. AI Features
A. Automated Alerts
// Alert Rules
1. Warranty Expiry:
   - Critical: < 30 days
   - High: 30-90 days
   - Medium: 90-180 days

2. Vendor Quality:
   - Critical: Failure rate > 20%
   - High: Failure rate 15-20%
   - Medium: Failure rate 10-15%

3. Failure Prediction:
   - Analyze inspection history
   - If 2+ "Needs Attention" in 6 months → High risk
   - If same lot has 3+ failures → Critical

4. Duplicate Inspection:
   - Same fitting inspected twice in 24 hours → Warning
B. Vendor Scoring Algorithm
Quality Score = 100 - (Failure Rate × 2) - (Late Deliveries × 0.5)
- Score > 90: Excellent
- Score 75-90: Good
- Score 60-75: Average
- Score < 60: Poor (flag for review)
C. Predictive Maintenance
Simple linear regression on inspection data
Predict failure probability based on:
Age of fitting
Number of inspections
Historical failure rate of lot
Vendor quality score
5. Dashboard & Analytics
Key Metrics
Total Fittings (by type)
Active Inspections (last 30 days)
Critical Alerts (unresolved)
Vendor Performance (top 5 best/worst)
Charts
Inspection trends (line chart)
Failure rate by part type (bar chart)
Vendor comparison (radar chart)
Warranty expiry timeline (Gantt-style)
6. Mock UDM/TMS Integration
UDM Sync (www.ireps.gov.in)
Simulate vendor data fetch
Mock API response:
{
  "vendor_code": "ABC123",
  "vendor_name": "ABC Industries",
  "total_orders": 150,
  "pending_deliveries": 5,
  "quality_rating": 4.2
}
Show "Last synced: X mins ago" in UI
TMS Sync (www.irecept.gov.in)
Simulate track section data
Mock API response:
{
  "track_section": "Delhi-Mumbai-KM-450",
  "total_fittings": 1200,
  "last_inspection": "2025-01-03",
  "critical_issues": 3
}
🚀 IMPLEMENTATION TIMELINE
Day 1: Setup & Core Infrastructure (6-8 hours)
Morning (3-4 hours)
✅ Initialize Next.js project with TypeScript
✅ Install dependencies (Tailwind, shadcn/ui, Supabase, QR libraries)
✅ Configure Supabase connection
✅ Create database schema (run SQL scripts)
✅ Set up authentication (login/signup pages)
Afternoon (3-4 hours)
✅ Build dashboard layout (sidebar, header)
✅ Create TypeScript types
✅ Set up API routes structure
✅ Implement role-based routing
Day 2: Depot Manager Features (6-8 hours)
Morning (3-4 hours)
✅ Build "Add Fitting" form
✅ Implement QR code generation
✅ Create QR display/download component
✅ Save fitting to Supabase
Afternoon (3-4 hours)
✅ Build fittings list page (table view)
✅ Add filters and search
✅ Create fitting details page
✅ Implement CSV export
Day 3: Inspector Features (6-8 hours)
Morning (3-4 hours)
✅ Build QR scanner component (camera access)
✅ Implement QR code validation
✅ Display fitting details after scan
✅ Add manual QR entry fallback
Afternoon (3-4 hours)
✅ Build inspection form
✅ Implement GPS location capture
✅ Add image upload (Supabase Storage)
✅ Save inspection to database
✅ Update fitting status
Day 4: AI & Analytics (6-8 hours)
Morning (3-4 hours)
✅ Implement alert engine (warranty, vendor, prediction)
✅ Build vendor scoring algorithm
✅ Create alerts dashboard
✅ Add alert notifications
Afternoon (3-4 hours)
✅ Build analytics dashboard
✅ Create charts (inspection trends, vendor comparison)
✅ Implement failure prediction model
✅ Add vendor analytics page
Day 5: Integration & Polish (6-8 hours)
Morning (3-4 hours)
✅ Implement mock UDM/TMS sync
✅ Create sync status indicators
✅ Build sync logs page
✅ Add error handling
Afternoon (3-4 hours)
✅ Mobile responsiveness testing
✅ Edge case handling (invalid QR, offline mode)
✅ Performance optimization
✅ Deploy to Vercel
✅ Create demo video/screenshots
📱 USER FLOWS
Flow 1: Depot Manager Creates Fitting
1. Login → Dashboard
2. Click "Add New Fitting"
3. Fill form (part type, manufacturer, lot, supply date, warranty)
4. Click "Generate QR Code"
5. System generates QR: IR-CLIP-ABC-LOT123-1704384000
6. Display QR on screen
7. Download QR as PNG
8. Print QR label
9. Save to database
10. Trigger UDM sync (mock)
11. Show success message
Flow 2: Inspector Scans & Inspects
1. Login → Dashboard
2. Click "Scan QR Code"
3. Allow camera access
4. Scan QR code on fitting
5. System fetches fitting details
6. Display: Manufacturer, Lot, Supply Date, Warranty, Inspection History
7. Click "Log Inspection"
8. Select inspection type (In-Service)
9. Select status (Pass/Fail/Needs Attention)
10. Add notes
11. Auto-capture GPS location
12. Upload images (optional)
13. Submit inspection
14. AI analyzes data
15. Generate alert if needed (e.g., "Warranty expires in 20 days")
16. Show success + alert
17. Trigger TMS sync (mock)
Flow 3: AI Alert Generation
1. New inspection saved
2. AI engine runs checks:
   - Warranty < 90 days? → Create alert
   - Vendor failure rate > 15%? → Create alert
   - 2+ "Needs Attention" in 6 months? → Create alert
3. Save alerts to database
4. Display on dashboard (red badge)
5. Send notification (future: email/SMS)
🎯 DEMO STRATEGY (For Judges)
What to Show (5-7 minutes)
Problem Statement (30 sec)

Show statistics: 23.5 crore fittings, no tracking system
Hardware Concept (1 min)

Show laser QR marking concept (video/image)
Explain durability vs traditional labels
Software Demo (3-4 mins)

Depot Manager: Create fitting → Generate QR → Print
Inspector: Scan QR → View details → Log inspection
AI Alerts: Show warranty expiry alert, vendor quality warning
Dashboard: Show analytics, vendor comparison
UDM/TMS Integration (1 min)

Show mock sync status
Explain real-world integration plan
Impact (30 sec)

Quality monitoring, inventory management, safety improvement
Key Talking Points
✅ Scalable: Handles 23.5 crore fittings
✅ Mobile-first: Inspectors use phones in field
✅ AI-powered: Predictive maintenance, vendor scoring
✅ Integration-ready: Mock UDM/TMS (real APIs pending)
✅ Cost-effective: Laser QR (permanent) vs stickers
🔧 ENVIRONMENT SETUP
.env.local
NEXT_PUBLIC_SUPABASE_URL=https://vtcsqfovdqevbazuxpcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODkyMTAsImV4cCI6MjA3NTE2NTIxMH0.XIMHVwKs5g0w9XsTv86egSL7jhsy0XlJVyhupltT2Mc
📦 DEPENDENCIES
{
  "dependencies": {
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
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
✅ SUCCESS CRITERIA
Must-Have (MVP)
✅ User authentication (login/signup)
✅ Add fitting with QR generation
✅ QR scanner (mobile camera)
✅ Log inspection with GPS
✅ Basic dashboard with metrics
✅ Warranty expiry alerts
✅ Mock UDM/TMS sync
Should-Have (Competitive Edge)
✅ Vendor quality scoring
✅ Failure prediction
✅ Analytics charts
✅ Image upload for inspections
✅ CSV export
Nice-to-Have (Bonus)
⚠️ Offline mode (PWA)
⚠️ Email/SMS notifications
⚠️ Multi-language support
⚠️ Advanced ML model
🚨 RISK MITIGATION
| Risk | Mitigation | |----------|----------------| | Camera not working on mobile | Add manual QR entry fallback | | Supabase quota exceeded | Use local PostgreSQL for demo | | Slow QR scanning | Pre-load test QR codes | | No internet during demo | Deploy locally + use mock data | | Judges ask about real UDM/TMS | Explain API access pending, show mock integration |

🎬 NEXT STEPS
I'll now start building the project. Here's what I'll do:

Create project structure
Set up Supabase schema
Build authentication
Implement core features (Day 1-3)
Add AI features (Day 4)
Polish & deploy (Day 5)
Ready to start? Type "START" and I'll begin coding! 🚀

