import QRCode from 'qrcode';

/**
 * QR Code format: IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
 * Example: IR-CLIP-ABC-LOT123-1704384000
 */

interface QRCodeData {
  part_type: string;
  manufacturer: string;
  lot_number: string;
  timestamp?: number;
}

/**
 * Generates a unique QR code string in the format:
 * IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
 */
export function generateQRCode(data: QRCodeData): string {
  const { part_type, manufacturer, lot_number, timestamp = Date.now() } = data;
  
  // Convert part type to uppercase code
  const typeCode = part_type.toUpperCase().replace('_', '');
  
  // Clean manufacturer name (alphanumeric only, max 10 chars)
  const mfgCode = manufacturer
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 10);
  
  // Clean lot number (alphanumeric only)
  const lotCode = lot_number
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  
  // Use Unix timestamp (seconds)
  const timestampCode = Math.floor(timestamp / 1000);
  
  return `IR-${typeCode}-${mfgCode}-${lotCode}-${timestampCode}`;
}

/**
 * Generates a QR code image as a data URL
 */
export async function generateQRCodeImage(
  qrText: string,
  options?: {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }
): Promise<string> {
  const defaultOptions = {
    errorCorrectionLevel: 'H' as const, // High error correction for durability
    width: 512, // High resolution for printing
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };
  
  const qrOptions = { ...defaultOptions, ...options };
  
  try {
    const dataUrl = await QRCode.toDataURL(qrText, qrOptions);
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code image:', error);
    throw new Error('Failed to generate QR code image');
  }
}

/**
 * Generates a QR code as a canvas element (for browser use)
 */
export async function generateQRCodeCanvas(
  qrText: string,
  canvas: HTMLCanvasElement,
  options?: {
    width?: number;
    margin?: number;
  }
): Promise<void> {
  const defaultOptions = {
    errorCorrectionLevel: 'H' as const,
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };
  
  const qrOptions = { ...defaultOptions, ...options };
  
  try {
    await QRCode.toCanvas(canvas, qrText, qrOptions);
  } catch (error) {
    console.error('Error generating QR code canvas:', error);
    throw new Error('Failed to generate QR code canvas');
  }
}

/**
 * Validates QR code format
 * Format: IR-[TYPE]-[MANUFACTURER]-[LOT]-[TIMESTAMP]
 */
export function validateQRFormat(qrCode: string): boolean {
  // Pattern: IR-[ALPHANUMERIC]+-[ALPHANUMERIC]+-[ALPHANUMERIC]+-[DIGITS]
  const pattern = /^IR-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-\d+$/;
  return pattern.test(qrCode);
}

/**
 * Parses a QR code string into its components
 */
export function parseQRCode(qrCode: string): {
  prefix: string;
  type: string;
  manufacturer: string;
  lot: string;
  timestamp: number;
} | null {
  if (!validateQRFormat(qrCode)) {
    return null;
  }
  
  const parts = qrCode.split('-');
  
  return {
    prefix: parts[0],
    type: parts[1],
    manufacturer: parts[2],
    lot: parts[3],
    timestamp: parseInt(parts[4], 10),
  };
}

/**
 * Downloads a QR code image as PNG
 */
export function downloadQRCode(dataUrl: string, filename: string = 'qr-code.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Prints a QR code image
 */
export function printQRCode(dataUrl: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print QR Code</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          @media print {
            body {
              margin: 0;
            }
            img {
              width: 4in;
              height: 4in;
            }
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="QR Code" />
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for image to load before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

/**
 * Copies QR code text to clipboard
 */
export async function copyQRCodeToClipboard(qrText: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(qrText);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy QR code to clipboard');
  }
}
