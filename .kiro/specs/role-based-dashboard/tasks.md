
# Implementation Plan

- [x] 1. Create permission system utilities




  - Create `lib/permissions/roles.ts` with role types, route permissions matrix, and helper functions
  - Create `lib/permissions/api.ts` with API permission validation utilities
  - _Requirements: 4.1, 4.2, 8.1, 8.2_

- [x] 2. Create user profile API endpoint



  - Implement `app/api/user/profile/route.ts` to fetch authenticated user's profile with role and depot_location
  - Add error handling for unauthenticated requests
  - _Requirements: 4.6, 7.1_


- [x] 3. Update middleware with role-based route protection


  - Modify `middleware.ts` to fetch user role from database
  - Add route permission validation using permission utilities
  - Redirect unauthorized users to `/unauthorized` page
  - Add audit logging for unauthorized access attempts
  - _Requirements: 4.1, 4.2, 4.3, 4.7, 11.7_

- [x] 4. Create unauthorized access page



  - Implement `app/unauthorized/page.tsx` with clear messaging
  - Display user's current role and available actions
  - Add "Go to Dashboard" and "Contact Admin" buttons
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 5. Create role-specific dashboard components




- [x] 5.1 Create InspectorDashboard component

  - Implement `components/dashboard/InspectorDashboard.tsx`
  - Add widgets for inspection statistics (total, pass/fail rate, recent inspections)
  - Add quick action button for Scan QR
  - _Requirements: 1.1, 6.1_

- [x] 5.2 Create DepotManagerDashboard component


  - Implement `components/dashboard/DepotManagerDashboard.tsx`
  - Add widgets for fittings (total, by status), inspections, alerts, warranty expiring
  - Add quick action buttons for Add Fitting, Scan QR, View Alerts
  - _Requirements: 2.1, 6.2_

- [x] 5.3 Create AdminDashboard component


  - Implement `components/dashboard/AdminDashboard.tsx`
  - Add widgets for system-wide stats, vendor performance, user activity, depot comparison
  - Add quick action buttons for all features
  - _Requirements: 3.1, 6.3_

- [x] 6. Update main dashboard page with role routing



  - Modify `app/(dashboard)/dashboard/page.tsx` to fetch user role
  - Implement conditional rendering based on role (Inspector, Depot Manager, Admin)
  - Add loading state and error handling
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 7. Update dashboard metrics API with role-based filtering



  - Modify `app/api/dashboard/metrics/route.ts` to fetch user role
  - Apply depot-based filtering for depot managers
  - Apply inspector-based filtering for inspectors
  - Return system-wide data for admins
  - _Requirements: 7.1, 7.2, 7.3, 7.5, 6.4_

- [x] 8. Update Sidebar navigation with role-based filtering



  - Modify `components/dashboard/Sidebar.tsx` navigation config
  - Add "My Inspections" for inspectors
  - Add "Users" and "Settings" menu items for admins
  - Filter navigation items based on user role
  - _Requirements: 5.3, 5.4, 5.5, 5.8_

- [x] 9. Update fittings API with permission checks



  - Modify `app/api/fittings/route.ts` to validate user role
  - Allow GET for depot_manager (depot-filtered) and admin (all)
  - Allow POST/PUT/DELETE for depot_manager and admin only
  - Apply depot-based filtering for depot managers
  - Return 403 for unauthorized access
  - _Requirements: 8.3, 8.4, 8.8, 7.1_

- [x] 10. Update inspections API with permission checks



  - Modify `app/api/inspections/route.ts` to validate user role
  - Allow GET for all roles with appropriate filtering
  - Filter by inspector_id for inspectors
  - Filter by depot for depot managers
  - Allow POST for all roles
  - _Requirements: 8.5, 7.2, 7.4_

