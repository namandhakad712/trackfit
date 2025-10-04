import { createClient } from '@/lib/supabase/server';
import { calculateVendorQuality } from '@/lib/ai/vendorScoring';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all vendors
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .order('quality_score', { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate quality metrics for each vendor
    const vendorsWithQuality = (vendors || []).map((vendor) => {
      const qualityResult = calculateVendorQuality({
        total_supplies: vendor.total_supplies || 0,
        total_inspections: vendor.total_inspections || 0,
        failed_inspections: vendor.failed_inspections || 0,
        late_deliveries: 0, // Can be added later
      });

      return {
        ...vendor,
        ...qualityResult,
      };
    });

    return NextResponse.json({
      vendors: vendorsWithQuality,
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}
