import { z } from 'zod';

export const fittingSchema = z.object({
  part_type: z.enum(['elastic_rail_clip', 'rail_pad', 'liner', 'sleeper'], {
    required_error: 'Please select a part type',
  }),
  manufacturer: z.string().min(2, 'Manufacturer name must be at least 2 characters'),
  lot_number: z.string().min(1, 'Lot number is required'),
  supply_date: z.string().refine((date) => {
    const supplyDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return supplyDate <= today;
  }, 'Supply date cannot be in the future'),
  warranty_months: z.number()
    .min(1, 'Warranty must be at least 1 month')
    .max(120, 'Warranty cannot exceed 120 months'),
  quantity: z.number()
    .min(1, 'Quantity must be at least 1')
    .default(1),
  current_location: z.string().min(2, 'Location must be at least 2 characters'),
});

export type FittingFormData = z.infer<typeof fittingSchema>;
