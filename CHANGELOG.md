# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Role-based access control system (Inspector, Depot Manager, Admin)
- QR code generation and scanning functionality
- Inspection logging with GPS and image upload
- Real-time dashboard with role-specific views
- Alert system for warranty expiry and quality issues
- Vendor performance tracking and analytics
- User management interface (Admin only)
- System settings management
- Middleware route protection
- API permission validation
- Database migrations for all tables

### Security
- Row-Level Security (RLS) policies for all tables
- Fixed infinite recursion in users table RLS policies
- Service role authentication for admin operations
- Secure file upload to Supabase Storage

## [1.0.0] - 2025-01-10

### Added
- Initial release
- Core fitting management system
- Authentication with Supabase
- Basic dashboard functionality
- QR code scanning
- Inspection logging
- Alert generation

---

## Release Notes Format

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
