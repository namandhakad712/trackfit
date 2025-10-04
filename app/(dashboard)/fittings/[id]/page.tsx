'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRCodeDisplay } from '@/components/fittings/QRCodeDisplay';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

export default function FittingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [fitting, setFitting] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFittingDetails();
  }, [params.id]);

  const fetchFittingDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/fittings/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch fitting details');
      }

      setFitting(data.fitting);
      setInspections(data.inspections);
      setAlerts(data.alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const daysUntilExpiry = differenceInDays(new Date(warrantyExpiry), new Date());
    
    if (daysUntilExpiry < 0) {
      return { label: 'Expired', variant: 'destructive' as const, days: daysUntilExpiry };
    } else if (daysUntilExpiry < 30) {
      return { label: 'Expiring Soon', variant: 'destructive' as const, days: daysUntilExpiry };
    } else if (daysUntilExpiry < 90) {
      return { label: 'Valid', variant: 'default' as const, days: daysUntilExpiry };
    } else {
      return { label: 'Valid', variant: 'secondary' as const, days: daysUntilExpiry };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !fitting) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Fitting not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const warrantyStatus = getWarrantyStatus(fitting.warranty_expiry);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fittings
        </Button>
        <Button asChild>
          <Link href={`/inspections/add?fitting_id=${fitting.id}`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Inspection
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fitting Information</CardTitle>
              <CardDescription>QR Code: {fitting.qr_code}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Part Type</p>
                <p className="font-medium capitalize">
                  {fitting.part_type.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p className="font-medium">{fitting.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lot Number</p>
                <p className="font-medium">{fitting.lot_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{fitting.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supply Date</p>
                <p className="font-medium">
                  {format(new Date(fitting.supply_date), 'PPP')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warranty Expiry</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {format(new Date(fitting.warranty_expiry), 'PPP')}
                  </p>
                  <Badge variant={warrantyStatus.variant}>
                    {warrantyStatus.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {warrantyStatus.days > 0 
                    ? `${warrantyStatus.days} days remaining`
                    : `Expired ${Math.abs(warrantyStatus.days)} days ago`
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Location</p>
                <p className="font-medium">{fitting.current_location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className="capitalize">
                  {fitting.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {alerts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-orange-900">Active Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2">
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                      {alert.severity}
                    </Badge>
                    <p className="text-sm text-orange-900">{alert.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Inspection History</CardTitle>
              <CardDescription>
                {inspections.length} inspection{inspections.length !== 1 ? 's' : ''} recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inspections.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No inspections logged yet
                </p>
              ) : (
                <div className="space-y-4">
                  {inspections.map((inspection) => (
                    <div key={inspection.id} className="border-l-2 border-primary pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={
                          inspection.status === 'pass' ? 'secondary' :
                          inspection.status === 'fail' ? 'destructive' : 'default'
                        }>
                          {inspection.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(inspection.timestamp), 'PPP')}
                        </p>
                      </div>
                      <p className="text-sm font-medium capitalize">
                        {inspection.inspection_type.replace('_', ' ')} Inspection
                      </p>
                      {inspection.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {inspection.notes}
                        </p>
                      )}
                      {inspection.inspector && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Inspector: {inspection.inspector.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <QRCodeDisplay
            qrCode={fitting.qr_code}
            title="Fitting QR Code"
            description="Scan to view details"
          />
        </div>
      </div>
    </div>
  );
}
