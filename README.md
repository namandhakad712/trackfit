# RailTrack QR - AI-Powered Fitting Management System

Track 23.5 crore railway track fittings with QR codes and AI analytics for Indian Railways.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **QR Code**: qrcode (generation), html5-qrcode (scanning)
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://vtcsqfovdqevbazuxpcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
railtrack-qr/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── fittings/        # Fitting management
│   │   ├── inspections/     # Inspection logging
│   │   ├── scan/            # QR scanner
│   │   ├── alerts/          # AI alerts
│   │   └── vendors/         # Vendor analytics
│   └── api/                 # API routes
├── components/
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── ai/                 # AI alert engine (to be implemented)
│   └── utils/              # Utility functions
└── types/                   # TypeScript types

```

## Features (Implementation Progress)

- [x] Task 1: Project Setup and Configuration
- [x] Task 2: Database Schema and Supabase Configuration
- [x] Task 3: Authentication System
- [x] Task 4: Core UI Components and Layout
- [x] Task 5: QR Code Generation System
- [x] Task 6: Fitting Management Features
- [x] Task 7: QR Code Scanning System
- [x] Task 8: Inspection Logging System
- [ ] Task 9: AI Alert Engine
- [ ] Task 10: Vendor Management System
- [ ] Task 11: Mock UDM/TMS Integration
- [ ] Task 12: Dashboard and Analytics

## Database Schema

The database schema includes:
- **users**: User authentication and roles
- **fittings**: Track fitting inventory
- **inspections**: Inspection records with GPS and images
- **vendors**: Vendor quality metrics
- **alerts**: AI-generated alerts
- **sync_logs**: UDM/TMS sync history

See `.kiro/specs/railway-qr-tracking/design.md` for detailed schema.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Next Steps

1. Set up database schema in Supabase (Task 2)
2. Implement authentication (Task 3)
3. Build core UI components (Task 4)
4. Continue with remaining tasks as per implementation plan

## License

MIT
