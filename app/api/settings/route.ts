/**
 * Settings Management API
 * Admin-only endpoints for managing system settings
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { 
  validateApiPermission,
  forbiddenResponse,
  serverErrorResponse 
} from '@/lib/permissions/api';

/**
 * GET /api/settings - Fetch all settings
 */
export async function GET(request: NextRequest) {
  try {
    // Validate admin permission
    const validation = await validateApiPermission(request, ['admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error || 'Admin access required');
    }

    const supabase = await createClient();

    // Fetch all settings
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }

    // Group settings by category
    const groupedSettings: Record<string, any[]> = {};
    (settings || []).forEach((setting) => {
      if (!groupedSettings[setting.category]) {
        groupedSettings[setting.category] = [];
      }
      groupedSettings[setting.category].push(setting);
    });

    return NextResponse.json({
      settings: settings || [],
      grouped: groupedSettings,
    });
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return serverErrorResponse('Failed to fetch settings');
  }
}

/**
 * PUT /api/settings - Update settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Validate admin permission
    const validation = await validateApiPermission(request, ['admin']);
    
    if (!validation.authorized) {
      return forbiddenResponse(validation.error || 'Admin access required');
    }

    const user = validation.user!;
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Invalid request: updates array required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update each setting
    const results = [];
    for (const update of updates) {
      const { key, value } = update;

      if (!key) {
        continue;
      }

      const { data, error } = await supabase
        .from('settings')
        .update({
          value,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq('key', key)
        .select()
        .single();

      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        results.push({ key, success: false, error: error.message });
      } else {
        results.push({ key, success: true, data });
      }
    }

    return NextResponse.json({
      message: 'Settings updated',
      results,
    });
  } catch (error) {
    console.error('Error in PUT /api/settings:', error);
    return serverErrorResponse('Failed to update settings');
  }
}
