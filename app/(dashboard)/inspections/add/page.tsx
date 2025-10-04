'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InspectionForm } from '@/components/inspections/InspectionForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddInspectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fittingId = searchParams.get('fitting_id');
  
  const [fitting, setFitting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (fittingId) {
      fetchFitting();
    } else {
      setError('No fitting ID provided');
      setIsLoading(false);
    }
  }, [fittingId]);

  const fetchFitting = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/fittings/${fittingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch fitting');
      }

      setFitting(data.fitting);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (data: any) => {
    setSuccess(true);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !fitting) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inspection Logged Successfully!</h1>
          <p className="text-muted-foreground">
            Your inspection has been recorded
          </p>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900">Success</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Inspection logged for fitting: {fitting?.qr_code}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex gap-4">
          <Button asChild>
            <Link href={`/fittings/${fittingId}`}>
              View Fitting Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/scan">
              Scan Another QR Code
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/inspections">
              View All Inspections
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add Inspection</h1>
          <p className="text-muted-foreground">
            Log inspection for fitting: {fitting?.qr_code}
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href={`/fittings/${fittingId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fitting
          </Link>
        </Button>
      </div>

      {fitting && (
        <Card>
          <CardHeader>
            <CardTitle>Fitting Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{fitting.current_location}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {fitting && (
        <InspectionForm
          fittingId={fittingId!}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
}
