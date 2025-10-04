'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, TrendingUp, TrendingDown, Package, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VendorDetails {
  vendor: {
    id: string;
    vendor_code: string;
    vendor_name: string;
    contact_email: string;
    contact_phone: string;
    quality_score: number;
    quality_status: string;
    quality_color: string;
  };
  metrics: {
    total_fittings: number;
    active_fittings: number;
    failed_fittings: number;
    total_inspections: number;
    passed_inspections: number;
    failed_inspections: number;
    needs_attention: number;
    failure_rate: number;
    pass_rate: number;
  };
  fittings: any[];
  recent_inspections: any[];
  monthly_trend: any[];
}

export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = params.id as string;
  
  const [details, setDetails] = useState<VendorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  const fetchVendorDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/vendors/${vendorId}`);
      const data = await response.json();

      if (response.ok) {
        setDetails(data);
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="space-y-6">
        <Link href="/vendors" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Vendors
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Vendor not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { vendor, metrics, fittings, recent_inspections, monthly_trend } = details;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/vendors" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Vendors
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{vendor.vendor_name}</h1>
            <p className="text-muted-foreground">Code: {vendor.vendor_code}</p>
          </div>
          <Badge 
            variant="outline"
            className={`${vendor.quality_color} text-lg px-4 py-2`}
          >
            {vendor.quality_status}
          </Badge>
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{vendor.contact_email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{vendor.contact_phone || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Fittings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_fittings}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.active_fittings} active, {metrics.failed_fittings} failed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {vendor.quality_score.toFixed(1)}
              {vendor.quality_score >= 90 && <TrendingUp className="h-5 w-5 text-green-600" />}
              {vendor.quality_score < 60 && <TrendingDown className="h-5 w-5 text-red-600" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 100
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.pass_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.passed_inspections} passed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.failure_rate >= 20 ? 'text-red-600' : ''}`}>
              {metrics.failure_rate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.failed_inspections} failed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inspection Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold">{metrics.passed_inspections}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{metrics.failed_inspections}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-2xl font-bold">{metrics.needs_attention}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failure Trend Chart */}
      {monthly_trend && monthly_trend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>6-Month Inspection Trend</CardTitle>
            <CardDescription>
              Inspection results over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pass" stroke="#22c55e" name="Pass" strokeWidth={2} />
                <Line type="monotone" dataKey="fail" stroke="#ef4444" name="Fail" strokeWidth={2} />
                <Line type="monotone" dataKey="needs_attention" stroke="#eab308" name="Needs Attention" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Fittings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fittings</CardTitle>
          <CardDescription>
            Latest fittings supplied by this vendor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fittings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No fittings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>QR Code</TableHead>
                    <TableHead>Part Type</TableHead>
                    <TableHead>Supply Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fittings.slice(0, 10).map((fitting) => (
                    <TableRow key={fitting.id}>
                      <TableCell>
                        <Link 
                          href={`/fittings/${fitting.id}`}
                          className="font-medium hover:underline"
                        >
                          {fitting.qr_code}
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize">
                        {fitting.part_type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(fitting.supply_date), 'PP')}
                      </TableCell>
                      <TableCell>{fitting.current_location}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={fitting.status === 'active' ? 'default' : 'destructive'}
                        >
                          {fitting.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
          <CardDescription>
            Latest inspection results for vendor's fittings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent_inspections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No inspections found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent_inspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell>
                        {format(new Date(inspection.timestamp), 'PPp')}
                      </TableCell>
                      <TableCell className="capitalize">
                        {inspection.inspection_type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            inspection.status === 'pass' 
                              ? 'default' 
                              : inspection.status === 'fail' 
                              ? 'destructive' 
                              : 'secondary'
                          }
                        >
                          {inspection.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
