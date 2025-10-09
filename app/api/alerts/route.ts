import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { 
  validateApiPermission,
  forbiddenResponse 
} from '@/lib/permissions/api';

export async function GET(request: NextRequest) {
  try {
    // Validate user has permission to view alerts (depot_manager and admin only)
    const validation = await validateApiPermission(request, ['depot_manager', 'admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error);
    }

    const user = validation.user!;
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    const severity = searchParams.get('severity');
    const alert_type = searchParams.get('alert_type');

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('alerts')
      .select(`
        *,
        fitting:fittings(qr_code, part_type, manufacturer, current_location)
      `);

    // Apply depot-based filtering for depot managers
    if (user.role === 'depot_manager' && user.depot_location) {
      query = query.eq('fittings.current_location', user.depot_location);
    }
    // Admins see all alerts (no additional filter)

    // Apply filters
    if (resolved !== null) {
      query = query.eq('resolved', resolved === 'true');
    }
    if (severity) {
      query = query.eq('severity', severity);
    }
    if (alert_type) {
      query = query.eq('alert_type', alert_type);
    }

    // Order by severity and created_at
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      alerts: data || [],
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
