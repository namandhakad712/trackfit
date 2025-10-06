'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminInspectionDashboard } from '@/components/admin/AdminInspectionDashboard';

export default function AdminInspectionLogsPage() {
  return (
    <AdminGuard>
      <div className="container py-6">
        <AdminInspectionDashboard />
      </div>
    </AdminGuard>
  );
}