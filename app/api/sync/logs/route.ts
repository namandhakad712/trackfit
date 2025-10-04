import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sync_type = searchParams.get('sync_type');
    const status = searchParams.get('status');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const limit = searchParams.get('limit') || '50';

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('sync_logs')
      .select('*');

    // Apply filters
    if (sync_type) {
      query = query.eq('sync_type', sync_type);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (start_date) {
      query = query.gte('timestamp', start_date);
    }
    if (end_date) {
      query = query.lte('timestamp', end_date);
    }

    // Order by timestamp desc and limit
    query = query
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit));

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate summary statistics
    const summary = {
      total_syncs: data?.length || 0,
      successful_syncs: data?.filter(log => log.status === 'success').length || 0,
      failed_syncs: data?.filter(log => log.status === 'failed').length || 0,
      udm_syncs: data?.filter(log => log.sync_type === 'udm').length || 0,
      tms_syncs: data?.filter(log => log.sync_type === 'tms').length || 0,
    };

    return NextResponse.json({
      logs: data || [],
      summary,
    });
  } catch (error) {
    console.error('Error fetching sync logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync logs' },
      { status: 500 }
    );
  }
}
