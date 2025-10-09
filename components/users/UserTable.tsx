/**
 * User Table Component
 * Displays list of users with actions
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Shield, Warehouse, ClipboardCheck } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'inspector' | 'depot_manager' | 'admin';
  depot_location: string | null;
  phone: string | null;
  created_at: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'depot_manager':
        return <Warehouse className="h-4 w-4" />;
      case 'inspector':
        return <ClipboardCheck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'depot_manager':
        return 'Depot Manager';
      case 'inspector':
        return 'Inspector';
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'depot_manager':
        return 'secondary';
      case 'inspector':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Depot</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{user.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleBadgeVariant(user.role) as any} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {user.depot_location || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {user.phone || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
