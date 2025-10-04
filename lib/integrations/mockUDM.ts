/**
 * Mock UDM (Unified Data Management) Integration
 * Simulates API calls to www.ireps.gov.in for vendor data
 */

export interface UDMVendorData {
  vendor_code: string;
  vendor_name: string;
  total_orders: number;
  pending_deliveries: number;
  quality_rating: number;
  last_delivery_date: string;
  contact_email?: string;
  contact_phone?: string;
}

/**
 * Fetch mock vendor data from UDM system
 * Simulates API call to www.ireps.gov.in
 */
export async function fetchMockUDMData(vendor_code: string): Promise<UDMVendorData> {
  // Simulate network latency (1 second)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate mock data based on vendor code
  const vendorNames = [
    'ABC Industries Ltd',
    'XYZ Manufacturing Corp',
    'DEF Rail Components',
    'GHI Steel Works',
    'JKL Engineering Solutions',
  ];

  const randomIndex = vendor_code.charCodeAt(0) % vendorNames.length;

  return {
    vendor_code,
    vendor_name: vendorNames[randomIndex] || `Vendor ${vendor_code}`,
    total_orders: Math.floor(Math.random() * 500) + 100,
    pending_deliveries: Math.floor(Math.random() * 20),
    quality_rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
    last_delivery_date: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    contact_email: `contact@${vendor_code.toLowerCase()}.com`,
    contact_phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  };
}

/**
 * Validate vendor code format
 */
export function validateVendorCode(vendor_code: string): boolean {
  // Vendor code should be alphanumeric, 3-10 characters
  const pattern = /^[A-Z0-9]{3,10}$/;
  return pattern.test(vendor_code);
}

/**
 * Batch fetch multiple vendors
 */
export async function fetchMultipleVendors(vendor_codes: string[]): Promise<UDMVendorData[]> {
  const promises = vendor_codes.map(code => fetchMockUDMData(code));
  return Promise.all(promises);
}