- [x] 11. Update alerts API with permission checks



  - Modify `app/api/alerts/route.ts` to validate user role
  - Allow GET for depot_manager (depot-filtered) and admin (all)
  - Apply depot-based filtering for depot managers
  - Return 403 for inspectors
  - _Requirements: 7.3, 8.8_

- [x] 12. Update vendors API with admin-only access



  - Modify `app/api/vendors/route.ts` to validate admin role
  - Return 403 for non-admin users
  - _Requirements: 8.6, 3.5_

- [ ] 13. Create users management API
  - Implement `app/api/users/route.ts` with admin-only access
  - Add GET endpoint to list all users
  - Add POST endpoint to create new user
  - Add PUT endpoint to update user details and role
  - Add DELETE endpoint to deactivate user
  - _Requirements: 8.7, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 14. Create users management page
  - Implement `app/(dashboard)/users/page.tsx` with admin-only access
  - Create `components/users/UserTable.tsx` to display all users
  - Create `components/users/AddUserDialog.tsx` for creating new users
  - Create `components/users/EditUserDialog.tsx` for editing users
  - Add user deactivation functionality
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [ ] 15. Create settings management API
  - Implement `app/api/settings/route.ts` with admin-only access
  - Add GET endpoint to fetch all settings
  - Add PUT endpoint to update settings
  - Create database migration for settings table
  - _Requirements: 10.6, 10.7_

- [ ] 16. Create settings page
  - Implement `app/(dashboard)/settings/page.tsx` with admin-only access
  - Create tabs for General, Integrations, Notifications, Defaults
  - Create `components/settings/GeneralSettings.tsx`
  - Create `components/settings/IntegrationSettings.tsx`
  - Create `components/settings/NotificationSettings.tsx`
  - Create `components/settings/DefaultSettings.tsx`
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 17. Create audit logging system
  - Create database migration for audit_logs table
  - Implement `lib/audit/logger.ts` utility for logging events
  - Add audit logging to middleware for unauthorized access attempts
  - Add audit logging to user management operations
  - Add audit logging to settings changes
  - _Requirements: 4.7, 8.9_

- [ ] 18. Update inspections page with role-based access
  - Modify `app/(dashboard)/inspections/page.tsx` to show "My Inspections" for inspectors
  - Show depot-filtered inspections for depot managers
  - Show all inspections for admins
  - Update page title based on role
  - _Requirements: 1.7, 2.4_

- [ ] 19. Update fittings page with role-based access
  - Modify `app/(dashboard)/fittings/page.tsx` to block inspector access
  - Show depot-filtered fittings for depot managers
  - Show all fittings for admins
  - _Requirements: 1.3, 2.3, 3.3_

- [ ] 20. Update alerts page with role-based access
  - Modify `app/(dashboard)/alerts/page.tsx` to block inspector access
  - Show depot-filtered alerts for depot managers
  - Show all alerts for admins
  - _Requirements: 1.4, 2.5, 3.8_

- [ ] 21. Add depot location auto-assignment for depot managers
  - Update fitting creation to auto-set current_location to depot manager's depot_location
  - Update fitting creation to auto-set created_by to current user ID
  - _Requirements: 7.6, 7.7_

- [ ] 22. Add session invalidation on role change
  - Update user edit API to invalidate user session when role changes
  - Force user to re-authenticate after role change
  - _Requirements: 9.5_

- [ ] 23. Add comprehensive error handling
  - Ensure all API endpoints return proper error responses with status codes
  - Add error boundaries to dashboard components
  - Handle role fetch failures gracefully
  - _Requirements: 8.8, 4.6_

- [ ] 24. Add database indexes for performance
  - Create index on users.role
  - Create index on fittings.current_location
  - Create index on inspections.inspector_id
  - _Requirements: Performance optimization_

- [ ] 25. Add integration tests for role-based access
  - Test middleware protection for all routes and roles
  - Test API endpoint protection for all endpoints and roles
  - Test data filtering in API responses
  - Test dashboard rendering for each role
  - _Requirements: Testing strategy_
