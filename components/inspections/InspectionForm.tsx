'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inspectionSchema, type InspectionFormData } from '@/lib/validations/inspection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INSPECTION_TYPES, INSPECTION_STATUSES, MAX_IMAGES_PER_INSPECTION, MAX_IMAGE_SIZE_MB } from '@/lib/constants';
import { MapPin, Upload, X, Image as ImageIcon } from 'lucide-react';

interface InspectionFormProps {
  fittingId: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function InspectionForm({ fittingId, onSuccess, onError }: InspectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsError, setGpsError] = useState<string>('');
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      fitting_id: fittingId,
    },
  });

  const notes = watch('notes');
  const notesLength = notes?.length || 0;

  // Auto-capture GPS on mount
  useEffect(() => {
    captureGPS();
  }, []);

  const captureGPS = async () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    setIsCapturingGPS(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setGpsLocation(location);
        setValue('gps_latitude', location.latitude);
        setValue('gps_longitude', location.longitude);
        setIsCapturingGPS(false);
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsError('Unable to get location. You can enter it manually if needed.');
        setIsCapturingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError('');

    // Check total number of images
    if (imageFiles.length + files.length > MAX_IMAGES_PER_INSPECTION) {
      setUploadError(`Maximum ${MAX_IMAGES_PER_INSPECTION} images allowed`);
      return;
    }

    // Validate each file
    for (const file of files) {
      // Check file size
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setUploadError(`Image ${file.name} exceeds ${MAX_IMAGE_SIZE_MB}MB limit`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError(`${file.name} is not an image file`);
        return;
      }
    }

    // Add files and create previews
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setUploadError('');
  };

  const onSubmit = async (data: InspectionFormData) => {
    try {
      setIsSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('fitting_id', data.fitting_id);
      formData.append('inspection_type', data.inspection_type);
      formData.append('status', data.status);
      if (data.notes) formData.append('notes', data.notes);
      if (data.gps_latitude) formData.append('gps_latitude', data.gps_latitude.toString());
      if (data.gps_longitude) formData.append('gps_longitude', data.gps_longitude.toString());

      // Add image files
      imageFiles.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });

      const response = await fetch('/api/inspections', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create inspection');
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
        <CardTitle>Log Inspection</CardTitle>
        <CardDescription>
          Record inspection details for this fitting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inspection Type */}
            <div className="space-y-2">
              <Label htmlFor="inspection_type">Inspection Type</Label>
              <Select
                onValueChange={(value) => setValue('inspection_type', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select inspection type" />
                </SelectTrigger>
                <SelectContent>
                  {INSPECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.inspection_type && (
                <p className="text-sm text-red-500">{errors.inspection_type.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue('status', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {INSPECTION_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* GPS Location */}
          <div className="space-y-2">
            <Label>GPS Location</Label>
            <div className="flex items-center gap-2">
              {isCapturingGPS ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Capturing location...
                </div>
              ) : gpsLocation ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {gpsLocation.latitude.toFixed(6)}, {gpsLocation.longitude.toFixed(6)}
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={captureGPS}
                    disabled={isSubmitting}
                  >
                    Recapture
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={captureGPS}
                  disabled={isSubmitting}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Capture Location
                </Button>
              )}
            </div>
            {gpsError && (
              <p className="text-sm text-amber-600">{gpsError}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add any additional notes about this inspection..."
              {...register('notes')}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Optional inspection notes</span>
              <span>{notesLength}/1000</span>
            </div>
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Images (Optional)</Label>
            <div className="space-y-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {imageFiles.length < MAX_IMAGES_PER_INSPECTION && (
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Upload Images</p>
                      <p className="text-xs text-muted-foreground">
                        {imageFiles.length}/{MAX_IMAGES_PER_INSPECTION} images • Max {MAX_IMAGE_SIZE_MB}MB each
                      </p>
                    </div>
                  </Label>
                </div>
              )}

              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
