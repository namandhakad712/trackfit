import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { fittingSchema } from '@/lib/validations/fitting';
import { generateQRCode } from '@/lib/utils/qrGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { addMonths } from 'date-fns';
import { 
  validateApiPermission, 
  getAuthenticatedUser,
  forbiddenResponse,
  unauthorizedResponse 
} from '@/lib/permissions/api';

export async function GET(request: NextRequest) {
  try {
    // Validate user has permission to view fittings
    const validation = await validateApiPermission(request, ['depot_manager', 'admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error);
    }

    const user = validation.user!;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const part_type = searchParams.get('part_type');
    const manufacturer = searchParams.get('manufacturer');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('fittings')
      .select('*', { count: 'exact' });

    // Apply depot-based filtering for depot managers
    if (user.role === 'depot_manager' && user.depot_location) {
      query = query.eq('current_location', user.depot_location);
    }

    // Apply filters
    if (part_type) {
      query = query.eq('part_type', part_type);
    }
    if (manufacturer) {
      query = query.ilike('manufacturer', `%${manufacturer}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`qr_code.ilike.%${search}%,manufacturer.ilike.%${search}%,lot_number.ilike.%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      fittings: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching fittings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fittings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate user has permission to create fittings
    const validation = await validateApiPermission(request, ['depot_manager', 'admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error);
    }

    const user = validation.user!;
    const body = await request.json();

    // Validate request body
    const validatedData = fittingSchema.parse(body);

    const supabase = await createClient();

    // Auto-set current_location for depot managers to their depot
    let currentLocation = validatedData.current_location;
    if (user.role === 'depot_manager' && user.depot_location) {
      currentLocation = user.depot_location;
    }

    // Generate unique QR code
    const qrCode = generateQRCode({
      part_type: validatedData.part_type,
      manufacturer: validatedData.manufacturer,
      lot_number: validatedData.lot_number,
      timestamp: Date.now(),
    });

    // Check for duplicate QR code
    const { data: existing } = await supabase
      .from('fittings')
      .select('id')
      .eq('qr_code', qrCode)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'QR code already exists. Please try again.' },
        { status: 400 }
      );
    }

    // Calculate warranty expiry
    const supplyDate = new Date(validatedData.supply_date);
    const warrantyExpiry = addMonths(supplyDate, validatedData.warranty_months);

    // Use service role client to bypass RLS policies that may have infinite recursion
    const serviceRoleSupabase = createServiceRoleClient();
    
    let result;
    if (serviceRoleSupabase) {
      // Use service role client to bypass RLS and insert fitting
      result = await serviceRoleSupabase
        .from('fittings')
        .insert({
          qr_code: qrCode,
          part_type: validatedData.part_type,
          manufacturer: validatedData.manufacturer,
          lot_number: validatedData.lot_number,
          supply_date: validatedData.supply_date,
          warranty_months: validatedData.warranty_months,
          warranty_expiry: warrantyExpiry.toISOString().split('T')[0],
          quantity: validatedData.quantity,
          current_location: currentLocation,
          status: 'active',
          created_by: user.id,
        })
        .select()
        .single();
    } else {
      // Fall back to regular client if service role key is not available
      const supabase = await createClient();
      result = await supabase
        .from('fittings')
        .insert({
          qr_code: qrCode,
          part_type: validatedData.part_type,
          manufacturer: validatedData.manufacturer,
          lot_number: validatedData.lot_number,
          supply_date: validatedData.supply_date,
          warranty_months: validatedData.warranty_months,
          warranty_expiry: warrantyExpiry.toISOString().split('T')[0],
          quantity: validatedData.quantity,
          current_location: currentLocation,
          status: 'active',
          created_by: user.id,
        })
        .select()
        .single();
    }

    const { data: fitting, error } = result;

    if (error) {
      console.error('Error creating fitting:', error);
      throw error;
    }

    // Trigger mock UDM sync (async, don't wait for completion)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/sync/udm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendor_code: validatedData.manufacturer.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '') }),
    }).catch(err => console.error('UDM sync failed:', err));

    return NextResponse.json({
      fitting,
      qr_code: qrCode,
    });
  } catch (error) {
    console.error('Error creating fitting:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create fitting' },
      { status: 500 }
    );
  }
}
