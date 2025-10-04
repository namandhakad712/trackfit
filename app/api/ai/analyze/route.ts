import { createClient } from '@/lib/supabase/server';
import { runAlertEngine, createAlerts, type AlertContext } from '@/lib/ai/alertEngine';
import { NextResponse } from 'next/server';

type FittingData = {
  id: string;
  qr_code: string;
  part_type: string;
  manufacturer: string;
  lot_number: string;
  warranty_expiry: string;
  created_at: string;
};

type InspectionData = {
  id: string;
  status: string;
  timestamp: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fitting_id, inspection_id } = body;

    if (!fitting_id) {
      return NextResponse.json(
        { error: 'fitting_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch fitting details
    const { data: fitting, error: fittingError } = await supabase
      .from('fittings')
      .select('*')
      .eq('id', fitting_id)
      .single<FittingData>();

    if (fittingError || !fitting) {
      return NextResponse.json(
        { error: 'Fitting not found' },
        { status: 404 }
      );
    }

    // Fetch current inspection if provided
    let currentInspection: InspectionData | null = null;
    if (inspection_id) {
      const { data } = await supabase
        .from('inspections')
        .select('*')
        .eq('id', inspection_id)
        .single<InspectionData>();
      currentInspection = data;
    }

    // Fetch recent inspections for this fitting (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: recentInspections } = await supabase
      .from('inspections')
      .select('id, status, timestamp')
      .eq('fitting_id', fitting_id)
      .gte('timestamp', sixMonthsAgo.toISOString())
      .order('timestamp', { ascending: false });

    // Fetch inspections for the same lot
    const { data: lotInspections } = await supabase
      .from('inspections')
      .select(`
        id,
        status,
        fitting:fittings!inner(lot_number)
      `)
      .eq('fittings.lot_number', fitting.lot_number);

    // Fetch vendor data
    const { data: vendor } = await supabase
      .from('vendors')
      .select('vendor_code, vendor_name, failure_rate')
      .eq('vendor_code', fitting.manufacturer)
      .single();

    // Build alert context
    const context: AlertContext = {
      fitting: {
        id: fitting.id,
        qr_code: fitting.qr_code,
        part_type: fitting.part_type,
        manufacturer: fitting.manufacturer,
        lot_number: fitting.lot_number,
        warranty_expiry: fitting.warranty_expiry,
        created_at: fitting.created_at,
      },
      inspection: currentInspection || undefined,
      vendor: vendor || undefined,
      recentInspections: recentInspections || [],
      lotInspections: lotInspections?.map((li: any) => ({
        id: li.id,
        status: li.status,
        lot_number: li.fitting.lot_number,
      })) || [],
    };

    // Run alert engine
    const generatedAlerts = runAlertEngine(context);

    // Save alerts to database
    if (generatedAlerts.length > 0) {
      await createAlerts(supabase, generatedAlerts);
    }

    return NextResponse.json({
      alerts: generatedAlerts,
      message: `Generated ${generatedAlerts.length} alert(s)`,
    });
  } catch (error) {
    console.error('Error analyzing fitting:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze fitting' },
      { status: 500 }
    );
  }
}
