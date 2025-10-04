'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Printer, Copy, Check } from 'lucide-react';
import { generateQRCodeImage, downloadQRCode, printQRCode, copyQRCodeToClipboard } from '@/lib/utils/qrGenerator';

interface QRCodeDisplayProps {
  qrCode: string;
  title?: string;
  description?: string;
  showActions?: boolean;
}

export function QRCodeDisplay({
  qrCode,
  title = 'QR Code Generated',
  description = 'Scan this QR code to access fitting details',
  showActions = true,
}: QRCodeDisplayProps) {
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function generateImage() {
      try {
        setIsLoading(true);
        setError('');
        const imageUrl = await generateQRCodeImage(qrCode, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
        });
        setQrImageUrl(imageUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    }

    if (qrCode) {
      generateImage();
    }
  }, [qrCode]);

  const handleDownload = () => {
    if (qrImageUrl) {
      const filename = `${qrCode}.png`;
      downloadQRCode(qrImageUrl, filename);
    }
  };

  const handlePrint = () => {
    if (qrImageUrl) {
      printQRCode(qrImageUrl);
    }
  };

  const handleCopy = async () => {
    try {
      await copyQRCodeToClipboard(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying QR code:', err);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {isLoading ? (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <img
                src={qrImageUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {qrCode}
              </p>
            </div>
          </>
        )}
      </CardContent>
      {showActions && !isLoading && (
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
