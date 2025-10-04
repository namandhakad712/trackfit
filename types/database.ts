export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'depot_manager' | 'inspector' | 'admin'
          depot_location: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'depot_manager' | 'inspector' | 'admin'
          depot_location?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'depot_manager' | 'inspector' | 'admin'
          depot_location?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      fittings: {
        Row: {
          id: string
          qr_code: string
          part_type: 'elastic_rail_clip' | 'rail_pad' | 'liner' | 'sleeper'
          manufacturer: string
          lot_number: string
          supply_date: string
          warranty_months: number
          warranty_expiry: string
          quantity: number
          current_location: string
          status: 'active' | 'under_inspection' | 'failed' | 'replaced'
          created_by: string
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          qr_code: string
          part_type: 'elastic_rail_clip' | 'rail_pad' | 'liner' | 'sleeper'
          manufacturer: string
          lot_number: string
          supply_date: string
          warranty_months: number
          warranty_expiry: string
          quantity?: number
          current_location: string
          status?: 'active' | 'under_inspection' | 'failed' | 'replaced'
          created_by: string
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          qr_code?: string
          part_type?: 'elastic_rail_clip' | 'rail_pad' | 'liner' | 'sleeper'
          manufacturer?: string
          lot_number?: string
          supply_date?: string
          warranty_months?: number
          warranty_expiry?: string
          quantity?: number
          current_location?: string
          status?: 'active' | 'under_inspection' | 'failed' | 'replaced'
          created_by?: string
          created_at?: string
          metadata?: Json | null
        }
      }
      inspections: {
        Row: {
          id: string
          fitting_id: string
          inspector_id: string
          inspection_type: 'manufacturing' | 'supply' | 'in_service' | 'maintenance'
          status: 'pass' | 'fail' | 'needs_attention'
          notes: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          images: string[] | null
          timestamp: string
        }
        Insert: {
          id?: string
          fitting_id: string
          inspector_id: string
          inspection_type: 'manufacturing' | 'supply' | 'in_service' | 'maintenance'
          status: 'pass' | 'fail' | 'needs_attention'
          notes?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          images?: string[] | null
          timestamp?: string
        }
        Update: {
          id?: string
          fitting_id?: string
          inspector_id?: string
          inspection_type?: 'manufacturing' | 'supply' | 'in_service' | 'maintenance'
          status?: 'pass' | 'fail' | 'needs_attention'
          notes?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          images?: string[] | null
          timestamp?: string
        }
      }
      vendors: {
        Row: {
          id: string
          vendor_code: string
          vendor_name: string
          total_supplies: number
          total_inspections: number
          failed_inspections: number
          failure_rate: number
          quality_score: number
          last_sync: string
        }
        Insert: {
          id?: string
          vendor_code: string
          vendor_name: string
          total_supplies?: number
          total_inspections?: number
          failed_inspections?: number
          failure_rate?: number
          quality_score?: number
          last_sync?: string
        }
        Update: {
          id?: string
          vendor_code?: string
          vendor_name?: string
          total_supplies?: number
          total_inspections?: number
          failed_inspections?: number
          failure_rate?: number
          quality_score?: number
          last_sync?: string
        }
      }
      alerts: {
        Row: {
          id: string
          fitting_id: string
          alert_type: 'warranty_expiry' | 'vendor_quality' | 'failure_prediction' | 'duplicate_inspection'
          severity: 'low' | 'medium' | 'high' | 'critical'
          message: string
          resolved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          fitting_id: string
          alert_type: 'warranty_expiry' | 'vendor_quality' | 'failure_prediction' | 'duplicate_inspection'
          severity: 'low' | 'medium' | 'high' | 'critical'
          message: string
          resolved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          fitting_id?: string
          alert_type?: 'warranty_expiry' | 'vendor_quality' | 'failure_prediction' | 'duplicate_inspection'
          severity?: 'low' | 'medium' | 'high' | 'critical'
          message?: string
          resolved?: boolean
          created_at?: string
        }
      }
      sync_logs: {
        Row: {
          id: string
          sync_type: 'udm' | 'tms'
          status: 'success' | 'failed'
          records_synced: number
          error_message: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          sync_type: 'udm' | 'tms'
          status: 'success' | 'failed'
          records_synced?: number
          error_message?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          sync_type?: 'udm' | 'tms'
          status?: 'success' | 'failed'
          records_synced?: number
          error_message?: string | null
          timestamp?: string
        }
      }
    }
  }
}
