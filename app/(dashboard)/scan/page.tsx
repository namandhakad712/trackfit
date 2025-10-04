'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScanner } from '@/components/scanner/QRScanner';
import { ManualQREntry } from '@/components/scanner/ManualQREntry';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Keyboard } from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState('');

  const handleScanSuccess = async (qrCode: string) => {
    await lookupFitting(qrCode);
  };

  const handleManualSubmit = async (qrCode: string) => {
    await lookupFitting(qrCode);
  };

  const lookupFitting = async (qrCode: string) => {
    try {
      setIsLookingUp(true);
      setError('');

      // Fetch fitting by QR code
      const response = await fetch(`/api/fittings?search=${encodeURIComponent(qrCode)}&limit=1`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup fitting');
      }

      if (!data.fittings || data.fittings.length === 0) {
        setError('Fitting not found. Please check the QR code and try again.');
        return;
      }

      // Navigate to fitting detail page
      const fitting = data.fittings[0];
      router.push(`/fittings/${fitting.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scan QR Code</h1>
        <p className="text-muted-foreground">
          Scan a fitting QR code to view details and log inspections
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLookingUp && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-600">Looking up fitting...</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Camera Scan
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>
        <TabsContent value="camera" className="mt-6">
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onScanError={handleError}
          />
        </TabsContent>
        <TabsContent value="manual" className="mt-6">
          <ManualQREntry
            onSubmit={handleManualSubmit}
            onError={handleError}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">Tips for scanning:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Hold your device steady and ensure good lighting</li>
              <li>Position the QR code within the scanning frame</li>
              <li>Keep the camera about 6-12 inches from the QR code</li>
              <li>If scanning fails, try manual entry instead</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
