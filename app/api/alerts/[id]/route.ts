import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { Alert } from '@/types';

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

    const { data: alert, error } = await supabase
      .from('alerts')
      .update({ resolved })
      .eq('id', params.id)
      .select()
      .single();

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
