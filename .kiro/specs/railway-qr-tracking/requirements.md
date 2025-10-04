# Requirements Document

## Introduction

RailTrack QR is an AI-powered fitting management system designed to track 23.5 crore track fittings annually for Indian Railways using laser-based QR code marking. The system addresses the critical need for inventory management, quality monitoring, and predictive maintenance of railway track components (elastic rail clips, rail pads, liners, and sleepers). The solution integrates with existing UDM/TMS systems and provides mobile-first inspection capabilities with AI-driven analytics for warranty tracking, vendor quality assessment, and failure prediction.

## Requirements

### Requirement 1: User Authentication and Role-Based Access

**User Story:** As a railway system administrator, I want secure role-based authentication so that different users (depot managers, inspectors, admins) can access only the features relevant to their responsibilities.

#### Acceptance Criteria

1. WHEN a user navigates to the application THEN the system SHALL display a login page requiring email and password
2. WHEN a user provides valid credentials THEN the system SHALL authenticate via Supabase Auth and grant access based on their assigned role
3. IF a user has the role "depot_manager" THEN the system SHALL allow access to fitting creation, QR generation, and full inventory viewing
4. IF a user has the role "inspector" THEN the system SHALL allow access to QR scanning, inspection logging, and viewing assigned fittings
5. IF a user has the role "admin" THEN the system SHALL allow full access including vendor analytics and system configuration
6. WHEN a user attempts to access a route without proper role permissions THEN the system SHALL redirect to an unauthorized page
7. WHEN a user logs out THEN the system SHALL clear the session and redirect to the login page

### Requirement 2: Fitting Creation and QR Code Generation

**User Story:** As a depot manager, I want to create new fitting records with automatically generated QR codes so that I can track physical components throughout their lifecycle.

#### Acceptance Criteria

1. WHEN a depot manager clicks "Add New Fitting" THEN the system SHALL display a form with fields for part type, manufacturer, lot number, supply date, warranty months, quantity, and current location
2. WHEN the depot manager selects a part type THEN the system SHALL provide options: elastic_rail_clip, rail_pad, liner, sleeper
3. WHEN the depot manager submits the form with valid data THEN the system SHALL generate a unique QR code in the format IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
4. WHEN a QR code is generated THEN the system SHALL calculate warranty expiry date as supply_date + warranty_months
5. WHEN the fitting is saved THEN the system SHALL store the record in the Supabase fittings table with status "active"
6. WHEN the fitting is saved THEN the system SHALL display the QR code on screen with options to download as PNG and print
7. IF a QR code already exists in the database THEN the system SHALL reject the creation and display error "QR code already exists"
8. WHEN a fitting is created THEN the system SHALL trigger a mock UDM sync operation

### Requirement 3: QR Code Scanning and Fitting Lookup

**User Story:** As an inspector, I want to scan QR codes using my mobile device camera so that I can quickly access fitting details in the field.

#### Acceptance Criteria

1. WHEN an inspector navigates to the scan page THEN the system SHALL request camera permissions
2. WHEN camera access is granted THEN the system SHALL display a live camera feed with QR scanning overlay
3. WHEN a valid QR code is detected THEN the system SHALL automatically decode and validate the QR format
4. WHEN a valid QR code is scanned THEN the system SHALL fetch the fitting details from the database
5. IF the QR code does not exist in the database THEN the system SHALL display error "Fitting not found"
6. WHEN fitting details are retrieved THEN the system SHALL display manufacturer, lot number, supply date, warranty status, current location, and inspection history
7. IF camera access is denied or unavailable THEN the system SHALL provide a manual QR code entry field as fallback
8. WHEN manual entry is used THEN the system SHALL validate the QR format before lookup

### Requirement 4: Inspection Logging

**User Story:** As an inspector, I want to log inspection results with GPS location and images so that I can document the condition of fittings during field inspections.

#### Acceptance Criteria

