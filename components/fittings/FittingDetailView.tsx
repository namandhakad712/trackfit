'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Factory, 
  Hash,
  Tag,
  Wrench,
  Eye,
  User,
  ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { AdminInspectionLogViewer } from '@/components/admin/AdminInspectionLogViewer';

// Dynamically import the map component to avoid SSR issues
const OlaMapWithNoSSR = dynamic(
  () => import('@/components/maps/OlaMapLocationSelector').then(mod => ({ default: mod.OlaMapLocationSelector })),
  { ssr: false }
);

interface FittingWithInspectionHistory {
  id: string;
  qr_code: string;
  part_type: string;
  manufacturer: string;
  lot_number: string;
  supply_date: string;
  warranty_months: number;
  warranty_expiry: string;
  quantity: number;
  current_location: string;
  status: string;
  created_at: string;
  metadata: any;
  inspections: Array<{
    id: string;
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
      role: string;
    };
  }>;
}

interface FittingDetailViewProps {
  fitting: FittingWithInspectionHistory;
  isAdmin?: boolean;
}

export function FittingDetailView({ fitting, isAdmin = false }: FittingDetailViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ 
    latitude: number; 
    longitude: number; 
  } | null>(null);
  
  // Parse current location from fitting data
  useEffect(() => {
    try {
      // Try to parse GPS coordinates from current_location field if it's in lat,lng format
      const locationMatch = fitting.current_location.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
      if (locationMatch) {
        setSelectedLocation({
          latitude: parseFloat(locationMatch[1]),
          longitude: parseFloat(locationMatch[2])
        });
      }
    } catch (error) {
      console.warn('Could not parse location from current_location field');
    }
  }, [fitting.current_location]);

  // Handle location selection from map
  const handleLocationSelect = (location: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
    // In a real implementation, you might want to save this location to the fitting
    console.log('Selected location:', location);
  };

  // Format part type for display
  const formatPartType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  // Format status badge
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'under_inspection': return 'secondary';
      case 'failed': return 'destructive';
      case 'replaced': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Fitting Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Fitting Details
            </span>
            <Badge variant={getStatusVariant(fitting.status)}>
              {fitting.status.replace('_', ' ')}
            </Badge>
          </CardTitle>
          <CardDescription>
            Detailed information about this track fitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">QR Code:</span>
                <Badge variant="outline" className="font-mono">
                  {fitting.qr_code}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Part Type:</span>
                <Badge variant="secondary">
                  {formatPartType(fitting.part_type)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Manufacturer:</span>
                <span>{fitting.manufacturer}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Lot Number:</span>
                <span className="font-mono">{fitting.lot_number}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Supply Date:</span>
                <span>{format(new Date(fitting.supply_date), 'PP')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Warranty:</span>
                <span>{fitting.warranty_months} months</span>
                <span className="text-muted-foreground">→</span>
                <span>{format(new Date(fitting.warranty_expiry), 'PP')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Quantity:</span>
                <span>{fitting.quantity}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span>{fitting.current_location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Map with Fitting Part Overlay */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Fitting Location & Part Visualization
          </CardTitle>
          <CardDescription>
            Interactive map showing the fitting location with part visualization overlay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full relative rounded-lg overflow-hidden border">
            {selectedLocation ? (
              <div className="absolute inset-0 bg-muted/10 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Map visualization would appear here</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing {formatPartType(fitting.part_type)} overlay at selected coordinates
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-muted/10 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Select a location to view map</p>
                </div>
              </div>
            )}
            
            {/* Part visualization overlay */}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{formatPartType(fitting.part_type)}</p>
                  <p className="text-xs text-muted-foreground">Overlay Visualization</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Part Diagram
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Show Installation Guide
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Inspection History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Inspection History
            </span>
            {fitting.inspections.length > 0 && (
              <Badge variant="secondary">
                {fitting.inspections.length} {fitting.inspections.length === 1 ? 'Entry' : 'Entries'}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Historical record of all inspections performed on this fitting
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fitting.inspections.length > 0 ? (
            <div className="space-y-4">
              {fitting.inspections.map((inspection) => (
                <div key={inspection.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {inspection.inspection_type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                        </span>
                        <Badge 
                          variant={
                            inspection.status === 'pass' ? 'default' : 
                            inspection.status === 'fail' ? 'destructive' : 'secondary'
                          }
                        >
                          {inspection.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(inspection.timestamp), 'PPpp')}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <User className="h-3 w-3" />
                        <span>{inspection.inspector.name}</span>
                      </div>
                      
                      {inspection.notes && (
                        <p className="text-sm mt-1">{inspection.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <AdminInspectionLogViewer 
                          inspection={{
                            ...inspection,
                            id: inspection.id,
                            fitting_id: fitting.id,
                            inspector_id: '', // Would be populated in real implementation
                            fitting: {
                              qr_code: fitting.qr_code,
                              part_type: fitting.part_type,
                              manufacturer: fitting.manufacturer,
                              lot_number: fitting.lot_number,
                              current_location: fitting.current_location
                            },
                            inspector: inspection.inspector
                          } as any} 
                        />
                      )}
                      
                      {inspection.images && inspection.images.length > 0 && (
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          View Images ({inspection.images.length})
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4" />
              <p>No inspection history found for this fitting</p>
              <p className="text-sm mt-1">All future inspections will be recorded here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}