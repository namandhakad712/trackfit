import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
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
