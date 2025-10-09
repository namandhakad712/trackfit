/**
 * Admin Dashboard Component
 * Displays system-wide statistics and quick actions for administrators
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  Building2, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Settings,
  UserPlus,
  QrCode
} from 'lucide-react';
import Link from 'next/link';

interface VendorPerformance {
  vendorName: string;
  qualityScore: number;
  failureRate: number;
}

interface DepotComparison {
  depotName: string;
  totalFittings: number;
  activeAlerts: number;
}

interface AdminStats {
  totalFittings: number;
  totalInspections: number;
  totalUsers: number;
  totalDepots: number;
  activeAlerts: number;
  systemHealth: number;
  topVendors: VendorPerformance[];
  depotComparison: DepotComparison[];
  recentUserActivity: Array<{
    id: string;
    userName: string;
    action: string;
    timestamp: string;
  }>;
}

interface AdminDashboardProps {
  stats: AdminStats;
  adminName: string;
}

export function AdminDashboard({ stats, adminName }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {adminName}</h1>
        <p className="text-gray-600 mt-1">System-wide overview and management</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <Link href="/users/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <Link href="/fittings/new">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Package className="h-4 w-4 mr-2" />
                Add Fitting
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <Link href="/scan">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <Link href="/settings">
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System-Wide Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Fittings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fittings</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFittings}</div>
            <Link href="/fittings">
              <Button variant="link" size="sm" className="px-0 mt-1">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Total Inspections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspections}</div>
            <Link href="/inspections">
              <Button variant="link" size="sm" className="px-0 mt-1">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <Link href="/users">
              <Button variant="link" size="sm" className="px-0 mt-1">
                Manage users →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.activeAlerts}</div>
            <Link href="/alerts">
              <Button variant="link" size="sm" className="px-0 mt-1">
                View alerts →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Performance & Depot Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Vendor Performance</CardTitle>
              <Link href="/vendors">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.topVendors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No vendor data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topVendors.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{vendor.vendorName}</p>
                        <p className="text-xs text-gray-500">
                          Failure rate: {vendor.failureRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-bold text-green-600">
                        {vendor.qualityScore.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Depot Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Depot Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.depotComparison.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No depot data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.depotComparison.map((depot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{depot.depotName}</p>
                        <p className="text-xs text-gray-500">
                          {depot.totalFittings} fittings
                        </p>
                      </div>
                    </div>
                    {depot.activeAlerts > 0 && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                        {depot.activeAlerts} alerts
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent User Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentUserActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentUserActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.userName}</span>
                        {' '}{activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
