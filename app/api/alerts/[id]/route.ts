import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type AlertData = {
  id: string;
  fitting_id: string;
  alert_type: string;
  severity: string;
  message: string;
  resolved: boolean;
  created_at: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { resolved } = body;

    if (typeof resolved !== 'boolean') {
      return NextResponse.json(
        { error: 'resolved must be a boolean' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Type-safe update with explicit typing
    const updateData: Partial<AlertData> = { resolved };
    
    const { data: alert, error } = await (supabase
      .from('alerts')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single() as unknown as Promise<{ data: AlertData | null; error: any }>);

    if (error) {
      throw error;
    }

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      alert,
      message: resolved ? 'Alert resolved' : 'Alert reopened',
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
