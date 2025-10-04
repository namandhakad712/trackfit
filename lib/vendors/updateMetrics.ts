import { createClient } from '@/lib/supabase/server';
import { calculateFailureRate } from './qualityScoring';

/**
 * Update vendor metrics after an inspection is logged
 * Recalculates failure rate and quality score
 * 
 * @param manufacturer - Vendor/manufacturer name
 */
export async function updateVendorMetrics(manufacturer: string): Promise<void> {
  try {
    const supabase = await createClient();

    // Get all inspections for this vendor's fittings
    const { data: inspections } = await supabase
      .from('inspections')
      .select(`
        id,
        status,
        fitting:fittings!inner(manufacturer)
      `)
      .eq('fittings.manufacturer', manufacturer);

    if (!inspections || inspections.length === 0) {
      return;
    }

    // Calculate metrics
    const totalInspections = inspections.length;
    const failedInspections = inspections.filter(i => i.status === 'fail').length;
    const failureRate = calculateFailureRate(failedInspections, totalInspections);

    // Update vendor record
    const { error } = await supabase
      .from('vendors')
      .update({
        total_inspections: totalInspections,
        failed_inspections: failedInspections,
        failure_rate: failureRate,
        last_updated: new Date().toISOString(),
      })
      .eq('vendor_name', manufacturer);

    if (error) {
      console.error('Error updating vendor metrics:', error);
    } else {
      console.log(`Updated metrics for vendor: ${manufacturer}`);
    }
  } catch (error) {
    console.error('Error in updateVendorMetrics:', error);
  }
}

/**
 * Ensure vendor exists in database, create if not
 * 
 * @param manufacturer - Vendor/manufacturer name
 */
export async function ensureVendorExists(manufacturer: string): Promise<void> {
  try {
    const supabase = await createClient();

    // Check if vendor exists
    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('vendor_name', manufacturer)
      .single();

    if (!existing) {
      // Create vendor with default values
      const vendorCode = manufacturer
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 10);

      const { error } = await supabase
        .from('vendors')
        .insert({
          vendor_code: vendorCode,
          vendor_name: manufacturer,
          total_inspections: 0,
          failed_inspections: 0,
          failure_rate: 0,
          quality_score: 100,
        });

      if (error) {
        console.error('Error creating vendor:', error);
      } else {
        console.log(`Created new vendor: ${manufacturer}`);
      }
    }
  } catch (error) {
    console.error('Error in ensureVendorExists:', error);
  }
}
