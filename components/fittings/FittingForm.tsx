'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fittingSchema, type FittingFormData } from '@/lib/validations/fitting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PART_TYPES } from '@/lib/constants';
import { addMonths, format } from 'date-fns';

interface FittingFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function FittingForm({ onSuccess, onError }: FittingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warrantyExpiry, setWarrantyExpiry] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FittingFormData>({
    resolver: zodResolver(fittingSchema),
    defaultValues: {
      quantity: 1,
      warranty_months: 12,
    },
  });

  const supplyDate = watch('supply_date');
  const warrantyMonths = watch('warranty_months');

  // Calculate warranty expiry preview
  useEffect(() => {
    if (supplyDate && warrantyMonths) {
      try {
        const supply = new Date(supplyDate);
        const expiry = addMonths(supply, warrantyMonths);
        setWarrantyExpiry(format(expiry, 'PPP'));
      } catch (error) {
        setWarrantyExpiry('');
      }
    } else {
      setWarrantyExpiry('');
    }
  }, [supplyDate, warrantyMonths]);

  const onSubmit = async (data: FittingFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/fittings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create fitting');
      }

      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Fitting</CardTitle>
        <CardDescription>
          Create a new track fitting record with QR code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Part Type */}
            <div className="space-y-2">
              <Label htmlFor="part_type">Part Type</Label>
              <Select
                onValueChange={(value) => setValue('part_type', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select part type" />
                </SelectTrigger>
                <SelectContent>
                  {PART_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.part_type && (
                <p className="text-sm text-red-500">{errors.part_type.message}</p>
              )}
            </div>

            {/* Manufacturer */}
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                type="text"
                placeholder="ABC Industries"
                {...register('manufacturer')}
                disabled={isSubmitting}
              />
              {errors.manufacturer && (
                <p className="text-sm text-red-500">{errors.manufacturer.message}</p>
              )}
            </div>

            {/* Lot Number */}
            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number</Label>
              <Input
                id="lot_number"
                type="text"
                placeholder="LOT123"
                {...register('lot_number')}
                disabled={isSubmitting}
              />
              {errors.lot_number && (
                <p className="text-sm text-red-500">{errors.lot_number.message}</p>
              )}
            </div>

            {/* Supply Date */}
            <div className="space-y-2">
              <Label htmlFor="supply_date">Supply Date</Label>
              <Input
                id="supply_date"
                type="date"
                max={format(new Date(), 'yyyy-MM-dd')}
                {...register('supply_date')}
                disabled={isSubmitting}
              />
              {errors.supply_date && (
                <p className="text-sm text-red-500">{errors.supply_date.message}</p>
              )}
            </div>

            {/* Warranty Months */}
            <div className="space-y-2">
              <Label htmlFor="warranty_months">Warranty (Months)</Label>
              <Input
                id="warranty_months"
                type="number"
                min="1"
                max="120"
                placeholder="12"
                {...register('warranty_months', { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.warranty_months && (
                <p className="text-sm text-red-500">{errors.warranty_months.message}</p>
              )}
              {warrantyExpiry && (
                <p className="text-sm text-muted-foreground">
                  Expires: {warrantyExpiry}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                {...register('quantity', { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity.message}</p>
              )}
            </div>

            {/* Current Location */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="current_location">Current Location</Label>
              <Input
                id="current_location"
                type="text"
                placeholder="Delhi Depot - Section A"
                {...register('current_location')}
                disabled={isSubmitting}
              />
              {errors.current_location && (
                <p className="text-sm text-red-500">{errors.current_location.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? 'Creating...' : 'Create Fitting'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
