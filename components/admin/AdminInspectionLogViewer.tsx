'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  MapPin, 
  User, 
  Image as ImageIcon, 
  FileText, 
  Calendar,
  Hash,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { OlaMapLocationSelector } from '../maps/OlaMapLocationSelector';

interface InspectionDetails {
  id: string;
  fitting_id: string;
  inspector_id: string;
  inspection_type: string;
  status: string;
  notes: string | null;
  gps_latitude: number | null;
  gps_longitude: number | null;
  images: string[] | null;
  timestamp: string;
  fitting: {
    qr_code: string;
    part_type: string;
    manufacturer: string;
    lot_number: string;
    current_location: string;
  };
  inspector: {
    name: string;
    email: string;
    role: string;
  };
}

interface AdminInspectionLogViewerProps {
  inspection: InspectionDetails;
}

export function AdminInspectionLogViewer({ inspection }: AdminInspectionLogViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Helper function to format inspection type
  const formatInspectionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Helper function to format status
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass': return 'default';
      case 'fail': return 'destructive';
      case 'needs_attention': return 'warning';
      default: return 'secondary';
    }
  };
  
  // Helper function to format role
  const formatRole = (role: string) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Full Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Inspection Details
          </DialogTitle>
          <DialogDescription>
            Complete inspection log with all metadata and inspector information
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-6 py-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Inspection ID:</span>
                    <span className="font-mono text-xs">{inspection.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Timestamp:</span>
                    <span>{format(new Date(inspection.timestamp), 'PPpp')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Type:</span>
                    <Badge variant="secondary">
                      {formatInspectionType(inspection.inspection_type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    <Badge variant={getStatusVariant(inspection.status) as any}>
                      {inspection.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fitting QR:</span>
                    <span className="font-mono text-xs">{inspection.fitting.qr_code}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Part Type:</span>
                    <Badge variant="outline">
                      {inspection.fitting.part_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Manufacturer:</span>
                    <span>{inspection.fitting.manufacturer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Lot Number:</span>
                    <span className="font-mono text-xs">{inspection.fitting.lot_number}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Separator />
            
            {/* Inspector Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Inspector Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Name:</span>
                      <span>{inspection.inspector.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Email:</span>
                      <span className="text-muted-foreground">{inspection.inspector.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Role:</span>
                      <Badge variant="outline">
                        {formatRole(inspection.inspector.role)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span>{inspection.fitting.current_location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Separator />
            
            {/* GPS Location and Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inspection.gps_latitude && inspection.gps_longitude ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Coordinates:</span>
                      <Badge variant="secondary" className="font-mono">
                        {inspection.gps_latitude.toFixed(6)}, {inspection.gps_longitude.toFixed(6)}
                      </Badge>
                    </div>
                    {/* Map preview would go here if needed */}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No GPS coordinates recorded for this inspection.
                  </p>
                )}
                
                {inspection.notes ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Inspection Notes:</h4>
                    <div className="p-3 bg-muted/50 rounded-md text-sm">
                      {inspection.notes}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No additional notes provided for this inspection.
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Separator />
            
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Inspection Images
                </CardTitle>
                <CardDescription>
                  Photos taken during the inspection process
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inspection.images && inspection.images.length > 0 ? (
                  <Tabs defaultValue="0" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                      {inspection.images.map((_, index) => (
                        <TabsTrigger key={index} value={index.toString()}>
                          Image {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {inspection.images.map((imageUrl, index) => (
                      <TabsContent key={index} value={index.toString()}>
                        <div className="flex flex-col items-center gap-4">
                          <img 
                            src={imageUrl} 
                            alt={`Inspection image ${index + 1}`} 
                            className="max-w-full h-auto max-h-[400px] object-contain rounded-lg border"
                          />
                          <div className="text-sm text-muted-foreground">
                            Image {index + 1} of {inspection.images?.length}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <p className="text-sm text-muted-foreground italic py-4 text-center">
                    No images were uploaded for this inspection.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}