/**
 * Role-based permission system for RailTrack QR application
 * Defines user roles, route permissions, and helper functions for authorization
 */

export type UserRole = 'inspector' | 'depot_manager' | 'admin';

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
  requiresDepotLocation?: boolean;
}

/**
 * Route permission matrix defining which roles can access which routes
 */
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  { 
    path: '/dashboard', 
    allowedRoles: ['inspector', 'depot_manager', 'admin'] 
  },
  { 
    path: '/scan', 
    allowedRoles: ['inspector', 'depot_manager', 'admin'] 
  },
  { 
    path: '/inspections', 
    allowedRoles: ['inspector', 'depot_manager', 'admin'] 
  },
  { 
    path: '/fittings', 
    allowedRoles: ['depot_manager', 'admin'] 
  },
  { 
    path: '/alerts', 
    allowedRoles: ['depot_manager', 'admin'] 
  },
  { 
    path: '/vendors', 
    allowedRoles: ['admin'] 
  },
  { 
    path: '/users', 
    allowedRoles: ['admin'] 
  },
  { 
    path: '/settings', 
    allowedRoles: ['admin'] 
  },
];

/**
 * Navigation item configuration
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  roles: UserRole[];
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    roles: ['inspector', 'depot_manager', 'admin'],
  },
  {
    name: 'Scan QR',
    href: '/scan',
    roles: ['inspector', 'depot_manager', 'admin'],
  },
  {
    name: 'My Inspections',
    href: '/inspections',
    roles: ['inspector'],
  },
  {
    name: 'Fittings',
    href: '/fittings',
    roles: ['depot_manager', 'admin'],
  },
  {
    name: 'Inspections',
    href: '/inspections',
    roles: ['depot_manager', 'admin'],
  },
  {
    name: 'Alerts',
    href: '/alerts',
    roles: ['depot_manager', 'admin'],
  },
  {
    name: 'Vendors',
    href: '/vendors',
    roles: ['admin'],
  },
  {
    name: 'Users',
    href: '/users',
    roles: ['admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    roles: ['admin'],
  },
];

/**
 * Check if a user role can access a specific route
 * @param userRole - The role of the user
 * @param path - The route path to check
 * @returns true if the user can access the route, false otherwise
 */
export function canAccessRoute(userRole: UserRole, path: string): boolean {
  const permission = ROUTE_PERMISSIONS.find(p => path.startsWith(p.path));
  return permission ? permission.allowedRoles.includes(userRole) : false;
}

/**
 * Get navigation items filtered by user role
 * @param userRole - The role of the user
 * @returns Array of navigation items the user can access
 */
export function getNavigationItems(userRole: UserRole): NavigationItem[] {
  return NAVIGATION_CONFIG.filter(item => item.roles.includes(userRole));
}

/**
 * Check if a role requires depot location
 * @param userRole - The role to check
 * @returns true if the role requires depot location
 */
export function requiresDepotLocation(userRole: UserRole): boolean {
  return userRole === 'depot_manager';
}

/**
 * Check if a role can perform CRUD operations on fittings
 * @param userRole - The role to check
 * @returns true if the role can manage fittings
 */
export function canManageFittings(userRole: UserRole): boolean {
  return userRole === 'depot_manager' || userRole === 'admin';
}

/**
 * Check if a role can create inspections
 * @param userRole - The role to check
 * @returns true if the role can create inspections
 */
export function canCreateInspections(userRole: UserRole): boolean {
  return ['inspector', 'depot_manager', 'admin'].includes(userRole);
}

/**
 * Check if a role can access vendor data
 * @param userRole - The role to check
 * @returns true if the role can access vendors
 */
export function canAccessVendors(userRole: UserRole): boolean {
  return userRole === 'admin';
}

/**
 * Check if a role can manage users
 * @param userRole - The role to check
 * @returns true if the role can manage users
 */
export function canManageUsers(userRole: UserRole): boolean {
  return userRole === 'admin';
}

/**
 * Check if a role can access system settings
 * @param userRole - The role to check
 * @returns true if the role can access settings
 */
export function canAccessSettings(userRole: UserRole): boolean {
  return userRole === 'admin';
}

/**
 * Check if a role can view alerts
 * @param userRole - The role to check
 * @returns true if the role can view alerts
 */
export function canViewAlerts(userRole: UserRole): boolean {
  return userRole === 'depot_manager' || userRole === 'admin';
}

/**
 * Get the dashboard route for a specific role
 * @param userRole - The role of the user
 * @returns The dashboard route path
 */
export function getDashboardRoute(userRole: UserRole): string {
  return '/dashboard';
}

/**
 * Check if data should be filtered by depot location
 * @param userRole - The role to check
 * @returns true if data should be filtered by depot
 */
export function shouldFilterByDepot(userRole: UserRole): boolean {
  return userRole === 'depot_manager';
}

/**
 * Check if data should be filtered by inspector
 * @param userRole - The role to check
 * @returns true if data should be filtered by inspector
 */
export function shouldFilterByInspector(userRole: UserRole): boolean {
  return userRole === 'inspector';
}
