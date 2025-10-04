import { createClient } from '@/lib/supabase/server';
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

    // Fetch related inspections
    const { data: inspections } = await supabase
      .from('inspections')
      .select(`
        *,
        inspector:users!inspections_inspector_id_fkey(name, email)
      `)
      .eq('fitting_id', params.id)
      .order('timestamp', { ascending: false });

    // Fetch related alerts
    const { data: alerts } = await supabase
      .from('alerts')
      .select('*')
      .eq('fitting_id', params.id)
      .order('created_at', { ascending: false });

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
