/**
 * Integration Settings Component
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Setting {
  key: string;
  value: any;
  description: string | null;
}

interface IntegrationSettingsProps {
  settings: Setting[];
  onSave: (updates: Array<{ key: string; value: any }>) => Promise<boolean>;
}

export function IntegrationSettings({ settings, onSave }: IntegrationSettingsProps) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* UDM Integration */}
      <Card>
        <CardHeader>
          <CardTitle>UDM Integration</CardTitle>
          <CardDescription>Configure Universal Data Management system integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable UDM Sync</Label>
              <p className="text-sm text-gray-500">Automatically sync data with UDM</p>
            </div>
            <Switch
              checked={formData.udm_sync_enabled || false}
              onCheckedChange={(checked) => setFormData({ ...formData, udm_sync_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="udm_api_url">API URL</Label>
            <Input
              id="udm_api_url"
              value={formData.udm_api_url || ''}
              onChange={(e) => setFormData({ ...formData, udm_api_url: e.target.value })}
              placeholder="https://api.udm.example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="udm_api_key">API Key</Label>
            <Input
              id="udm_api_key"
              type="password"
              value={formData.udm_api_key || ''}
              onChange={(e) => setFormData({ ...formData, udm_api_key: e.target.value })}
              placeholder="Enter API key"
            />
          </div>
        </CardContent>
      </Card>

      {/* TMS Integration */}
      <Card>
        <CardHeader>
          <CardTitle>TMS Integration</CardTitle>
          <CardDescription>Configure Track Management System integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable TMS Sync</Label>
              <p className="text-sm text-gray-500">Automatically sync data with TMS</p>
            </div>
            <Switch
              checked={formData.tms_sync_enabled || false}
              onCheckedChange={(checked) => setFormData({ ...formData, tms_sync_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tms_api_url">API URL</Label>
            <Input
              id="tms_api_url"
              value={formData.tms_api_url || ''}
              onChange={(e) => setFormData({ ...formData, tms_api_url: e.target.value })}
              placeholder="https://api.tms.example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tms_api_key">API Key</Label>
            <Input
              id="tms_api_key"
              type="password"
              value={formData.tms_api_key || ''}
              onChange={(e) => setFormData({ ...formData, tms_api_key: e.target.value })}
              placeholder="Enter API key"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
