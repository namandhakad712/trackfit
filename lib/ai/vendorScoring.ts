/**
 * Vendor Quality Scoring Algorithm
 * Calculates vendor performance metrics and quality status
 */

export interface VendorMetrics {
  total_supplies: number;
  total_inspections: number;
  failed_inspections: number;
  late_deliveries?: number;
}

export interface VendorQualityResult {
  failure_rate: number;
  quality_score: number;
  quality_status: 'Excellent' | 'Good' | 'Average' | 'Poor';
  color: string;
}

/**
 * Calculate vendor failure rate
 */
export function calculateFailureRate(metrics: VendorMetrics): number {
  if (metrics.total_inspections === 0) return 0;
  
  const rate = (metrics.failed_inspections / metrics.total_inspections) * 100;
  return parseFloat(rate.toFixed(2));
}

/**
 * Calculate vendor quality score
 * Formula: 100 - (failure_rate × 2) - (late_deliveries × 0.5)
 */
export function calculateVendorQualityScore(metrics: VendorMetrics): number {
  const failure_rate = calculateFailureRate(metrics);
  const late_deliveries = metrics.late_deliveries || 0;
  
  const quality_score = 100 - (failure_rate * 2) - (late_deliveries * 0.5);
  
  // Clamp between 0-100
  return parseFloat(Math.max(0, Math.min(100, quality_score)).toFixed(2));
}

/**
 * Get quality status based on score
 */
export function getQualityStatus(score: number): 'Excellent' | 'Good' | 'Average' | 'Poor' {
  if (score > 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  return 'Poor';
}

/**
 * Get color indicator for quality status
 */
export function getQualityColor(status: string): string {
  switch (status) {
    case 'Excellent':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Good':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Average':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Poor':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Calculate complete vendor quality result
 */
export function calculateVendorQuality(metrics: VendorMetrics): VendorQualityResult {
  const failure_rate = calculateFailureRate(metrics);
  const quality_score = calculateVendorQualityScore(metrics);
  const quality_status = getQualityStatus(quality_score);
  const color = getQualityColor(quality_status);
  
  return {
    failure_rate,
    quality_score,
    quality_status,
    color,
  };
}

/**
 * Update vendor metrics based on new inspection
 */
export function updateVendorMetrics(
  currentMetrics: VendorMetrics,
  inspectionStatus: 'pass' | 'fail' | 'needs_attention'
): VendorMetrics {
  const updatedMetrics = { ...currentMetrics };
  
  updatedMetrics.total_inspections += 1;
  
  if (inspectionStatus === 'fail') {
    updatedMetrics.failed_inspections += 1;
  }
  
  return updatedMetrics;
}
