# Implementation Plan

- [x] 1. Project Setup and Configuration





  - Initialize Next.js 14 project with TypeScript and App Router
  - Install dependencies: Supabase client, Tailwind CSS, shadcn/ui, QR libraries, Recharts
  - Configure environment variables for Supabase connection
  - Set up project folder structure following the design document







  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Database Schema and Supabase Configuration


  - [ ] 2.1 Create database tables with proper schema
    - Execute SQL to create users, fittings, inspections, vendors, alerts, and sync_logs tables
    - Add all required columns with correct data types and constraints
    - _Requirements: 1.2, 2.3, 3.3, 4.8, 5.10, 7.2, 8.7, 9.2, 10.2_
  


  - [ ] 2.2 Create database indexes for performance
    - Add indexes on fittings (qr_code, status, part_type, manufacturer, warranty_expiry)
    - Add indexes on inspections (fitting_id, inspector_id, timestamp, status)
    - Add indexes on alerts (fitting_id, resolved, severity, created_at)
    - Add indexes on vendors (vendor_code, quality_score)
    - _Requirements: 9.10 (pagination performance)_



  
  - [x] 2.3 Configure Row Level Security (RLS) policies






    - Enable RLS on all tables
    - Create policies for users (view own profile)
    - Create policies for fittings (depot managers create, all authenticated read)



    - Create policies for inspections (inspectors create, all authenticated read)
    - Create policies for vendors (admins only)
    - _Requirements: 1.3, 1.4, 1.5, 1.6_
  
  - [x] 2.4 Set up Supabase Storage for inspection images



    - Create storage bucket for inspection images
    - Configure bucket policies for authenticated uploads

    - Set file size limits (5MB per image)
    - _Requirements: 4.7_





- [ ] 3. Authentication System
  - [x] 3.1 Create Supabase Auth client configuration


    - Set up Supabase client with auth helpers for Next.js
    - Configure session management and cookie handling
    - _Requirements: 1.2, 1.7_
  
  - [ ] 3.2 Build login page and form component
    - Create login form with email and password fields
    - Implement form validation using react-hook-form and zod
    - Add error handling for invalid credentials
    - Implement role-based redirect after successful login
    - _Requirements: 1.1, 1.2_
  
  - [ ] 3.3 Build signup page and registration flow
    - Create signup form with email, password, name, role, and depot_location fields
    - Implement form validation
    - Create user record in users table after Supabase Auth signup
    - _Requirements: 1.2_
  
  - [ ] 3.4 Implement logout functionality
    - Create logout function that clears session
    - Redirect to login page after logout
    - _Requirements: 1.7_
  
  - [ ] 3.5 Create role-based route protection middleware
    - Implement middleware to check user authentication
    - Verify user role for protected routes
    - Redirect unauthorized users to unauthorized page
    - _Requirements: 1.3, 1.4, 1.5, 1.6_


- [x] 4. Core UI Components and Layout


  - [x] 4.1 Install and configure shadcn/ui components

    - Initialize shadcn/ui in the project
    - Install required components: Button, Input, Select, Dialog, Card, Badge, Table
    - Configure Tailwind CSS theme
    - _Requirements: All UI requirements_
  


  - [ ] 4.2 Create dashboard layout with sidebar and header
    - Build responsive sidebar navigation with role-based menu items
    - Create header component with user profile and logout button
    - Implement mobile hamburger menu


    - _Requirements: 6.1_
  





  - [ ] 4.3 Create reusable UI components
    - Build StatsCard component for dashboard metrics
    - Create AlertsWidget component for displaying alerts
    - Build LoadingSpinner and ErrorBoundary components


    - _Requirements: 6.2, 6.3, 5.11_

- [x] 5. QR Code Generation System





  - [ ] 5.1 Implement QR code generation utility
    - Create generateQRCode function with format IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
    - Implement generateQRCodeImage function using qrcode library
    - Add QR format validation function
    - _Requirements: 2.3, 2.6_


  
  - [ ] 5.2 Build QRCodeDisplay component
    - Display large QR code visualization
    - Add download as PNG button
    - Implement print functionality
    - Add copy QR code text feature
    - _Requirements: 2.6_



