'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';

interface Vendor {
  id: string;
  vendor_code: string;
  vendor_name: string;
  total_inspections: number;
  failed_inspections: number;
  failure_rate: number;
  quality_score: number;
  quality_status: string;
  quality_color: string;
}

type SortField = 'vendor_name' | 'quality_score' | 'failure_rate' | 'total_inspections';
type SortDirection = 'asc' | 'desc';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('quality_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/vendors');
      const data = await response.json();

      if (response.ok) {
        setVendors(data.vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedVendors = [...vendors].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const excellentVendors = vendors.filter(v => v.quality_status === 'Excellent').length;
  const goodVendors = vendors.filter(v => v.quality_status === 'Good').length;
  const averageVendors = vendors.filter(v => v.quality_status === 'Average').length;
  const poorVendors = vendors.filter(v => v.quality_status === 'Poor').length;

  const avgQualityScore = vendors.length > 0
    ? vendors.reduce((sum, v) => sum + v.quality_score, 0) / vendors.length
    : 0;

  const avgFailureRate = vendors.length > 0
    ? vendors.reduce((sum, v) => sum + v.failure_rate, 0) / vendors.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Management</h1>
        <p className="text-muted-foreground">
          Monitor vendor performance and quality metrics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">
              {excellentVendors} excellent, {goodVendors} good
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgQualityScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 100
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Failure Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFailureRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Poor Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{poorVendors}</div>
            <p className="text-xs text-muted-foreground">
              {averageVendors} average performers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance</CardTitle>
          <CardDescription>
            Click on a vendor to view detailed metrics and inspection history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No vendors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => handleSort('vendor_name')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        Vendor
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('quality_score')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        Quality Score
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('failure_rate')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        Failure Rate
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('total_inspections')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        Inspections
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedVendors.map((vendor) => (
                    <TableRow key={vendor.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link 
                          href={`/vendors/${vendor.id}`}
                          className="font-medium hover:underline"
                        >
                          {vendor.vendor_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {vendor.vendor_code}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {vendor.quality_score.toFixed(1)}
                          </span>
                          {vendor.quality_score >= 90 && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                          {vendor.quality_score < 60 && (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          {vendor.quality_score >= 60 && vendor.quality_score < 90 && (
                            <Minus className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={vendor.failure_rate >= 20 ? 'text-red-600 font-semibold' : ''}>
                          {vendor.failure_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {vendor.total_inspections}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={vendor.quality_color}
                        >
                          {vendor.quality_status}
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
