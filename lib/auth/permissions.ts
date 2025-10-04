import type { UserRole } from '@/types';

// Define route permissions
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': ['depot_manager', 'inspector', 'admin'],
  '/fittings': ['depot_manager', 'inspector', 'admin'],
  '/fittings/add': ['depot_manager', 'admin'],
  '/inspections': ['depot_manager', 'inspector', 'admin'],
  '/scan': ['inspector', 'depot_manager', 'admin'],
  '/alerts': ['depot_manager', 'admin'],
  '/vendors': ['admin'],
};

export function hasPermission(userRole: UserRole, path: string): boolean {
  // Find the most specific matching route
  const matchingRoute = Object.keys(ROUTE_PERMISSIONS)
    .filter(route => path.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchingRoute) {
    // If no specific permission is defined, allow all authenticated users
    return true;
  }

  const allowedRoles = ROUTE_PERMISSIONS[matchingRoute];
  return allowedRoles.includes(userRole);
}

export function getRedirectPath(userRole: UserRole): string {
  // Default redirect based on role
  switch (userRole) {
    case 'admin':
      return '/dashboard';
    case 'depot_manager':
      return '/dashboard';
    case 'inspector':
      return '/scan';
    default:
      return '/dashboard';
  }
}
