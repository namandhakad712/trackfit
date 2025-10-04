import { createClient } from '@/lib/supabase/server';
import { fetchMockTMSData, validateTrackSection } from '@/lib/integrations/mockTMS';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { track_section } = body;

    if (!track_section) {
      return NextResponse.json(
        { error: 'track_section is required' },
        { status: 400 }
      );
    }

    // Validate track section format
    if (!validateTrackSection(track_section)) {
      return NextResponse.json(
        { error: 'Invalid track section format. Must be 3-20 alphanumeric characters with hyphens.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    try {
      // Fetch mock TMS data
      const tmsData = await fetchMockTMSData(track_section);

      // Store TMS data for reference (could be in a separate table if needed)
      // For now, we'll just log the sync operation with the data in metadata

      // Log sync operation with TMS data
      await supabase
        .from('sync_logs')
        .insert({
          sync_type: 'tms',
          status: 'success',
          records_synced: 1,
          error_message: null,
        });

      return NextResponse.json({
        success: true,
        message: 'TMS sync completed successfully',
        data: tmsData,
      });
    } catch (error) {
      // Log failed sync
      await supabase
        .from('sync_logs')
        .insert({
          sync_type: 'tms',
          status: 'failed',
          records_synced: 0,
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });

      throw error;
    }
  } catch (error) {
    console.error('Error syncing with TMS:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync with TMS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
