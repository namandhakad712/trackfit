/**
 * Inspector Dashboard Component
 * Displays inspection statistics and quick actions for inspectors
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

interface InspectionStats {
  totalInspections: number;
  passedInspections: number;
  failedInspections: number;
  needsAttention: number;
  passRate: number;
  recentInspections: Array<{
    id: string;
    fitting_qr: string;
    status: 'pass' | 'fail' | 'needs_attention';
    timestamp: string;
  }>;
}

interface InspectorDashboardProps {
  stats: InspectionStats;
  inspectorName: string;
}

export function InspectorDashboard({ stats, inspectorName }: InspectorDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {inspectorName}</h1>
        <p className="text-gray-600 mt-1">Here's your inspection overview</p>
      </div>

      {/* Quick Action */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to inspect?</h3>
              <p className="text-sm text-gray-600 mt-1">Scan a QR code to start a new inspection</p>
            </div>
            <Link href="/scan">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <QrCode className="h-5 w-5 mr-2" />
                Scan QR Code
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspections}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        {/* Passed Inspections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passedInspections}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.passRate.toFixed(1)}% pass rate
            </p>
          </CardContent>
        </Card>

        {/* Failed Inspections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedInspections}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.needsAttention}</div>
            <p className="text-xs text-gray-500 mt-1">Follow-up required</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inspections</CardTitle>
            <Link href="/inspections">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentInspections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No inspections yet</p>
              <p className="text-sm mt-1">Start by scanning a QR code</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentInspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {inspection.status === 'pass' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {inspection.status === 'fail' && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {inspection.status === 'needs_attention' && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">QR: {inspection.fitting_qr}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(inspection.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      inspection.status === 'pass'
                        ? 'bg-green-100 text-green-700'
                        : inspection.status === 'fail'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {inspection.status === 'pass'
                      ? 'Passed'
                      : inspection.status === 'fail'
                      ? 'Failed'
                      : 'Needs Attention'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
