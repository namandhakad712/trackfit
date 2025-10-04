export const PART_TYPES = [
  { value: 'elastic_rail_clip', label: 'Elastic Rail Clip' },
  { value: 'rail_pad', label: 'Rail Pad' },
  { value: 'liner', label: 'Liner' },
  { value: 'sleeper', label: 'Sleeper' },
] as const;

export const INSPECTION_TYPES = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'supply', label: 'Supply' },
  { value: 'in_service', label: 'In-Service' },
  { value: 'maintenance', label: 'Maintenance' },
] as const;

export const INSPECTION_STATUSES = [
  { value: 'pass', label: 'Pass' },
  { value: 'fail', label: 'Fail' },
  { value: 'needs_attention', label: 'Needs Attention' },
] as const;

export const USER_ROLES = [
  { value: 'depot_manager', label: 'Depot Manager' },
  { value: 'inspector', label: 'Inspector' },
  { value: 'admin', label: 'Admin' },
] as const;

export const FITTING_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'under_inspection', label: 'Under Inspection' },
  { value: 'failed', label: 'Failed' },
  { value: 'replaced', label: 'Replaced' },
] as const;

export const ALERT_SEVERITIES = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
] as const;

export const MAX_IMAGES_PER_INSPECTION = 5;
export const MAX_IMAGE_SIZE_MB = 5;
export const ITEMS_PER_PAGE = 50;
