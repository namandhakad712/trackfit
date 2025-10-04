'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Keyboard, Search } from 'lucide-react';
import { validateQRFormat } from '@/lib/utils/qrGenerator';

interface ManualQREntryProps {
  onSubmit: (qrCode: string) => void;
  onError?: (error: string) => void;
}

export function ManualQREntry({ onSubmit, onError }: ManualQREntryProps) {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrCode.trim()) {
      setError('Please enter a QR code');
      return;
    }

    // Validate QR format
    if (!validateQRFormat(qrCode.trim())) {
      const errorMsg = 'Invalid QR code format. Expected format: IR-TYPE-MFG-LOT-TIMESTAMP';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setError('');
    setIsSubmitting(true);
    onSubmit(qrCode.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCode(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          <CardTitle>Manual Entry</CardTitle>
        </div>
        <CardDescription>
          Enter the QR code manually if camera scanning is unavailable
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="qr-code">QR Code</Label>
            <Input
              id="qr-code"
              type="text"
              placeholder="IR-CLIP-ABC-LOT123-1704384000"
              value={qrCode}
              onChange={handleChange}
              disabled={isSubmitting}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Format: IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !qrCode.trim()}
          >
            <Search className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Looking up...' : 'Look Up Fitting'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
