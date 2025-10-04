/**
 * Vendor Quality Scoring Algorithm
 * Calculates vendor quality scores based on failure rates and delivery performance
 */

export interface VendorMetrics {
  failure_rate: number; // Percentage (0-100)
  late_deliveries?: number; // Percentage (0-100)
  total_inspections: number;
  failed_inspections: number;
  on_time_deliveries?: number;
  total_deliveries?: number;
}

export type QualityStatus = 'Excellent' | 'Good' | 'Average' | 'Poor';

/**
 * Calculate vendor quality score
 * Formula: 100 - (failure_rate × 2) - (late_deliveries × 0.5)
 * 
 * @param metrics - Vendor performance metrics
 * @returns Quality score (0-100)
 */
export function calculateVendorQualityScore(metrics: VendorMetrics): number {
  const { failure_rate, late_deliveries = 0 } = metrics;
  
  // Base score starts at 100
  let score = 100;
  
  // Deduct for failure rate (weighted heavily at 2x)
  score -= failure_rate * 2;
  
  // Deduct for late deliveries (weighted at 0.5x)
  score -= late_deliveries * 0.5;
  
  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Get quality status based on score
 * 
 * @param score - Quality score (0-100)
 * @returns Quality status label
 */
export function getQualityStatus(score: number): QualityStatus {
  if (score > 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  return 'Poor';
}

/**
 * Get color indicator for quality status
 * 
 * @param status - Quality status
 * @returns Tailwind color class
 */
export function getQualityColor(status: QualityStatus): string {
  switch (status) {
    case 'Excellent':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Good':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Average':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Poor':
      return 'text-red-600 bg-red-50 border-red-200';
  }
}

/**
 * Calculate failure rate from inspection data
 * 
 * @param failed - Number of failed inspections
 * @param total - Total number of inspections
 * @returns Failure rate percentage
 */
export function calculateFailureRate(failed: number, total: number): number {
  if (total === 0) return 0;
  return (failed / total) * 100;
}

/**
 * Calculate late delivery rate
 * 
 * @param onTime - Number of on-time deliveries
 * @param total - Total number of deliveries
 * @returns Late delivery percentage
 */
export function calculateLateDeliveryRate(onTime: number, total: number): number {
  if (total === 0) return 0;
  const late = total - onTime;
  return (late / total) * 100;
}

/**
 * Get vendor performance summary
 * 
 * @param metrics - Vendor metrics
 * @returns Performance summary object
 */
export function getVendorPerformanceSummary(metrics: VendorMetrics) {
  const score = calculateVendorQualityScore(metrics);
  const status = getQualityStatus(score);
  const color = getQualityColor(status);
  
  return {
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    status,
    color,
    failure_rate: Math.round(metrics.failure_rate * 10) / 10,
    late_deliveries: metrics.late_deliveries 
      ? Math.round(metrics.late_deliveries * 10) / 10 
      : 0,
  };
}
