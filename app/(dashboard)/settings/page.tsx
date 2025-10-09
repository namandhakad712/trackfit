/**
 * Settings Page
 * Admin-only page for managing system settings
 */

'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { IntegrationSettings } from '@/components/settings/IntegrationSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { DefaultSettings } from '@/components/settings/DefaultSettings';

interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (updates: Array<{ key: string; value: any }>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      await fetchSettings();
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const generalSettings = settings.filter(s => s.category === 'general');
  const integrationSettings = settings.filter(s => s.category === 'integrations');
  const notificationSettings = settings.filter(s => s.category === 'notifications');
  const defaultSettings = settings.filter(s => s.category === 'defaults');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage system configuration and preferences</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="defaults">Defaults</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings
            settings={generalSettings}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings
            settings={integrationSettings}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            settings={notificationSettings}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        <TabsContent value="defaults">
          <DefaultSettings
            settings={defaultSettings}
            onSave={handleSaveSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
