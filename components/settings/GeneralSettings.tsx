/**
 * General Settings Component
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Setting {
  key: string;
  value: any;
  description: string | null;
}

interface GeneralSettingsProps {
  settings: Setting[];
  onSave: (updates: Array<{ key: string; value: any }>) => Promise<boolean>;
}

export function GeneralSettings({ settings, onSave }: GeneralSettingsProps) {
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
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure basic application settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app_name">Application Name</Label>
            <Input
              id="app_name"
              value={formData.app_name || ''}
              onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_timezone">Timezone</Label>
            <Input
              id="app_timezone"
              value={formData.app_timezone || ''}
              onChange={(e) => setFormData({ ...formData, app_timezone: e.target.value })}
              placeholder="Asia/Kolkata"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_language">Language</Label>
            <Input
              id="app_language"
              value={formData.app_language || ''}
              onChange={(e) => setFormData({ ...formData, app_language: e.target.value })}
              placeholder="en"
            />
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
