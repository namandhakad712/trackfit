# AI Agent Instructions for RailTrack QR Project

## Project Overview
RailTrack QR is an AI-powered fitting management system for Indian Railways that tracks 23.5 crore track fittings using laser-based QR codes. The system combines hardware (laser QR marking) with a web application for tracking, inspection, and AI-driven analytics.

## Architecture & Key Components

### Core Technology Stack
- Frontend: Next.js 14 (App Router) with TypeScript
- Backend: Supabase (PostgreSQL + Auth)
- AI/Analytics: Custom TypeScript rule engine + regression models
- QR: `qrcode` for generation, `html5-qrcode` for scanning

### Data Flow
1. Depot Manager creates fitting → QR generated → UDM sync
2. Inspector scans QR → logs inspection → TMS sync
3. AI engine analyzes data → generates alerts → updates dashboard

### Critical Files & Directories
```
app/
├── (auth)/               # Authentication routes
├── (dashboard)/          # Main application routes
├── api/                  # Backend API endpoints
    ├── ai/              # AI analysis endpoints
    └── sync/            # UDM/TMS integration
lib/
├── ai/                  # AI rule engine & ML models
└── supabase/           # Database client setup
```

## Development Workflows

### Environment Setup
1. Configure Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema
- Use `users`, `fittings`, `inspections`, `vendors`, `alerts`, `sync_logs` tables
- Refer to schema in SQL for exact structure and relationships
- Critical indexes: `idx_fittings_qr`, `idx_fittings_status`

### AI Rules & Patterns
1. Alert Generation:
   - Warranty expiry thresholds: 30/90/180 days
   - Vendor quality thresholds: failure rates >20%/15%/10%
   - Failure prediction: 2+ "Needs Attention" in 6 months
2. Vendor Scoring:
   ```typescript
   qualityScore = 100 - (failureRate × 2) - (lateDeliveries × 0.5)
   ```

### QR Code Conventions
Format: `IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]`
Example: `IR-CLIP-ABC-LOT123-1704384000`

### Integration Points
1. UDM System (www.ireps.gov.in):
   - Mock vendor data integration in `/api/sync/udm`
   - Response format includes vendor_code, ratings, deliveries
2. TMS System (www.irecept.gov.in):
   - Track section data sync in `/api/sync/tms`
   - Handles critical issues reporting

## Project-Specific Conventions

### Role-Based Access
- Depot Manager: Create fittings, full data access
- Inspector: Scan QR, log inspections
- Admin: Full access + vendor analytics

### Error Handling
- Always include GPS fallback for inspections
- Implement offline data persistence
- Handle duplicate inspection detection

### AI Model Updates
- Use `/lib/ai/alertEngine.ts` for rule modifications
- Failure predictions updated daily
- Vendor scores recalculated on inspection/sync

## Testing & Debug Guidelines
- Test QR scanning with pre-generated test codes
- Use mock UDM/TMS responses for integration testing
- Monitor Supabase quotas during development