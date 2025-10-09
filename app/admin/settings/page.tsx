'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
// import { MapOverlaysSettings } from '@/components/admin/settings/MapOverlaysSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Map, Users, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>

        <Tabs defaultValue="overlays" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overlays" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map Overlays
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overlays">
            <Card>
              <CardHeader>
                <CardTitle>Map Overlays</CardTitle>
                <CardDescription>
                  Map overlay feature coming soon
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure system-wide general settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">General settings will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification settings will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}