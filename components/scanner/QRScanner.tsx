'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, CheckCircle2 } from 'lucide-react';
import { validateQRFormat } from '@/lib/utils/qrGenerator';

interface QRScannerProps {
  onScanSuccess: (qrCode: string) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [lastScanned, setLastScanned] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerIdRef = useRef<string>('qr-scanner-' + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    return () => {
      // Cleanup on unmount - stop scanner if it exists regardless of scanning state
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      
      setHasPermission(true);

      // Initialize scanner
      const scanner = new Html5Qrcode(scannerIdRef.current);
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scanner.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        config,
        (decodedText) => {
          // Success callback
          try {
            handleScanSuccess(decodedText);
          } catch (err) {
            console.error('Error in scan success handler:', err);
            onScanError?.(err instanceof Error ? err.message : 'Error processing scan');
          }
        },
        (errorMessage) => {
          // Error callback (can be ignored for continuous scanning)
          // console.log('Scan error:', errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
          setError('Camera access denied. Please enable camera permissions in your browser settings.');
          setHasPermission(false);
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
          setHasPermission(false);
        } else {
          setError('Failed to start camera. Please try again.');
        }
      } else {
        setError('Failed to start camera. Please try again.');
      }
      
      onScanError?.(err instanceof Error ? err.message : 'Failed to start camera');
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const handleScanSuccess = (qrCode: string) => {
    // Prevent duplicate scans
    if (qrCode === lastScanned) {
      return;
    }

    setLastScanned(qrCode);

    // Validate QR format
    if (!validateQRFormat(qrCode)) {
      setError('Invalid QR code format. Expected format: IR-TYPE-MFG-LOT-TIMESTAMP');
      onScanError?.('Invalid QR code format');
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Play success sound (optional)
    playSuccessSound();

    // Vibrate on mobile (optional)
    if (navigator.vibrate) {
      try {
        navigator.vibrate(200);
      } catch (err) {
        // Ignore vibrate errors
      }
    }

    // Stop scanning and call success callback
    stopScanning();
    onScanSuccess(qrCode);
  };

  const playSuccessSound = () => {
    try {
      // Check if Web Audio API is supported
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        return;
      }
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (err) {
      // Ignore audio errors
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>
          {isScanning 
            ? 'Point your camera at a QR code to scan'
            : 'Click the button below to start scanning'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="relative">
          <div
            id={scannerIdRef.current}
            className={`w-full rounded-lg overflow-hidden ${
              isScanning ? 'border-2 border-primary' : 'bg-gray-100 aspect-square flex items-center justify-center'
            }`}
          >
            {!isScanning && (
              <div className="text-center text-muted-foreground">
                <Camera className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>Camera preview will appear here</p>
              </div>
            )}
          </div>

          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-64 border-2 border-primary rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isScanning ? (
            <Button
              onClick={startScanning}
              className="flex-1"
              disabled={hasPermission === false}
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="destructive"
              className="flex-1"
            >
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Scanning
            </Button>
          )}
        </div>

        {hasPermission === false && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Camera access is required to scan QR codes.</p>
            <p>To enable camera access:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Click the camera icon in your browser's address bar</li>
              <li>Select "Allow" for camera permissions</li>
              <li>Refresh the page and try again</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
