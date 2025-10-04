/**
 * Mock TMS (Track Management System) Integration
 * Simulates API calls to www.irecept.gov.in for track section data
 */

export interface TMSTrackData {
  track_section: string;
  total_fittings: number;
  last_inspection: string;
  critical_issues: number;
  maintenance_due: boolean;
  track_length_km: number;
  zone: string;
  division: string;
}

/**
 * Fetch mock track section data from TMS system
 * Simulates API call to www.irecept.gov.in
 */
export async function fetchMockTMSData(track_section: string): Promise<TMSTrackData> {
  // Simulate network latency (1.2 seconds)
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Generate mock data based on track section
  const zones = ['Northern', 'Southern', 'Eastern', 'Western', 'Central'];
  const divisions = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore'];

  const randomZoneIndex = track_section.charCodeAt(0) % zones.length;
  const randomDivIndex = track_section.charCodeAt(1) % divisions.length;

  return {
    track_section,
    total_fittings: Math.floor(Math.random() * 2000) + 500,
    last_inspection: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    critical_issues: Math.floor(Math.random() * 10),
    maintenance_due: Math.random() > 0.7,
    track_length_km: parseFloat((Math.random() * 50 + 10).toFixed(2)),
    zone: zones[randomZoneIndex],
    division: divisions[randomDivIndex],
  };
}

/**
 * Validate track section format
 */
export function validateTrackSection(track_section: string): boolean {
  // Track section should be alphanumeric with hyphens, 3-20 characters
  const pattern = /^[A-Z0-9-]{3,20}$/;
  return pattern.test(track_section);
}

/**
 * Batch fetch multiple track sections
 */
export async function fetchMultipleTrackSections(track_sections: string[]): Promise<TMSTrackData[]> {
  const promises = track_sections.map(section => fetchMockTMSData(section));
  return Promise.all(promises);
}

/**
 * Get maintenance priority based on track data
 */
export function getMaintenancePriority(data: TMSTrackData): 'low' | 'medium' | 'high' | 'critical' {
  if (data.critical_issues >= 5) return 'critical';
  if (data.critical_issues >= 3 || data.maintenance_due) return 'high';
  if (data.critical_issues >= 1) return 'medium';
  return 'low';
}
