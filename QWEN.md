# RailTrack QR - AI-Powered Fitting Management System

## Project Overview

RailTrack QR is an AI-powered fitting management system for Indian Railways designed to track 23.5 crore track fittings using laser-based QR codes. The system combines hardware (laser QR marking) with a web application for tracking, inspection, and AI-driven analytics. This project was developed for the Smart India Hackathon 2025.

**Project Name:** RailTrack QR - AI-Powered Fitting Management System
**Problem Statement:** Laser-based QR code marking system for tracking 23.5 crore track fittings annually with UDM/TMS integration and AI-based quality monitoring.

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (professional, accessible)
- **QR Generation:** qrcode library
- **QR Scanning:** html5-qrcode (mobile camera support)

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (for inspection images)
- **API:** Next.js API Routes

### AI/Analytics
- **Rule Engine:** Custom TypeScript logic
- **Predictive Model:** Simple regression (failure prediction)
- **Data Visualization:** Recharts

### Deployment
- **Hosting:** Vercel (frontend)
- **Database:** Supabase Cloud

## Database Schema

The system uses the following tables:

1. **users** - User authentication and role management
2. **fittings** - Main inventory of track fittings
3. **inspections** - Inspection records and history
4. **vendors** - Vendor data for mock UDM/TMS integration
5. **alerts** - AI-generated alerts and notifications
6. **sync_logs** - Mock UDM/TMS integration logs

### Key Database Fields
- Fittings use `qr_code` as unique identifier in the format: `IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]`
- Inspections include GPS coordinates, status, notes, and inspection images
- Alerts have severity levels (low, medium, high, critical) and resolution status

## Project Structure

```
railtrack-qr/
├── app/
│   ├── (auth)/                 # Authentication routes
│   ├── (dashboard)/           # Main application routes
│   │   ├── fittings/          # Fitting management
│   │   ├── inspections/       # Inspection logging
│   │   ├── scan/              # QR Scanner
│   │   ├── alerts/            # AI Alerts dashboard
│   │   └── vendors/           # Vendor analytics
│   ├── api/
│   │   ├── fittings/          # CRUD operations
│   │   ├── inspections/       # Inspection API
│   │   ├── alerts/            # Alert engine
│   │   ├── ai/                # AI analysis endpoints
│   │   └── sync/              # Mock UDM/TMS integration
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/             # Dashboard components
│   ├── fittings/              # Fitting components
│   ├── inspections/           # Inspection components
│   ├── scanner/               # QR Scanner components
│   └── charts/                # Analytics charts
├── lib/
│   ├── supabase/              # Database client setup
│   ├── ai/                    # AI rule engine & models
│   └── utils/                 # Utility functions
├── types/                     # TypeScript type definitions
└── public/
```

## Core Features

### Authentication & Authorization
- Email/password authentication via Supabase Auth
- Role-based access control:
  - **Depot Manager:** Create fittings, view all data
  - **Inspector:** Scan QR, log inspections
  - **Admin:** Full access + vendor analytics

### Depot Manager Features
- Add new fittings with QR code generation
- View fittings with filtering capabilities
- Download/print QR codes for physical attachment
- Export fitting data to CSV/PDF

### Inspector Features
- Camera-based QR scanning (mobile-friendly)
- Manual QR code entry fallback
- Inspection logging with GPS location capture
- Image upload capability (max 5 images per inspection)

### AI Features
- Automated alert generation (warranty expiry, vendor quality, failure prediction)
- Vendor quality scoring algorithm
- Predictive maintenance model
- Duplicate inspection detection

## AI Rules & Alert Generation

### Alert Types
1. **Warranty Expiry:**
   - Critical: < 30 days
   - High: 30-90 days
   - Medium: 90-180 days

2. **Vendor Quality:**
   - Critical: Failure rate > 20%
   - High: Failure rate 15-20%
   - Medium: Failure rate 10-15%

3. **Failure Prediction:**
   - 2+ "Needs Attention" in 6 months → High risk
   - Same lot has 3+ failures → Critical

### Vendor Scoring Algorithm
```typescript
qualityScore = 100 - (failureRate × 2) - (lateDeliveries × 0.5)
```

## QR Code Format

Format: `IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]`
Example: `IR-CLIP-ABC-LOT123-1704384000`

## Integration Points

### Mock UDM/TMS Systems
- UDM Sync (www.ireps.gov.in): Mock vendor data integration
- TMS Sync (www.irecept.gov.in): Mock track section data
- Simulated API responses for demonstration purposes

## User Flows

### Depot Manager Flow
1. Login → Dashboard
2. Click "Add New Fitting"
3. Fill form and generate QR code
4. Download/print QR label
5. Save fitting to database
6. Trigger UDM sync

### Inspector Flow
1. Login → Dashboard
2. Click "Scan QR Code"
3. Scan QR on fitting or manual entry
4. View fitting details
5. Log inspection with GPS and images
6. Submit and receive AI analysis

## Environment Setup

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://vtcsqfovdqevbazuxpcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODkyMTAsImV4cCI6MjA3NTE2NTIxMH0.XIMHVwKs5g0w9XsTv86egSL7jhsy0XlJVyhupltT2Mc
```

## Development Conventions

1. **Error Handling:**
   - Include GPS fallback for inspections
   - Implement offline data persistence
   - Handle duplicate inspection detection

2. **Testing Guidelines:**
   - Test QR scanning with pre-generated test codes
   - Use mock UDM/TMS responses for integration testing
   - Monitor Supabase quotas during development

3. **AI Model Updates:**
   - Use `/lib/ai/alertEngine.ts` for rule modifications
   - Failure predictions updated daily
   - Vendor scores recalculated on inspection/sync

## Success Criteria

### Must-Have (MVP)
- ✅ User authentication (login/signup)
- ✅ Add fitting with QR generation
- ✅ QR scanner (mobile camera)
- ✅ Log inspection with GPS
- ✅ Basic dashboard with metrics
- ✅ Warranty expiry alerts
- ✅ Mock UDM/TMS sync

### Should-Have (Competitive Edge)
- ✅ Vendor quality scoring
- ✅ Failure prediction
- ✅ Analytics charts
- ✅ Image upload for inspections
- ✅ CSV export

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Camera not working on mobile | Add manual QR entry fallback |
| Supabase quota exceeded | Use local PostgreSQL for demo |
| Slow QR scanning | Pre-load test QR codes |
| No internet during demo | Deploy locally + use mock data |
| Questions about real UDM/TMS | Explain API access pending, show mock integration |

This system is designed to handle the tracking of 23.5 crore track fittings with a focus on scalability, mobile-first design, AI-powered analytics, and integration-readiness for real UDM/TMS systems.