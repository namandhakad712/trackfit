import { z } from 'zod';

export const inspectionSchema = z.object({
  fitting_id: z.string().uuid('Invalid fitting ID'),
  inspection_type: z.enum(['manufacturing', 'supply', 'in_service', 'maintenance'], {
    required_error: 'Please select an inspection type',
  }),
  status: z.enum(['pass', 'fail', 'needs_attention'], {
    required_error: 'Please select a status',
  }),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  gps_latitude: z.number().min(-90).max(90).optional(),
  gps_longitude: z.number().min(-180).max(180).optional(),
  images: z.array(z.string()).max(5, 'Maximum 5 images allowed').optional(),
});

export type InspectionFormData = z.infer<typeof inspectionSchema>;
