'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download } from 'lucide-react';
import Link from 'next/link';
import { PART_TYPES, FITTING_STATUSES } from '@/lib/constants';
import { format, differenceInDays } from 'date-fns';

interface Fitting {
  id: string;
  qr_code: string;
  part_type: string;
  manufacturer: string;
  lot_number: string;
  supply_date: string;
  warranty_expiry: string;
  quantity: number;
  current_location: string;
  status: string;
  created_at: string;
}

export default function FittingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fittings, setFittings] = useState<Fitting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [partTypeFilter, setPartTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchFittings();
  }, [page, partTypeFilter, statusFilter]);

  const fetchFittings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (search) params.append('search', search);
      if (partTypeFilter) params.append('part_type', partTypeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/fittings?${params}`);
      const data = await response.json();

      if (response.ok) {
        setFittings(data.fittings);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching fittings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchFittings();
  };

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const daysUntilExpiry = differenceInDays(new Date(warrantyExpiry), new Date());
    
    if (daysUntilExpiry < 0) {
      return { label: 'Expired', variant: 'destructive' as const };
    } else if (daysUntilExpiry < 30) {
      return { label: `${daysUntilExpiry}d left`, variant: 'destructive' as const };
    } else if (daysUntilExpiry < 90) {
      return { label: `${daysUntilExpiry}d left`, variant: 'default' as const };
    } else {
      return { label: 'Valid', variant: 'secondary' as const };
    }
  };

  const exportToCSV = () => {
    const headers = ['QR Code', 'Part Type', 'Manufacturer', 'Lot Number', 'Supply Date', 'Warranty Expiry', 'Quantity', 'Location', 'Status'];
    const rows = fittings.map(f => [
      f.qr_code,
      f.part_type,
      f.manufacturer,
      f.lot_number,
      f.supply_date,
      f.warranty_expiry,
      f.quantity,
      f.current_location,
      f.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fittings</h1>
          <p className="text-muted-foreground">
            Manage track fitting inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/fittings/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Fitting
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter fittings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by QR code, manufacturer, or lot..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select value={partTypeFilter} onValueChange={setPartTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All part types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All part types</SelectItem>
                {PART_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {FITTING_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fittings List</CardTitle>
              <CardDescription>
                {total} total fittings
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : fittings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No fittings found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>QR Code</TableHead>
                    <TableHead>Part Type</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Lot Number</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fittings.map((fitting) => {
                    const warrantyStatus = getWarrantyStatus(fitting.warranty_expiry);
                    return (
                      <TableRow
                        key={fitting.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/fittings/${fitting.id}`)}
                      >
                        <TableCell className="font-mono text-sm">
                          {fitting.qr_code}
                        </TableCell>
                        <TableCell className="capitalize">
                          {fitting.part_type.replace('_', ' ')}
                        </TableCell>
                        <TableCell>{fitting.manufacturer}</TableCell>
                        <TableCell>{fitting.lot_number}</TableCell>
                        <TableCell>
                          <Badge variant={warrantyStatus.variant}>
                            {warrantyStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {fitting.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {fitting.current_location}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(total / 50)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(total / 50)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