1. WHEN an inspector views a fitting detail page THEN the system SHALL display an "Add Inspection" button
2. WHEN the inspector clicks "Add Inspection" THEN the system SHALL display a form with fields for inspection type, status, notes, and image upload
3. WHEN the inspector selects inspection type THEN the system SHALL provide options: manufacturing, supply, in_service, maintenance
4. WHEN the inspector selects status THEN the system SHALL provide options: pass, fail, needs_attention
5. WHEN the inspection form loads THEN the system SHALL automatically capture GPS coordinates (latitude and longitude)
6. IF GPS is unavailable THEN the system SHALL allow manual location entry
7. WHEN the inspector uploads images THEN the system SHALL accept up to 5 images per inspection
8. WHEN the inspector submits the inspection THEN the system SHALL save the record to the inspections table with timestamp
9. WHEN an inspection is saved THEN the system SHALL update the fitting status based on inspection result
10. WHEN an inspection with status "fail" is logged THEN the system SHALL update fitting status to "failed"
11. WHEN an inspection is saved THEN the system SHALL trigger AI analysis for alert generation

### Requirement 5: AI-Powered Alert Generation

**User Story:** As a system user, I want automated alerts for warranty expiry, vendor quality issues, and failure predictions so that I can take proactive maintenance actions.

#### Acceptance Criteria

1. WHEN a fitting is created or inspected THEN the system SHALL run AI alert rules
2. IF warranty expiry is less than 30 days THEN the system SHALL create a critical alert with message "Warranty expires in X days - Replace immediately"
3. IF warranty expiry is between 30-90 days THEN the system SHALL create a high severity alert
4. IF warranty expiry is between 90-180 days THEN the system SHALL create a medium severity alert
5. WHEN vendor failure rate exceeds 20% THEN the system SHALL create a critical vendor quality alert
6. WHEN vendor failure rate is between 15-20% THEN the system SHALL create a high severity vendor quality alert
7. WHEN a fitting has 2 or more "needs_attention" inspections within 6 months THEN the system SHALL create a high risk failure prediction alert
8. WHEN a lot has 3 or more failed inspections THEN the system SHALL create a critical failure prediction alert
9. WHEN the same fitting is inspected twice within 24 hours THEN the system SHALL create a warning for duplicate inspection
10. WHEN an alert is created THEN the system SHALL store it in the alerts table with severity, message, and timestamp
11. WHEN alerts exist THEN the system SHALL display unresolved alerts on the dashboard with badge count

### Requirement 6: Dashboard and Analytics

**User Story:** As a depot manager or admin, I want a comprehensive dashboard with metrics and charts so that I can monitor overall system health and make data-driven decisions.

#### Acceptance Criteria

1. WHEN a user logs in THEN the system SHALL display the dashboard as the default landing page
2. WHEN the dashboard loads THEN the system SHALL display total fittings count grouped by part type
3. WHEN the dashboard loads THEN the system SHALL display total inspections count for the last 30 days
4. WHEN the dashboard loads THEN the system SHALL display count of unresolved critical alerts
5. WHEN the dashboard loads THEN the system SHALL display vendor performance metrics (top 5 best and worst)
6. WHEN the dashboard loads THEN the system SHALL display an inspection trends line chart showing inspections over time
7. WHEN the dashboard loads THEN the system SHALL display a failure rate bar chart grouped by part type
8. WHEN the dashboard loads THEN the system SHALL display a vendor comparison radar chart
9. WHEN the dashboard loads THEN the system SHALL display a warranty expiry timeline
10. WHEN a user clicks on a metric card THEN the system SHALL navigate to the detailed view for that category

### Requirement 7: Vendor Management and Quality Scoring

**User Story:** As an admin, I want to view vendor performance metrics and quality scores so that I can assess vendor reliability and make procurement decisions.

#### Acceptance Criteria

1. WHEN an admin navigates to the vendors page THEN the system SHALL display a list of all vendors with their quality scores
2. WHEN vendor data is displayed THEN the system SHALL show vendor code, name, total supplies, total inspections, failed inspections, failure rate, and quality score
3. WHEN calculating quality score THEN the system SHALL use formula: 100 - (failure_rate × 2) - (late_deliveries × 0.5)
4. IF quality score is greater than 90 THEN the system SHALL display status "Excellent" with green indicator
5. IF quality score is between 75-90 THEN the system SHALL display status "Good" with blue indicator
6. IF quality score is between 60-75 THEN the system SHALL display status "Average" with yellow indicator
7. IF quality score is less than 60 THEN the system SHALL display status "Poor" with red indicator and flag for review
8. WHEN a vendor is clicked THEN the system SHALL display detailed vendor analytics including inspection history and failure trends
9. WHEN vendor data is updated THEN the system SHALL recalculate quality scores automatically

