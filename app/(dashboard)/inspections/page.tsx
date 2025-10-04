'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MapPin, Image as ImageIcon } from 'lucide-react';

interface Inspection {
  id: string;
  fitting_id: string;
  inspection_type: string;
  status: string;
  notes: string | null;
  gps_latitude: number | null;
  gps_longitude: number | null;
  images: string[] | null;
  timestamp: string;
  inspector: {
    name: string;
    email: string;
  };
  fitting: {
    qr_code: string;
    part_type: string;
    manufacturer: string;
  };
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inspections');
      const data = await response.json();

      if (response.ok) {
        setInspections(data.inspections);
      }
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pass':
        return 'secondary' as const;
      case 'fail':
        return 'destructive' as const;
      case 'needs_attention':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inspections</h1>
        <p className="text-muted-foreground">
          View all inspection records
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : inspections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No inspections found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inspections.map((inspection) => (
            <Card key={inspection.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {inspection.fitting.qr_code}
                    </CardTitle>
                    <CardDescription>
                      {inspection.fitting.part_type.replace('_', ' ')} • {inspection.fitting.manufacturer}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(inspection.status)}>
                    {inspection.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">
                      {inspection.inspection_type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inspector</p>
                    <p className="font-medium">{inspection.inspector.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(inspection.timestamp), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {format(new Date(inspection.timestamp), 'p')}
                    </p>
                  </div>
                </div>

                {inspection.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{inspection.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {inspection.gps_latitude && inspection.gps_longitude && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {inspection.gps_latitude.toFixed(6)}, {inspection.gps_longitude.toFixed(6)}
                      </span>
                    </div>
                  )}
                  {inspection.images && inspection.images.length > 0 && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>{inspection.images.length} image{inspection.images.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