- [ ] 6. Fitting Management Features
  - [ ] 6.1 Create fitting form component
    - Build form with fields: part_type, manufacturer, lot_number, supply_date, warranty_months, quantity, current_location
    - Implement form validation with react-hook-form and zod

    - Add part type dropdown with options: elastic_rail_clip, rail_pad, liner, sleeper
    - Implement warranty expiry calculation preview
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [ ] 6.2 Build POST /api/fittings API route
    - Validate form data


    - Generate unique QR code
    - Calculate warranty_expiry from supply_date + warranty_months
    - Check for duplicate QR codes
    - Save fitting to database with status "active"
    - Trigger mock UDM sync
    - Return fitting data with QR code


    - _Requirements: 2.3, 2.4, 2.5, 2.7, 2.8_
  
  - [ ] 6.3 Create add fitting page
    - Integrate FittingForm component


    - Display QRCodeDisplay after successful creation
    - Show success message and options to create another or view fitting
    - _Requirements: 2.1, 2.6_
  


  - [ ] 6.4 Build GET /api/fittings API route with filtering
    - Implement pagination (50 items per page)
    - Add query params for filtering: part_type, manufacturer, status, search
    - Calculate warranty status for each fitting
    - Return fittings array with total count
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.10_
  
  - [ ] 6.5 Create fittings list page with table
    - Build FittingsTable component with sortable columns
    - Implement search functionality
    - Add filters for part type, manufacturer, status, warranty status
    - Implement pagination controls
    - Add export to CSV functionality
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_
  
  - [ ] 6.6 Build GET /api/fittings/[id] API route
    - Fetch fitting details by ID
    - Include related inspections and alerts
    - Return 404 if fitting not found
    - _Requirements: 9.8, 10.1_
  
  - [ ] 6.7 Create fitting detail page
    - Display fitting information (QR code, part type, manufacturer, lot, warranty status)
    - Show inspection history section
    - Display related alerts
    - Add "Add Inspection" button
    - _Requirements: 3.6, 10.1_


- [x] 7. QR Code Scanning System


  - [x] 7.1 Build QRScanner component with camera access

    - Implement camera permission request
    - Create live camera feed with scanning overlay using html5-qrcode
    - Add QR code detection and validation
    - Implement success feedback (visual and audio)
    - _Requirements: 3.1, 3.2, 3.3_
  


  - [ ] 7.2 Add manual QR entry fallback
    - Create manual entry input field
    - Validate QR format before lookup
    - Show manual entry when camera access denied or unavailable


    - _Requirements: 3.7, 3.8_
  
  - [x] 7.3 Create scan page with fitting lookup




    - Integrate QRScanner component
    - Fetch fitting details after successful scan
    - Display error message if QR not found
    - Navigate to fitting detail page after successful scan
    - _Requirements: 3.4, 3.5, 3.6_


- [x] 8. Inspection Logging System

  - [ ] 8.1 Build inspection form component
    - Create form with fields: inspection_type, status, notes, images
    - Add dropdowns for inspection_type (manufacturing, supply, in_service, maintenance)
    - Add status selection (pass, fail, needs_attention)


    - Implement notes textarea with character counter
    - Add image upload with preview (max 5 images, 5MB each)
    - _Requirements: 4.2, 4.3, 4.4, 4.7_
  
  - [ ] 8.2 Implement GPS location capture
    - Auto-capture GPS coordinates when form loads
    - Add manual location entry fallback if GPS unavailable
    - Display captured coordinates in form


    - _Requirements: 4.5, 4.6_
  
  - [ ] 8.3 Build POST /api/inspections API route
    - Validate inspection data
    - Upload images to Supabase Storage
    - Save inspection record with timestamp

    - Update fitting status based on inspection result (fail → failed)
    - Trigger AI alert analysis
    - Trigger mock TMS sync


    - Return inspection data with generated alerts
    - _Requirements: 4.8, 4.9, 4.10, 4.11_
  
  - [ ] 8.4 Create add inspection page
    - Integrate InspectionForm component
    - Pre-fill fitting_id from route params
    - Display success message with generated alerts
    - Redirect to fitting detail page after submission
    - _Requirements: 4.1_
  
  - [ ] 8.5 Build GET /api/inspections API route
    - Implement filtering by fitting_id, inspector_id, status, date range
    - Return inspections in reverse chronological order
    - _Requirements: 10.2, 10.6, 10.7, 10.8_
  
  - [ ] 8.6 Create inspection history component
    - Display inspections in timeline view (newest first)
    - Show inspection type, status, inspector name, timestamp, notes, GPS, images
    - Implement image thumbnails with lightbox expansion
    - Add click-through for GPS coordinates to map view
    - Implement filters for status, date range, inspector
    - Display message when no inspections exist
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_





