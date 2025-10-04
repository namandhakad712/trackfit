import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total fittings count grouped by part type
    const { data: fittingsByType, error: fittingsError } = await supabase
      .from('fittings')
      .select('part_type, status')
      .eq('status', 'active');

    if (fittingsError) throw fittingsError;

    const fittingsCount = {
      total: fittingsByType?.length || 0,
      elastic_rail_clip: fittingsByType?.filter(f => f.part_type === 'elastic_rail_clip').length || 0,
      rail_pad: fittingsByType?.filter(f => f.part_type === 'rail_pad').length || 0,
      liner: fittingsByType?.filter(f => f.part_type === 'liner').length || 0,
      sleeper: fittingsByType?.filter(f => f.part_type === 'sleeper').length || 0,
    };

    // Get inspections count for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentInspections, error: inspectionsError } = await supabase
      .from('inspections')
      .select('status, timestamp')
      .gte('timestamp', thirtyDaysAgo.toISOString());

    if (inspectionsError) throw inspectionsError;

    const inspectionsCount = {
      total: recentInspections?.length || 0,
      pass: recentInspections?.filter(i => i.status === 'pass').length || 0,
      fail: recentInspections?.filter(i => i.status === 'fail').length || 0,
      needs_attention: recentInspections?.filter(i => i.status === 'needs_attention').length || 0,
    };

    // Get unresolved critical alerts count
    const { data: criticalAlerts, error: alertsError } = await supabase
      .from('alerts')
      .select('id')
      .eq('severity', 'critical')
      .eq('resolved', false);

    if (alertsError) throw alertsError;

    const criticalAlertsCount = criticalAlerts?.length || 0;

    // Get vendor performance metrics (top 5 best and worst)
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('vendor_name, quality_score, failure_rate, total_inspections')
      .gt('total_inspections', 10)
      .order('quality_score', { ascending: false });

    if (vendorsError) throw vendorsError;

    const topVendors = vendors?.slice(0, 5) || [];
    const worstVendors = vendors?.slice(-5).reverse() || [];

    // Get warranty expiry statistics
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    const { data: expiringWarranties, error: warrantyError } = await supabase
      .from('fittings')
      .select('warranty_expiry')
      .eq('status', 'active')
      .gte('warranty_expiry', today.toISOString().split('T')[0])
      .lte('warranty_expiry', ninetyDaysFromNow.toISOString().split('T')[0]);

    if (warrantyError) throw warrantyError;

    const warrantyStats = {
      expiring_soon: expiringWarranties?.length || 0,
      critical: expiringWarranties?.filter(f => {
        const daysUntil = Math.floor((new Date(f.warranty_expiry).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 30;
      }).length || 0,
    };

    return NextResponse.json({
      fittings: fittingsCount,
      inspections: inspectionsCount,
      critical_alerts: criticalAlertsCount,
      vendors: {
        top: topVendors,
        worst: worstVendors,
      },
      warranty: warrantyStats,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
