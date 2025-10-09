# 🚂 RailTrack QR - Railway Fitting Management System

A comprehensive AI-powered QR code-based fitting management system for Indian Railways, built with Next.js, Supabase, and TypeScript.

## 🌟 Features

### Role-Based Access Control
- **Inspector**: Scan QR codes, log inspections, view personal inspection history
- **Depot Manager**: Manage fittings, view depot-specific data, handle alerts
- **Admin**: Full system access, user management, vendor analytics, system settings

### Core Functionality
- 📱 **QR Code Management**: Generate and scan QR codes for railway fittings
- 🔗 **QR accuracy and compression**: Advanced data compression and QR code correction stratergy named "chunk url".
-🗜️ **Fitting Management**: Add, edit, and delete fittings with detailed information
- 🔍 **Inspection Logging**: Record inspections with GPS, images, and detailed notes
- 📊 **Real-time Analytics**: Dashboard with role-specific metrics and insights
- 🚨 **Smart Alerts**: AI-powered alerts for warranty expiry, quality issues, and failures
- 📈 **Vendor Performance**: Track and analyze vendor quality scores
- 🔐 **Secure Authentication**: Supabase Auth with row-level security
- 🌍 **GPS Integration**: Seamless location tracking with OLA Maps API for inspections
- 📸 **Image Upload**: Capture and store inspection & fitting photos

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **UI Components**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Map Platform**: OLA Maps API for subcontinental accuracy.
- **Charts**: Recharts
- **QR Codes**: html5-qrcode, qrcode

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

## 📁 Project Structure

```
railtrack-qr/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Protected dashboard pages
│   └── api/                      # API routes
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   ├── settings/                 # Settings components
│   ├── ui/                       # Reusable UI components
│   └── users/                    # User management components
├── lib/                          # Utility functions
│   ├── ai/                       # AI/ML utilities
│   ├── permissions/              # Role-based access control
│   ├── supabase/                 # Supabase clients
│   ├── utils/                    # Helper functions
│   └── validations/              # Zod schemas
├── supabase/                     # Database migrations
│   └── migrations/               # SQL migration files
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
```

## 🔑 Default User Roles

After setting up the database, you'll need to create users with appropriate roles:

- **inspector**: Can scan QR codes and log inspections
- **depot_manager**: Can manage fittings and view depot data
- **admin**: Full system access

## 🎯 Key Features by Role

### Inspector Dashboard
- Personal inspection statistics
- Recent inspection history
- Quick QR scan access
- Pass/fail rate tracking

### Depot Manager Dashboard
- Depot-specific fitting inventory
- Inspection overview
- Active alerts management
- Warranty expiration tracking

### Admin Dashboard
- System-wide analytics
- User management
- Vendor performance metrics
- Depot comparison
- System settings

## 🔒 Security Features

- Row-Level Security (RLS) policies
- Role-based route protection
- API endpoint authorization
- Secure file uploads
- Session management
- Audit logging (coming soon)

## 📊 Database Schema

Key tables:
- `users` - User profiles with roles
- `fittings` - Railway fitting records
- `inspections` - Inspection logs
- `vendors` - Vendor information
- `alerts` - System alerts
- `settings` - System configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Indian Railways for the use case
- Supabase for the backend infrastructure
- Next.js team for the amazing framework
- Radix UI for accessible components
- OLA Maps API for subcontinental accuracy

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Integration with UDM/TMS systems
- [ ] Predictive maintenance AI
- [ ] Multi-language support LLM
- [ ] Export reports (PDF/Excel)
- [ ] Natural language working functionality 

---

𝘉𝘶𝘪𝘭𝘵 𝘸𝘪𝘵𝘩 ❤️ 𝘧𝘰𝘳 𝘐𝘯𝘥𝘪𝘢𝘯 𝘙𝘢𝘪𝘭𝘸𝘢𝘺𝘴

# мα∂є ву ηαмαη


