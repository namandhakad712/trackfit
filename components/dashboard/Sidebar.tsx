'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ScanLine,
  AlertTriangle,
  Users,
  Menu,
  X,
  LogOut,
  Shield,
  Warehouse,
  ClipboardCheck,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['depot_manager', 'inspector', 'admin'],
  },
  {
    name: 'Scan QR',
    href: '/scan',
    icon: ScanLine,
    roles: ['inspector', 'depot_manager', 'admin'],
  },
  {
    name: 'My Inspections',
    href: '/inspections',
    icon: ClipboardCheck,
    roles: ['inspector'],
  },
  {
    name: 'Fittings',
    href: '/fittings',
    icon: Package,
    roles: ['depot_manager', 'admin'],
  },
  {
    name: 'Inspections',
    href: '/inspections',
    icon: ClipboardList,
    roles: ['depot_manager', 'admin'],
  },
  {
    name: 'Alerts',
    href: '/alerts',
    icon: AlertTriangle,
    roles: ['depot_manager', 'admin'],
  },
  {
    name: 'Vendors',
    href: '/vendors',
    icon: Warehouse,
    roles: ['admin'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin'],
  },
];

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const filteredNavigation = navigation.filter((item) =>
    userRole ? item.roles.includes(userRole) : true
  );

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin':
        return Shield;
      case 'depot_manager':
        return Warehouse;
      case 'inspector':
        return ClipboardCheck;
      default:
        return Shield;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin';
      case 'depot_manager':
        return 'Depot Manager';
      case 'inspector':
        return 'Inspector';
      default:
        return 'User';
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b">
            <h1 className="text-xl font-bold text-primary">RailTrack QR</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Role & Logout */}
          <div className="p-4 border-t space-y-3">
            {(userRole || userName) && (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-accent/50 rounded-md">
                  <RoleIcon className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    {userName ? (
                      <p className="text-sm font-medium truncate">{userName}</p>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">User</p>
                    )}
                    <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Indian Railways © 2025
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
