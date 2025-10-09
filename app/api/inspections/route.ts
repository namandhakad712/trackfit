import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { inspectionSchema } from '@/lib/validations/inspection';
import { NextRequest, NextResponse } from 'next/server';
import { 
  getAuthenticatedUser,
  unauthorizedResponse 
} from '@/lib/permissions/api';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user with role
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const fitting_id = searchParams.get('fitting_id');
    const inspector_id = searchParams.get('inspector_id');
    const status = searchParams.get('status');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    // Use service role client to bypass RLS for fetching inspections with user data
    const serviceRoleClient = createServiceRoleClient();
    
    let data, error;
    
    if (serviceRoleClient) {
      // Build query
      let query = serviceRoleClient
        .from('inspections')
        .select(`
          *,
          inspector:users!inspections_inspector_id_fkey(name, email),
          fitting:fittings(qr_code, part_type, manufacturer, current_location)
        `);

      // Apply role-based filtering
      if (user.role === 'inspector') {
        // Inspectors only see their own inspections
        query = query.eq('inspector_id', user.id);
      } else if (user.role === 'depot_manager' && user.depot_location) {
        // Depot managers only see inspections for fittings in their depot
        query = query.eq('fittings.current_location', user.depot_location);
      }
      // Admins see all inspections (no additional filter)

      // Apply additional filters
      if (fitting_id) {
        query = query.eq('fitting_id', fitting_id);
      }
      if (inspector_id) {
        query = query.eq('inspector_id', inspector_id);
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

      // Order by timestamp desc
      query = query.order('timestamp', { ascending: false });

      const result = await query;
      data = result.data;
      error = result.error;
    } else {
      // Fall back to regular client if service role key is not available
      const supabase = await createClient();
      
      // Build query - without user join due to RLS
      let query = supabase
        .from('inspections')
        .select(`
          *,
          fitting:fittings(qr_code, part_type, manufacturer, current_location)
        `);

      // Apply role-based filtering
      if (user.role === 'inspector') {
        query = query.eq('inspector_id', user.id);
      } else if (user.role === 'depot_manager' && user.depot_location) {
        query = query.eq('fittings.current_location', user.depot_location);
      }

      // Apply additional filters
      if (fitting_id) {
        query = query.eq('fitting_id', fitting_id);
      }
      if (inspector_id) {
        query = query.eq('inspector_id', inspector_id);
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

      // Order by timestamp desc
      query = query.order('timestamp', { ascending: false });

      const result = await query;
      data = result.data;
      error = result.error;
    }

    if (error) {
      throw error;
    }

    return NextResponse.json({
      inspections: data || [],
    });
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inspections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user with role (all roles can create inspections)
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();

    // Extract form fields
    const fitting_id = formData.get('fitting_id') as string;
    const inspection_type = formData.get('inspection_type') as string;
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string | null;
    const gps_latitude = formData.get('gps_latitude') ? parseFloat(formData.get('gps_latitude') as string) : null;
    const gps_longitude = formData.get('gps_longitude') ? parseFloat(formData.get('gps_longitude') as string) : null;

    // Validate data
    const validatedData = inspectionSchema.parse({
      fitting_id,
      inspection_type,
      status,
      notes: notes || undefined,
      gps_latitude: gps_latitude || undefined,
      gps_longitude: gps_longitude || undefined,
    });

    const supabase = await createClient();

    // Upload images to Supabase Storage
    const imageUrls: string[] = [];
    const imageKeys = Array.from(formData.keys()).filter(key => key.startsWith('image_'));
    
    for (const key of imageKeys) {
      const file = formData.get(key) as File;
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fitting_id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('inspection-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue; // Skip this image but continue with others
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('inspection-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }
    }

    // Use service role client for operations that might need to join with users table
    const serviceRoleClient = createServiceRoleClient();
    
    let result;
    if (serviceRoleClient) {
      // Insert inspection
      result = await serviceRoleClient
        .from('inspections')
        .insert({
          fitting_id: validatedData.fitting_id,
          inspector_id: user.id,
          inspection_type: validatedData.inspection_type,
          status: validatedData.status,
          notes: validatedData.notes || null,
          gps_latitude: validatedData.gps_latitude || null,
          gps_longitude: validatedData.gps_longitude || null,
          images: imageUrls.length > 0 ? imageUrls : null,
        } as any)
        .select()
        .single();
    } else {
      // Fall back to regular client if service role key is not available
      const supabase = await createClient();
      result = await supabase
        .from('inspections')
        .insert({
          fitting_id: validatedData.fitting_id,
          inspector_id: user.id,
          inspection_type: validatedData.inspection_type,
          status: validatedData.status,
          notes: validatedData.notes || null,
          gps_latitude: validatedData.gps_latitude || null,
          gps_longitude: validatedData.gps_longitude || null,
          images: imageUrls.length > 0 ? imageUrls : null,
        } as any)
        .select()
        .single();
    }
    
    const { data: inspection, error: insertError } = result;

    if (insertError) {
      throw insertError;
    }

    // Update fitting status if inspection failed
    if (validatedData.status === 'fail') {
      await supabase
        .from('fittings')
        .update({ status: 'failed' })
        .eq('id', validatedData.fitting_id);
    }

    // Update vendor metrics
    const { data: fitting } = await supabase
      .from('fittings')
      .select('manufacturer')
      .eq('id', validatedData.fitting_id)
      .single();

    if (fitting) {
      // Get or create vendor record
      const { data: vendor } = await supabase
        .from('vendors')
        .select('*')
        .eq('vendor_name', fitting.manufacturer)
        .single();

      if (vendor) {
        // Update vendor metrics
        const updatedMetrics = {
          total_inspections: vendor.total_inspections + 1,
          failed_inspections: validatedData.status === 'fail' 
            ? vendor.failed_inspections + 1 
            : vendor.failed_inspections,
        };

        // Calculate new failure rate and quality score
        const failure_rate = updatedMetrics.total_inspections > 0
          ? (updatedMetrics.failed_inspections / updatedMetrics.total_inspections) * 100
          : 0;

        const quality_score = 100 - (failure_rate * 2);

        await supabase
          .from('vendors')
          .update({
            total_inspections: updatedMetrics.total_inspections,
            failed_inspections: updatedMetrics.failed_inspections,
            failure_rate: parseFloat(failure_rate.toFixed(2)),
            quality_score: parseFloat(Math.max(0, Math.min(100, quality_score)).toFixed(2)),
          })
          .eq('id', vendor.id);
      }
    }

    // Trigger AI alert analysis (async, don't wait for completion)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate' }),
    }).catch(err => console.error('Alert generation failed:', err));

    // Trigger mock TMS sync (async, don't wait for completion)
    const { data: fittingData } = await supabase
      .from('fittings')
      .select('current_location')
      .eq('id', validatedData.fitting_id)
      .single();

    if (fittingData) {
      const trackSection = fittingData.current_location.toUpperCase().replace(/[^A-Z0-9-]/g, '-');
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/sync/tms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_section: trackSection }),
      }).catch(err => console.error('TMS sync failed:', err));
    }

    return NextResponse.json({
      inspection,
      message: 'Inspection logged successfully',
    });
  } catch (error) {
    console.error('Error creating inspection:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    );
  }
}
