'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FittingForm } from '@/components/fittings/FittingForm';
import { QRCodeDisplay } from '@/components/fittings/QRCodeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AddFittingPage() {
  const router = useRouter();
  const [createdFitting, setCreatedFitting] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSuccess = (data: any) => {
    setCreatedFitting(data);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCreatedFitting(null);
  };

  const handleCreateAnother = () => {
    setCreatedFitting(null);
    setError('');
  };

  const handleViewFitting = () => {
    if (createdFitting?.fitting?.id) {
      router.push(`/fittings/${createdFitting.fitting.id}`);
    }
  };

  if (createdFitting) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fitting Created Successfully!</h1>
          <p className="text-muted-foreground">
            Your fitting has been created and a QR code has been generated
          </p>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900">Success</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Fitting record created with QR code: {createdFitting.qr_code}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <QRCodeDisplay
              qrCode={createdFitting.qr_code}
              title="Fitting QR Code"
              description="Download, print, or copy this QR code to attach to the physical fitting"
            />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fitting Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Part Type</p>
                  <p className="font-medium capitalize">
                    {createdFitting.fitting.part_type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{createdFitting.fitting.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lot Number</p>
                  <p className="font-medium">{createdFitting.fitting.lot_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{createdFitting.fitting.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{createdFitting.fitting.current_location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warranty Expiry</p>
                  <p className="font-medium">
                    {new Date(createdFitting.fitting.warranty_expiry).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button onClick={handleCreateAnother} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Another Fitting
              </Button>
              <Button
                variant="outline"
                onClick={handleViewFitting}
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Fitting Details
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full"
              >
                <Link href="/fittings">
                  View All Fittings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Fitting</h1>
        <p className="text-muted-foreground">
          Create a new track fitting record and generate a QR code
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <FittingForm onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}
