/**
 * Depot Manager Dashboard Component
 * Displays depot-specific statistics and quick actions for depot managers
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, QrCode, AlertCircle, CheckCircle, Clock, Plus, Bell } from 'lucide-react';
import Link from 'next/link';

interface DepotStats {
  totalFittings: number;
  activeFittings: number;
  underInspection: number;
  failedFittings: number;
  totalInspections: number;
  activeAlerts: number;
  warrantyExpiringSoon: number;
  depotLocation: string;
  recentActivity: Array<{
    id: string;
    type: 'fitting' | 'inspection' | 'alert';
    description: string;
    timestamp: string;
  }>;
}

interface DepotManagerDashboardProps {
  stats: DepotStats;
  managerName: string;
}

export function DepotManagerDashboard({ stats, managerName }: DepotManagerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {managerName}</h1>
        <p className="text-gray-600 mt-1">Managing {stats.depotLocation} depot</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <Link href="/fittings/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Fitting
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <Link href="/scan">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <Link href="/alerts">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Bell className="h-4 w-4 mr-2" />
                View Alerts
                {stats.activeAlerts > 0 && (
                  <span className="ml-2 bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {stats.activeAlerts}
                  </span>
                )}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Fittings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fittings</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFittings}</div>
            <p className="text-xs text-gray-500 mt-1">In your depot</p>
          </CardContent>
        </Card>

        {/* Active Fittings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeFittings}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalFittings > 0 
                ? `${((stats.activeFittings / stats.totalFittings) * 100).toFixed(0)}% of total`
                : 'No fittings'}
            </p>
          </CardContent>
        </Card>

        {/* Under Inspection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Inspection</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.underInspection}</div>
            <p className="text-xs text-gray-500 mt-1">Pending review</p>
          </CardContent>
        </Card>

        {/* Failed Fittings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedFittings}</div>
            <p className="text-xs text-gray-500 mt-1">Requires action</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Inspections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspections}</div>
            <Link href="/inspections">
              <Button variant="link" size="sm" className="px-0 mt-1">
                View all inspections →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.activeAlerts}</div>
            <Link href="/alerts">
              <Button variant="link" size="sm" className="px-0 mt-1">
                View all alerts →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Warranty Expiring */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warranty Expiring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.warrantyExpiringSoon}</div>
            <p className="text-xs text-gray-500 mt-1">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    {activity.type === 'fitting' && (
                      <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    {activity.type === 'inspection' && (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    )}
                    {activity.type === 'alert' && (
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
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
