import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Fetch fitting details
    const { data: fitting, error: fittingError } = await supabase
      .from('fittings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fittingError || !fitting) {
      return NextResponse.json(
        { error: 'Fitting not found' },
        { status: 404 }
      );
    }

    // Use service role client for fetching inspections with user data to bypass RLS
    const serviceRoleSupabase = createServiceRoleClient();
    
    let inspections, alerts;
    
    if (serviceRoleSupabase) {
      // Fetch related inspections
      const inspectionsResult = await serviceRoleSupabase
        .from('inspections')
        .select(`
          *,
          inspector:users!inspections_inspector_id_fkey(name, email)
        `)
        .eq('fitting_id', params.id)
        .order('timestamp', { ascending: false });
      
      inspections = inspectionsResult.data || [];
      
      // Fetch related alerts
      const alertsResult = await serviceRoleSupabase
        .from('alerts')
        .select('*')
        .eq('fitting_id', params.id)
        .order('created_at', { ascending: false });
      
      alerts = alertsResult.data || [];
    } else {
      // Fall back to regular client if service role key is not available
      const supabase = await createClient();
      
      // Fetch related inspections (without user join due to RLS)
      const inspectionsResult = await supabase
        .from('inspections')
        .select('*')
        .eq('fitting_id', params.id)
        .order('timestamp', { ascending: false });
      
      inspections = inspectionsResult.data || [];
      
      // Fetch related alerts
      const alertsResult = await supabase
        .from('alerts')
        .select('*')
        .eq('fitting_id', params.id)
        .order('created_at', { ascending: false });
      
      alerts = alertsResult.data || [];
    }

    return NextResponse.json({
      fitting,
      inspections: inspections || [],
      alerts: alerts || [],
    });
  } catch (error) {
    console.error('Error fetching fitting details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fitting details' },
      { status: 500 }
    );
  }
}
