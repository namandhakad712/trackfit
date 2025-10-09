'use client';

import { useEffect, useState } from 'react';
import { InspectorDashboard } from '@/components/dashboard/InspectorDashboard';
import { DepotManagerDashboard } from '@/components/dashboard/DepotManagerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { UserRole } from '@/lib/permissions/roles';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  depot_location: string | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndMetrics();
  }, []);

  const fetchUserAndMetrics = async () => {
    try {
      // Fetch user profile
      const userResponse = await fetch('/api/user/profile');
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const userData = await userResponse.json();
      setUser(userData.user);

      // Fetch dashboard metrics
      const metricsResponse = await fetch('/api/dashboard/metrics');
      if (!metricsResponse.ok) {
        throw new Error('Failed to fetch dashboard metrics');
      }
      const metricsData = await metricsResponse.json();
      setDashboardData(metricsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading dashboard</p>
          <p className="text-gray-600 mt-2">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  if (user.role === 'inspector') {
    return (
      <InspectorDashboard
        stats={{
          totalInspections: dashboardData?.inspections?.total || 0,
          passedInspections: dashboardData?.inspections?.pass || 0,
          failedInspections: dashboardData?.inspections?.fail || 0,
          needsAttention: dashboardData?.inspections?.needs_attention || 0,
          passRate: dashboardData?.inspections?.total > 0
            ? (dashboardData.inspections.pass / dashboardData.inspections.total) * 100
            : 0,
          recentInspections: dashboardData?.recentInspections || [],
        }}
        inspectorName={user.name}
      />
    );
  }

  if (user.role === 'depot_manager') {
    return (
      <DepotManagerDashboard
        stats={{
          totalFittings: dashboardData?.fittings?.total || 0,
          activeFittings: dashboardData?.fittings?.active || 0,
          underInspection: dashboardData?.fittings?.under_inspection || 0,
          failedFittings: dashboardData?.fittings?.failed || 0,
          totalInspections: dashboardData?.inspections?.total || 0,
          activeAlerts: dashboardData?.alerts?.active || 0,
          warrantyExpiringSoon: dashboardData?.warranty?.expiring_soon || 0,
          depotLocation: user.depot_location || 'Unknown',
          recentActivity: dashboardData?.recentActivity || [],
        }}
        managerName={user.name}
      />
    );
  }

  if (user.role === 'admin') {
    return (
      <AdminDashboard
        stats={{
          totalFittings: dashboardData?.fittings?.total || 0,
          totalInspections: dashboardData?.inspections?.total || 0,
          totalUsers: dashboardData?.users?.total || 0,
          totalDepots: dashboardData?.depots?.total || 0,
          activeAlerts: dashboardData?.alerts?.active || 0,
          systemHealth: dashboardData?.systemHealth || 100,
          topVendors: dashboardData?.vendors?.top || [],
          depotComparison: dashboardData?.depots?.comparison || [],
          recentUserActivity: dashboardData?.recentUserActivity || [],
        }}
        adminName={user.name}
      />
    );
  }

  // Fallback for unknown roles
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-gray-600">Unknown user role</p>
      </div>
    </div>
  );
}
