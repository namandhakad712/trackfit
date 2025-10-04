import { createClient } from '@/lib/supabase/server';
import { fetchMockUDMData, validateVendorCode } from '@/lib/integrations/mockUDM';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendor_code } = body;

    if (!vendor_code) {
      return NextResponse.json(
        { error: 'vendor_code is required' },
        { status: 400 }
      );
    }

    // Validate vendor code format
    if (!validateVendorCode(vendor_code)) {
      return NextResponse.json(
        { error: 'Invalid vendor code format. Must be 3-10 alphanumeric characters.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    try {
      // Fetch mock UDM data
      const udmData = await fetchMockUDMData(vendor_code);

      // Update or create vendor record
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('vendor_code', vendor_code)
        .single();

      if (existingVendor) {
        // Update existing vendor
        await supabase
          .from('vendors')
          .update({
            vendor_name: udmData.vendor_name,
            total_supplies: udmData.total_orders,
            last_sync: new Date().toISOString(),
          })
          .eq('vendor_code', vendor_code);
      } else {
        // Create new vendor
        await supabase
          .from('vendors')
          .insert({
            vendor_code: udmData.vendor_code,
            vendor_name: udmData.vendor_name,
            total_supplies: udmData.total_orders,
            total_inspections: 0,
            failed_inspections: 0,
            failure_rate: 0,
            quality_score: 100,
            last_sync: new Date().toISOString(),
          });
      }

      // Log sync operation
      await supabase
        .from('sync_logs')
        .insert({
          sync_type: 'udm',
          status: 'success',
          records_synced: 1,
          error_message: null,
        });

      return NextResponse.json({
        success: true,
        message: 'UDM sync completed successfully',
        data: udmData,
      });
    } catch (error) {
      // Log failed sync
      await supabase
        .from('sync_logs')
        .insert({
          sync_type: 'udm',
          status: 'failed',
          records_synced: 0,
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });

      throw error;
    }
  } catch (error) {
    console.error('Error syncing with UDM:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync with UDM',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