- [ ] 9. AI Alert Engine
  - [ ] 9.1 Implement alert rule engine core
    - Create AlertRule interface and AlertContext type
    - Build runAlertEngine function that executes all rules

    - Implement alert creation and storage logic
    - _Requirements: 5.1, 5.10_
  
  - [ ] 9.2 Create warranty expiry alert rule
    - Implement condition check for warranty < 180 days

    - Calculate severity based on days until expiry (critical < 30, high < 90, medium < 180)
    - Generate appropriate alert message
    - _Requirements: 5.2, 5.3, 5.4_
  
  - [x] 9.3 Create vendor quality alert rule

    - Implement condition check for vendor failure rate >= 10%
    - Calculate severity based on failure rate (critical >= 20%, high >= 15%, medium >= 10%)
    - Generate vendor quality alert message
    - _Requirements: 5.5, 5.6_
  
  - [x] 9.4 Create failure prediction alert rule

    - Check for 2+ "needs_attention" inspections within 6 months
    - Check for 3+ failed inspections in same lot
    - Calculate severity (critical for lot failures, high for attention flags)
    - Generate failure prediction message


    - _Requirements: 5.7, 5.8_
  
  - [ ] 9.5 Create duplicate inspection detection rule
    - Check if same fitting inspected twice within 24 hours
    - Generate low severity warning alert
    - _Requirements: 5.9_


  
  - [ ] 9.6 Build POST /api/ai/analyze API route
    - Accept fitting_id and inspection_id

    - Fetch required context data (fitting, inspections, vendor, lot data)

    - Run alert engine with context
    - Save generated alerts to database


    - Return alerts array
    - _Requirements: 5.1, 5.10_
  
  - [ ] 9.7 Build GET /api/alerts API route
    - Implement filtering by resolved status, severity, alert_type
    - Return alerts with related fitting data



    - _Requirements: 5.11_
  
  - [ ] 9.8 Build PATCH /api/alerts/[id] API route
    - Update alert resolved status


    - Return updated alert
    - _Requirements: 5.11_
  
  - [x] 9.9 Create alerts dashboard page




    - Display unresolved alerts grouped by severity
    - Show alert message, fitting details, and timestamp
    - Add resolve button for each alert
    - Implement filters for severity and alert type
    - Display badge count for unresolved alerts
    - _Requirements: 5.11_

- [x] 10. Vendor Management System




  - [x] 10.1 Implement vendor quality scoring algorithm

    - Create calculateVendorQualityScore function
    - Formula: 100 - (failure_rate × 2) - (late_deliveries × 0.5)
    - Create getQualityStatus function (Excellent > 90, Good >= 75, Average >= 60, Poor < 60)
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7_
  

  - [x] 10.2 Build GET /api/vendors API route

    - Fetch all vendors from database
    - Calculate quality scores for each vendor
    - Return vendors array with quality status
    - _Requirements: 7.1, 7.2_
  
  - [x] 10.3 Build GET /api/vendors/[id] API route

    - Fetch vendor details by ID
    - Include related fittings and inspections
    - Calculate detailed metrics
    - _Requirements: 7.8_
  

  - [x] 10.4 Create vendors list page

    - Build VendorTable component with columns: code, name, quality score, failure rate
    - Add color-coded quality indicators (green, blue, yellow, red)
    - Implement sortable columns
    - Add click-through to vendor details
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6, 7.7_
  

  - [x] 10.5 Create vendor detail page

    - Display comprehensive vendor metrics
    - Show inspection history for vendor's fittings
    - Display failure trend chart
    - _Requirements: 7.8_
  


  - [x] 10.6 Implement vendor data update on inspection

    - Update vendor metrics when inspection is logged
    - Recalculate failure_rate and quality_score
    - _Requirements: 7.9_


