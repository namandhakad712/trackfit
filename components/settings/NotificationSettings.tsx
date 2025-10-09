/**
 * Notification Settings Component
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

interface NotificationSettingsProps {
  settings: Setting[];
  onSave: (updates: Array<{ key: string; value: any }>) => Promise<boolean>;
}

export function NotificationSettings({ settings, onSave }: NotificationSettingsProps) {
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
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure notification preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={formData.email_notifications || false}
              onCheckedChange={(checked) => setFormData({ ...formData, email_notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Notifications</Label>
              <p className="text-sm text-gray-500">Receive critical alert notifications</p>
            </div>
            <Switch
              checked={formData.alert_notifications || false}
              onCheckedChange={(checked) => setFormData({ ...formData, alert_notifications: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification_email">Notification Email</Label>
            <Input
              id="notification_email"
              type="email"
              value={formData.notification_email || ''}
              onChange={(e) => setFormData({ ...formData, notification_email: e.target.value })}
              placeholder="admin@example.com"
            />
            <p className="text-sm text-gray-500">Email address to receive system notifications</p>
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