### Requirement 8: Mock UDM/TMS Integration

**User Story:** As a system administrator, I want mock integration with UDM/TMS systems so that I can demonstrate the system's integration capabilities for future real-world deployment.

#### Acceptance Criteria

1. WHEN a fitting is created THEN the system SHALL trigger a mock UDM sync operation
2. WHEN a mock UDM sync is triggered THEN the system SHALL simulate fetching vendor data from www.ireps.gov.in
3. WHEN mock UDM data is received THEN the system SHALL update the vendors table with vendor_code, vendor_name, total_orders, pending_deliveries, and quality_rating
4. WHEN an inspection is logged THEN the system SHALL trigger a mock TMS sync operation
5. WHEN a mock TMS sync is triggered THEN the system SHALL simulate fetching track section data from www.irecept.gov.in
6. WHEN mock TMS data is received THEN the system SHALL store track_section, total_fittings, last_inspection, and critical_issues
7. WHEN a sync operation completes THEN the system SHALL log the sync in sync_logs table with sync_type, status, records_synced, and timestamp
8. WHEN a sync operation fails THEN the system SHALL log the error message in sync_logs
9. WHEN the dashboard loads THEN the system SHALL display "Last synced: X mins ago" for UDM and TMS
10. WHEN an admin views sync logs THEN the system SHALL display a history of all sync operations with status indicators

### Requirement 9: Fitting Inventory Management

**User Story:** As a depot manager, I want to view, search, and filter the complete fitting inventory so that I can manage track components efficiently.

#### Acceptance Criteria

1. WHEN a depot manager navigates to the fittings page THEN the system SHALL display a table of all fittings
2. WHEN the fittings table loads THEN the system SHALL display columns for QR code, part type, manufacturer, lot number, supply date, warranty status, current location, and status
3. WHEN a user enters text in the search field THEN the system SHALL filter fittings by QR code, manufacturer, or lot number
4. WHEN a user selects a part type filter THEN the system SHALL display only fittings of that type
5. WHEN a user selects a manufacturer filter THEN the system SHALL display only fittings from that manufacturer
6. WHEN a user selects a status filter THEN the system SHALL display only fittings with that status
7. WHEN a user selects a warranty status filter THEN the system SHALL display fittings grouped by warranty expiry ranges
8. WHEN a user clicks on a fitting row THEN the system SHALL navigate to the fitting detail page
9. WHEN a user clicks "Export to CSV" THEN the system SHALL download the filtered fitting data as a CSV file
10. WHEN the fittings table loads THEN the system SHALL implement pagination with 50 fittings per page

### Requirement 10: Inspection History and Timeline

**User Story:** As an inspector or depot manager, I want to view the complete inspection history for a fitting so that I can track its condition over time.

#### Acceptance Criteria

1. WHEN a user views a fitting detail page THEN the system SHALL display an inspection history section
2. WHEN inspection history loads THEN the system SHALL display inspections in reverse chronological order (newest first)
3. WHEN displaying each inspection THEN the system SHALL show inspection type, status, inspector name, timestamp, notes, GPS location, and images
4. WHEN inspection images exist THEN the system SHALL display thumbnails that expand on click
5. WHEN a user clicks on GPS coordinates THEN the system SHALL open the location in a map view
6. WHEN a user filters by inspection status THEN the system SHALL display only inspections matching that status
7. WHEN a user filters by date range THEN the system SHALL display only inspections within that range
8. WHEN a user filters by inspector THEN the system SHALL display only inspections logged by that inspector
9. WHEN no inspections exist for a fitting THEN the system SHALL display message "No inspections logged yet"
10. WHEN inspection history loads THEN the system SHALL display a visual timeline showing inspection frequency