- [-] 11. Mock UDM/TMS Integration


  - [x] 11.1 Create mock UDM integration module

    - Build fetchMockUDMData function that simulates API call to www.ireps.gov.in
    - Return mock vendor data (vendor_code, vendor_name, total_orders, pending_deliveries, quality_rating)
    - Add 1-second delay to simulate network latency
    - _Requirements: 8.2, 8.3_
  

  - [x] 11.2 Create mock TMS integration module

    - Build fetchMockTMSData function that simulates API call to www.irecept.gov.in
    - Return mock track section data (track_section, total_fittings, last_inspection, critical_issues)
    - Add 1.2-second delay to simulate network latency
    - _Requirements: 8.5, 8.6_
  
  - [x] 11.3 Build POST /api/sync/udm API route


    - Accept vendor_code parameter
    - Call fetchMockUDMData
    - Update vendors table with mock data
    - Log sync operation in sync_logs table
    - Handle errors and log failures
    - _Requirements: 8.1, 8.2, 8.3, 8.7, 8.8_
  

  - [x] 11.4 Build POST /api/sync/tms API route

    - Accept track_section parameter
    - Call fetchMockTMSData
    - Store TMS data for reference
    - Log sync operation in sync_logs table
    - Handle errors and log failures
    - _Requirements: 8.4, 8.5, 8.6, 8.7, 8.8_
  

  - [-] 11.5 Build GET /api/sync/logs API route

    - Implement filtering by sync_type, status, date range
    - Return sync logs with status indicators
    - _Requirements: 8.10_
  
  - [x] 11.6 Integrate sync triggers in fitting and inspection creation


    - Trigger UDM sync when fitting is created
    - Trigger TMS sync when inspection is logged
    - _Requirements: 2.8, 4.11_
  


  - [ ] 11.7 Display sync status in dashboard
    - Show "Last synced: X mins ago" for UDM and TMS
    - Add sync status indicators
    - _Requirements: 8.9_

- [x] 12. Dashboard and Analytics



  - [x] 12.1 Build dashboard metrics calculation

    - Calculate total fittings count grouped by part type
    - Calculate total inspections count for last 30 days
    - Count unresolved critical alerts
    - Calculate vendor performance metrics (top 5 best and worst)
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  

  - [x] 12.2 Create dashboard page with stats cards

    - Display total fittings metric with click-through
    - Display inspections count with click-through
    - Display critical alerts count with click-through
    - Display vendor performance summary
    - _Requirements: 6.1, 6.2, 6.10_
  
  - [x] 12.3 Build inspection trends chart component

    - Create line chart showing inspections over time using Recharts
    - Group by inspection status (pass, fail, needs_attention)
    - Add date range selector (7 days, 30 days, 90 days, custom)
    - _Requirements: 6.6_
  

  - [ ] 12.4 Build failure rate chart component
    - Create bar chart showing failure rates by part type
    - Use Recharts for visualization
    - _Requirements: 6.7_

  
  - [ ] 12.5 Build vendor comparison chart component
    - Create radar chart comparing vendor metrics
    - Show quality score, failure rate, delivery performance
    - Add interactive legend for vendor selection

    - _Requirements: 6.8_
  
  - [ ] 12.6 Build warranty timeline chart component
    - Create Gantt-style timeline showing warranty expiry
    - Color-code by urgency (critical, high, medium)

    - Add filters for part type and location
    - _Requirements: 6.9_
  
  - [ ] 12.7 Integrate all charts into dashboard
    - Add charts below stats cards
    - Ensure responsive layout for mobile
    - _Requirements: 6.6, 6.7, 6.8, 6.9_


- [ ] 13. Failure Prediction Model
  - [ ] 13.1 Implement failure prediction algorithm
    - Create predictFailureProbability function with linear regression model
    - Calculate based on age, inspection count, needs_attention count, vendor failure rate, lot failures
    - Create getRiskLevel function (critical >= 70%, high >= 50%, medium >= 30%, low < 30%)
    - _Requirements: 5.7, 5.8_
  
  - [ ] 13.2 Build GET /api/ai/predict API route
    - Accept fitting_id parameter
    - Gather prediction factors (age, inspections, vendor data, lot data)
    - Calculate failure probability
    - Return probability, risk level, and contributing factors
    - _Requirements: 5.7, 5.8_

- [ ] 14. Error Handling and Validation
  - [ ] 14.1 Create error handling utilities
    - Build handleAPIError function for consistent API error responses
    - Create ErrorBoundary component for client-side error catching
    - Implement error logging
    - _Requirements: All requirements (error handling is cross-cutting)_
  
  - [ ] 14.2 Add validation schemas
    - Create zod schemas for fitting creation
    - Create zod schemas for inspection logging
    - Create zod schemas for user registration
    - Add validation error messages
    - _Requirements: 2.1, 2.7, 4.2_
  
  - [ ] 14.3 Implement camera error handling
    - Handle camera permission denied with fallback to manual entry
    - Handle camera not found error
    - Handle scan failure with retry option
    - Display user-friendly error messages
    - _Requirements: 3.1, 3.7_
  
  - [ ] 14.4 Add file upload validation
    - Validate file types (JPG, PNG, WEBP only)
    - Validate file sizes (max 5MB per image)
    - Limit to 5 images per inspection
    - Display validation errors
    - _Requirements: 4.7_

