import { createClient } from '@/lib/supabase/server';
import { getVendorPerformanceSummary } from '@/lib/vendors/qualityScoring';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const vendorId = params.id;

    // Fetch vendor details
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Fetch related fittings
    const { data: fittings } = await supabase
      .from('fittings')
      .select('id, qr_code, part_type, supply_date, warranty_expiry, status, current_location')
      .eq('manufacturer', vendor.vendor_name)
      .order('supply_date', { ascending: false });

    // Fetch inspections for vendor's fittings
    const { data: inspections } = await supabase
      .from('inspections')
      .select(`
        id,
        status,
        inspection_type,
        timestamp,
        fitting:fittings!inner(manufacturer)
      `)
      .eq('fittings.manufacturer', vendor.vendor_name)
      .order('timestamp', { ascending: false })
      .limit(100);

    // Calculate detailed metrics
    const totalFittings = fittings?.length || 0;
    const activeFittings = fittings?.filter(f => f.status === 'active').length || 0;
    const failedFittings = fittings?.filter(f => f.status === 'failed').length || 0;

    // Calculate inspection statistics
    const totalInspections = inspections?.length || 0;
    const passedInspections = inspections?.filter(i => i.status === 'pass').length || 0;
    const failedInspections = inspections?.filter(i => i.status === 'fail').length || 0;
    const needsAttention = inspections?.filter(i => i.status === 'needs_attention').length || 0;

    // Calculate failure rate
    const failureRate = totalInspections > 0 
      ? (failedInspections / totalInspections) * 100 
      : 0;

    // Get performance summary
    const metrics = {
      failure_rate: failureRate,
      late_deliveries: 0,
      total_inspections: totalInspections,
      failed_inspections: failedInspections,
    };

    const performance = getVendorPerformanceSummary(metrics);

    // Calculate monthly trend (last 6 months)
    const monthlyTrend = calculateMonthlyTrend(inspections || []);

    return NextResponse.json({
      vendor: {
        ...vendor,
        quality_score: performance.score,
        quality_status: performance.status,
        quality_color: performance.color,
      },
      metrics: {
        total_fittings: totalFittings,
        active_fittings: activeFittings,
        failed_fittings: failedFittings,
        total_inspections: totalInspections,
        passed_inspections: passedInspections,
        failed_inspections: failedInspections,
        needs_attention: needsAttention,
        failure_rate: Math.round(failureRate * 10) / 10,
        pass_rate: totalInspections > 0 
          ? Math.round((passedInspections / totalInspections) * 1000) / 10 
          : 0,
      },
      fittings: fittings || [],
      recent_inspections: inspections?.slice(0, 20) || [],
      monthly_trend: monthlyTrend,
    });
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor details' },
      { status: 500 }
    );
  }
}

/**
 * Calculate monthly inspection trend for the last 6 months
 */
function calculateMonthlyTrend(inspections: any[]) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  const monthlyData: Record<string, { pass: number; fail: number; needs_attention: number }> = {};
  
  // Initialize last 6 months
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[key] = { pass: 0, fail: 0, needs_attention: 0 };
  }
  
  // Count inspections by month
  inspections.forEach(inspection => {
    const date = new Date(inspection.timestamp);
    if (date >= sixMonthsAgo) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[key]) {
        if (inspection.status === 'pass') monthlyData[key].pass++;
        else if (inspection.status === 'fail') monthlyData[key].fail++;
        else if (inspection.status === 'needs_attention') monthlyData[key].needs_attention++;
      }
    }
  });
  
  // Convert to array and sort by date
  return Object.entries(monthlyData)
    .map(([month, counts]) => ({
      month,
      ...counts,
      total: counts.pass + counts.fail + counts.needs_attention,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
