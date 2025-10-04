'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ClipboardCheck, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardMetrics {
  fittings: {
    total: number;
    elastic_rail_clip: number;
    rail_pad: number;
    liner: number;
    sleeper: number;
  };
  inspections: {
    total: number;
    pass: number;
    fail: number;
    needs_attention: number;
  };
  critical_alerts: number;
  vendors: {
    top: Array<{ vendor_name: string; quality_score: number; }>;
    worst: Array<{ vendor_name: string; quality_score: number; }>;
  };
  warranty: {
    expiring_soon: number;
    critical: number;
  };
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard/metrics');
      const data = await response.json();
      if (response.ok) {
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
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

  const avgVendorScore = metrics?.vendors.top.length 
    ? (metrics.vendors.top.reduce((sum, v) => sum + v.quality_score, 0) / metrics.vendors.top.length).toFixed(1)
    : '-';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">RailTrack QR Dashboard</h1>
        <p className="text-muted-foreground">
          AI-Powered Fitting Management System
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/fittings">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Fittings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.fittings.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across all part types
              </p>
              <div className="mt-2 flex gap-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  Clips: {metrics?.fittings.elastic_rail_clip || 0}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Pads: {metrics?.fittings.rail_pad || 0}
                </Badge>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/inspections">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Inspections (30d)
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.inspections.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
              <div className="mt-2 flex gap-1 flex-wrap">
                <Badge variant="outline" className="text-xs text-green-600">
                  Pass: {metrics?.inspections.pass || 0}
                </Badge>
                <Badge variant="outline" className="text-xs text-red-600">
                  Fail: {metrics?.inspections.fail || 0}
                </Badge>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/alerts">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {metrics?.critical_alerts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Unresolved
              </p>
              {metrics && metrics.warranty.critical > 0 && (
                <div className="mt-2">
                  <Badge variant="destructive" className="text-xs">
                    {metrics.warranty.critical} warranties expiring
                  </Badge>
                </div>
              )}
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/vendors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Vendor Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgVendorScore}</div>
              <p className="text-xs text-muted-foreground">
                Average quality score
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {metrics?.vendors.top.length || 0} vendors tracked
                </Badge>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Vendor Performance Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.vendors.top.length ? (
              <div className="space-y-2">
                {metrics.vendors.top.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-200">
                    <span className="text-sm font-medium">{vendor.vendor_name}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      {vendor.quality_score.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No vendor data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendors Needing Review</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.vendors.worst.length ? (
              <div className="space-y-2">
                {metrics.vendors.worst.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-200">
                    <span className="text-sm font-medium">{vendor.vendor_name}</span>
                    <Badge variant="outline" className="bg-red-100 text-red-700">
                      {vendor.quality_score.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No vendor data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="justify-between">
              <Link href="/fittings/new">
                Add New Fitting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/scan">
                Scan QR Code
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/alerts">
                View Alerts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/vendors">
                Vendor Analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