- [ ] 15. Mobile Optimization and Responsive Design
  - [ ] 15.1 Implement mobile-first responsive layouts
    - Ensure all pages work on mobile devices (320px+)
    - Optimize touch targets (min 44x44px)
    - Test on various screen sizes
    - _Requirements: All UI requirements_
  
  - [ ] 15.2 Optimize QR scanner for mobile
    - Adjust camera resolution based on device
    - Reduce frame rate on low-end devices
    - Implement proper camera stream cleanup
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 15.3 Optimize images and assets
    - Use Next.js Image component for automatic optimization
    - Implement lazy loading for inspection images
    - Compress images before upload
    - _Requirements: 4.7, 10.3_

- [ ] 16. Performance Optimization
  - [ ] 16.1 Implement caching strategy
    - Cache dashboard metrics with 5-minute TTL
    - Cache vendor quality scores with 1-hour TTL
    - Use React Query for client-side caching
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 7.2_
  
  - [ ] 16.2 Optimize database queries
    - Use specific column selection instead of SELECT *
    - Verify all indexes are being used
    - Implement query result pagination
    - _Requirements: 9.10_


- [ ] 17. Testing Implementation
  - [ ]* 17.1 Write unit tests for utility functions
    - Test QR code generation and validation
    - Test date calculation functions
    - Test alert rule conditions
    - Test vendor scoring algorithm
    - Test failure prediction model
    - _Requirements: 2.3, 2.4, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 7.3_
  
  - [ ]* 17.2 Write integration tests for API routes
    - Test POST /api/fittings with valid and invalid data
    - Test POST /api/inspections with image upload
    - Test GET /api/fittings with filtering and pagination
    - Test authentication flows
    - Test mock UDM/TMS sync operations
    - _Requirements: 2.1, 2.7, 4.8, 9.3, 9.4, 9.5, 9.6, 9.7, 8.1, 8.4_
  
  - [ ]* 17.3 Write E2E tests for critical user flows
    - Test depot manager flow: login → create fitting → view QR
    - Test inspector flow: login → scan QR → log inspection → view alerts
    - Test role-based access control
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.6, 3.1, 3.3, 4.1, 4.8_

- [ ] 18. Security Hardening
  - [ ] 18.1 Verify RLS policies are enforced
    - Test that users can only access authorized data
    - Test role-based access restrictions
    - Verify policies prevent unauthorized modifications
    - _Requirements: 1.3, 1.4, 1.5, 1.6_
  
  - [ ] 18.2 Implement rate limiting
    - Add rate limiting to login endpoint
    - Add rate limiting to API routes
    - Implement exponential backoff for failed requests
    - _Requirements: 1.1, 1.2_
  
  - [ ] 18.3 Add input sanitization
    - Sanitize all user inputs before database operations
    - Validate file uploads
    - Prevent XSS and SQL injection
    - _Requirements: All input requirements_

- [ ] 19. Deployment and Configuration
  - [ ] 19.1 Configure production environment variables
    - Set up Supabase production project
    - Configure environment variables in Vercel
    - Set up proper CORS configuration
    - _Requirements: All requirements_
  
  - [ ] 19.2 Deploy to Vercel
    - Connect GitHub repository to Vercel
    - Configure build settings
    - Set up automatic deployments
    - _Requirements: All requirements_
  
  - [ ] 19.3 Verify production deployment
    - Test all critical user flows in production
    - Verify database connections
    - Check Supabase Storage access
    - Test mock UDM/TMS integrations
    - _Requirements: All requirements_

- [ ] 20. Documentation and Demo Preparation
  - [ ] 20.1 Create demo data and test accounts
    - Create test users for each role (depot_manager, inspector, admin)
    - Generate sample fittings with QR codes
    - Create sample inspections and alerts
    - Populate vendor data
    - _Requirements: All requirements_
  
  - [ ] 20.2 Prepare demo flow
    - Document demo script for judges
    - Create pre-generated QR codes for scanning demo
    - Prepare talking points for each feature
    - _Requirements: All requirements_
  
  - [ ] 20.3 Create user documentation
    - Write README with setup instructions
    - Document API endpoints
    - Create user guide for each role
    - _Requirements: All requirements_
