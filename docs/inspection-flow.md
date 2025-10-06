# Inspection Logging System - Complete User Flow

## Overview

This document describes the complete user flow for the inspection logging system with map overlays and admin-only detailed views.

## 1. Inspection Logging Flow

### 1.1 User Initiates Inspection
1. User navigates to a fitting detail page
2. Clicks "Log Inspection" button
3. The `InspectionForm` component is displayed

### 1.2 Filling the Inspection Form
1. User selects inspection type (Manufacturing, Supply, In-Service, Maintenance)
2. User selects status (Pass, Fail, Needs Attention)
3. User captures location using Ola Maps integration:
   - Clicks "Use Current Location" to get GPS coordinates
   - OR clicks on the map to select a specific location
   - OR manually enters coordinates
4. User adds optional notes
5. User uploads images (up to 5)
6. User submits the form

### 1.3 Data Processing and Storage
1. Form data is validated on the client side
2. Data is sent to `/api/inspections` endpoint
3. Images are uploaded to Supabase Storage
4. Public URLs are generated for images
5. Inspection record is inserted into `inspections` table:
   ```sql
   INSERT INTO inspections (
     fitting_id,
     inspector_id,
     inspection_type,
     status,
     notes,
     gps_latitude,
     gps_longitude,
     images
   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
   ```
6. Timestamp is automatically set by the database

## 2. Map Overlay System

### 2.1 Overlay Display on Fitting Detail Page
1. When viewing a fitting, the location is displayed on a map
2. The `FittingPartOverlay` component displays the appropriate overlay image based on part type:
   - Clips: `/overlays/clips/rail-clip.png`
   - Pads: `/overlays/pads/rail-pad.png`
   - Liners: `/overlays/liners/liner.png`
   - Sleepers: `/overlays/sleepers/sleeper.png`
3. Overlay is positioned at the fitting's GPS coordinates
4. Overlay size and rotation can be adjusted based on fitting orientation

### 2.2 Overlay Customization
1. Admins can upload custom overlay images for specific part models
2. Overlay metadata can include dimensions, material information, and installation guides
3. Overlays can be dynamically generated based on fitting specifications

## 3. Inspection History Display

### 3.1 Regular User View
1. Users can see basic inspection history for fittings they have access to
2. Display includes:
   - Inspection type and status
   - Timestamp
   - Inspector name (anonymized for privacy)
   - Brief notes (if any)
   - Image thumbnails (if any)

### 3.2 Admin-Only Detailed View
1. Only users with `admin` role can access detailed inspection logs
2. Admin view includes:
   - Complete inspection record with all metadata
   - Inspector identity and contact information
   - Precise GPS coordinates
   - Full-resolution images
   - Internal timestamps and audit trails
   - Fitting serial numbers and manufacturing details

## 4. Admin Inspection Dashboard

### 4.1 Access Control
1. `/admin/inspection-logs` route is protected by `AdminGuard`
2. Only authenticated users with `admin` role can access the dashboard
3. Unauthorized access attempts are redirected to `/unauthorized`

### 4.2 Dashboard Features
1. Comprehensive list of all inspection logs
2. Advanced filtering by:
   - Status (Pass, Fail, Needs Attention)
   - Inspection type
   - Date range
   - Inspector
   - Fitting type
3. Search functionality across all inspection data
4. Export capabilities for compliance reporting
5. Detailed view modal for each inspection record

## 5. Data Retrieval Flow

### 5.1 For Regular Users
1. API requests are made to `/api/inspections` with user context
2. RLS policies filter results based on user role and permissions
3. Sensitive data is masked or excluded from responses
4. Only relevant inspection history is returned

### 5.2 For Admin Users
1. API requests are made to `/api/admin/inspections` 
2. Service role client bypasses RLS policies
3. Complete dataset is returned including:
   - All inspection metadata
   - Inspector personal information
   - Precise location data
   - Full image sets
   - Audit trail information

## 6. Security Measures

### 6.1 Role-Based Access Control
- Regular users: Limited view of inspection data
- Admin users: Complete access to all inspection logs
- Access is verified at both frontend (route guards) and backend (RLS/API validation)

### 6.2 Data Protection
- PII is only visible to authorized personnel
- Audit logs track all admin access to sensitive data
- Image storage uses secure, signed URLs with expiration
- Database connections use service role keys only where necessary

### 6.3 Compliance Features
- Complete audit trail for all inspection activities
- Export functionality for regulatory reporting
- Data retention policies aligned with industry standards
- Secure deletion of obsolete records

## 7. Performance Optimization

### 7.1 Map Rendering
- Overlays are cached for repeated use
- Map markers are clustered for dense areas
- Lazy loading of overlay images
- Efficient cleanup of map resources

### 7.2 Data Loading
- Pagination for large inspection datasets
- Client-side filtering for responsive UI
- Background loading of additional data
- Optimized database queries with proper indexing

## 8. Future Enhancements

### 8.1 Advanced Visualization
- 3D visualization of fittings and overlays
- AR integration for field inspections
- Custom overlay designer for administrators
- Real-time collaboration features

### 8.2 Analytics and Reporting
- Trend analysis of inspection results
- Predictive maintenance recommendations
- Performance dashboards for fleet management
- Integration with external asset management systems