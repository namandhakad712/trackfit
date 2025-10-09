/**
 * Default Settings Component
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Setting {
  key: string;
  value: any;
  description: string | null;
}

interface DefaultSettingsProps {
  settings: Setting[];
  onSave: (updates: Array<{ key: string; value: any }>) => Promise<boolean>;
}

export function DefaultSettings({ settings, onSave }: DefaultSettingsProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = {};
    settings.forEach(s => {
      data[s.key] = s.value;
    });
    return data;
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updates = Object.keys(formData).map(key => ({
        key,
        value: formData[key],
      }));

      await onSave(updates);
      alert('Settings saved successfully');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Settings</CardTitle>
        <CardDescription>Configure default values for new records</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default_warranty_months">Default Warranty Period (months)</Label>
            <Input
              id="default_warranty_months"
              type="number"
              value={formData.default_warranty_months || 24}
              onChange={(e) => setFormData({ ...formData, default_warranty_months: parseInt(e.target.value) })}
              min={1}
              max={120}
            />
            <p className="text-sm text-gray-500">Default warranty period for new fittings</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_inspection_type">Default Inspection Type</Label>
            <Select
              value={formData.default_inspection_type || 'in_service'}
              onValueChange={(value) => setFormData({ ...formData, default_inspection_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select inspection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="supply">Supply</SelectItem>
                <SelectItem value="in_service">In Service</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">Default inspection type for new inspections</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
