import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/permissions/api';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user with role
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = user.role;
    const userId = user.id;
    const depotLocation = user.depot_location;

    // Build base query for fittings with role-based filtering
    let fittingsQuery = supabase
      .from('fittings')
      .select('part_type, status, current_location');

    // Apply depot-based filtering for depot managers
    if (userRole === 'depot_manager' && depotLocation) {
      fittingsQuery = fittingsQuery.eq('current_location', depotLocation);
    }

    const { data: allFittings, error: fittingsError } = await fittingsQuery;

    if (fittingsError) throw fittingsError;

    const fittingsCount = {
      total: allFittings?.length || 0,
      active: allFittings?.filter(f => f.status === 'active').length || 0,
      under_inspection: allFittings?.filter(f => f.status === 'under_inspection').length || 0,
      failed: allFittings?.filter(f => f.status === 'failed').length || 0,
      elastic_rail_clip: allFittings?.filter(f => f.part_type === 'elastic_rail_clip').length || 0,
      rail_pad: allFittings?.filter(f => f.part_type === 'rail_pad').length || 0,
      liner: allFittings?.filter(f => f.part_type === 'liner').length || 0,
      sleeper: allFittings?.filter(f => f.part_type === 'sleeper').length || 0,
    };

    // Get inspections count for last 30 days with role-based filtering
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let inspectionsQuery = supabase
      .from('inspections')
      .select('status, timestamp, inspector_id, fitting_id, fittings!inner(current_location, qr_code)')
      .gte('timestamp', thirtyDaysAgo.toISOString());

    // Apply inspector-based filtering for inspectors
    if (userRole === 'inspector') {
      inspectionsQuery = inspectionsQuery.eq('inspector_id', userId);
    }

    // Apply depot-based filtering for depot managers
    if (userRole === 'depot_manager' && depotLocation) {
      inspectionsQuery = inspectionsQuery.eq('fittings.current_location', depotLocation);
    }

    const { data: recentInspections, error: inspectionsError } = await inspectionsQuery;

    if (inspectionsError) throw inspectionsError;

    const inspectionsCount = {
      total: recentInspections?.length || 0,
      pass: recentInspections?.filter(i => i.status === 'pass').length || 0,
      fail: recentInspections?.filter(i => i.status === 'fail').length || 0,
      needs_attention: recentInspections?.filter(i => i.status === 'needs_attention').length || 0,
    };

    // Get recent inspections for inspector dashboard
    const recentInspectionsList = recentInspections?.slice(0, 5).map(i => ({
      id: i.fitting_id,
      fitting_qr: (i as any).fittings?.qr_code || 'Unknown',
      status: i.status,
      timestamp: i.timestamp,
    })) || [];

    // Get unresolved alerts count with role-based filtering
    let alertsQuery = supabase
      .from('alerts')
      .select('id, fitting_id, fittings!inner(current_location)')
      .eq('resolved', false);

    // Depot managers only see alerts for their depot
    if (userRole === 'depot_manager' && depotLocation) {
      alertsQuery = alertsQuery.eq('fittings.current_location', depotLocation);
    }

    // Inspectors don't see alerts (handled by middleware, but double-check here)
    if (userRole === 'inspector') {
      alertsQuery = alertsQuery.limit(0);
    }

    const { data: alerts, error: alertsError } = await alertsQuery;

    if (alertsError) throw alertsError;

    const alertsCount = {
      active: alerts?.length || 0,
    };

    // Get vendor performance metrics (admin only)
    let topVendors: any[] = [];
    if (userRole === 'admin') {
      const { data: vendors, error: vendorsError } = await supabase
        .from('vendors')
        .select('vendor_name, quality_score, failure_rate, total_inspections')
        .gt('total_inspections', 10)
        .order('quality_score', { ascending: false });

      if (!vendorsError) {
        topVendors = vendors?.slice(0, 5).map(v => ({
          vendorName: v.vendor_name,
          qualityScore: v.quality_score,
          failureRate: v.failure_rate,
        })) || [];
      }
    }

    // Get warranty expiry statistics with role-based filtering
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    let warrantyQuery = supabase
      .from('fittings')
      .select('warranty_expiry, current_location')
      .eq('status', 'active')
      .gte('warranty_expiry', today.toISOString().split('T')[0])
      .lte('warranty_expiry', thirtyDaysFromNow.toISOString().split('T')[0]);

    if (userRole === 'depot_manager' && depotLocation) {
      warrantyQuery = warrantyQuery.eq('current_location', depotLocation);
    }

    const { data: expiringWarranties, error: warrantyError } = await warrantyQuery;

    const warrantyStats = {
      expiring_soon: expiringWarranties?.length || 0,
    };

    // Get user count (admin only)
    let usersCount = 0;
    if (userRole === 'admin') {
      const { count, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (!usersError) {
        usersCount = count || 0;
      }
    }

    // Get depot comparison (admin only)
    let depotComparison: any[] = [];
    if (userRole === 'admin') {
      const { data: depots, error: depotsError } = await supabase
        .from('fittings')
        .select('current_location');

      if (!depotsError && depots) {
        const depotMap = new Map<string, number>();
        depots.forEach(f => {
          if (f.current_location) {
            depotMap.set(f.current_location, (depotMap.get(f.current_location) || 0) + 1);
          }
        });

        depotComparison = Array.from(depotMap.entries()).map(([name, count]) => ({
          depotName: name,
          totalFittings: count,
          activeAlerts: 0, // Will be enhanced later
        }));
      }
    }

    return NextResponse.json({
      fittings: fittingsCount,
      inspections: inspectionsCount,
      recentInspections: recentInspectionsList,
      alerts: alertsCount,
      vendors: {
        top: topVendors,
      },
      warranty: warrantyStats,
      users: {
        total: usersCount,
      },
      depots: {
        total: depotComparison.length,
        comparison: depotComparison,
      },
      recentActivity: [], // Placeholder for depot manager activity
      recentUserActivity: [], // Placeholder for admin user activity
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
