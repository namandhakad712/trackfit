// User types
export type UserRole = 'depot_manager' | 'inspector' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  depot_location?: string;
  phone?: string;
  created_at: Date;
}

// Fitting types
export type PartType = 'elastic_rail_clip' | 'rail_pad' | 'liner' | 'sleeper';
export type FittingStatus = 'active' | 'under_inspection' | 'failed' | 'replaced';

export interface Fitting {
  id: string;
  qr_code: string;
  part_type: PartType;
  manufacturer: string;
  lot_number: string;
  supply_date: Date;
  warranty_months: number;
  warranty_expiry: Date;
  quantity: number;
  current_location: string;
  status: FittingStatus;
  created_by: string;
  created_at: Date;
  metadata?: Record<string, any>;
}

// Inspection types
export type InspectionType = 'manufacturing' | 'supply' | 'in_service' | 'maintenance';
export type InspectionStatus = 'pass' | 'fail' | 'needs_attention';

export interface Inspection {
  id: string;
  fitting_id: string;
  inspector_id: string;
  inspection_type: InspectionType;
  status: InspectionStatus;
  notes?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  images?: string[];
  timestamp: Date;
}

// Vendor types
export interface Vendor {
  id: string;
  vendor_code: string;
  vendor_name: string;
  total_supplies: number;
  total_inspections: number;
  failed_inspections: number;
  failure_rate: number;
  quality_score: number;
  last_sync: Date;
}

// Alert types
export type AlertType = 'warranty_expiry' | 'vendor_quality' | 'failure_prediction' | 'duplicate_inspection';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  fitting_id: string;
  alert_type: AlertType;
  severity: Severity;
  message: string;
  resolved: boolean;
  created_at: Date;
}

// Sync Log types
export type SyncType = 'udm' | 'tms';
export type SyncStatus = 'success' | 'failed';

export interface SyncLog {
  id: string;
  sync_type: SyncType;
  status: SyncStatus;
  records_synced: number;
  error_message?: string;
  timestamp: Date;
}
