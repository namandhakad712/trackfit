/**
 * Users Management Page
 * Admin-only page for managing system users
 */

'use client';

import { useEffect, useState } from 'react';
import { UserTable } from '@/components/users/UserTable';
import { AddUserDialog } from '@/components/users/AddUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'inspector' | 'depot_manager' | 'admin';
  depot_location: string | null;
  phone: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAdded = () => {
    setIsAddDialogOpen(false);
    fetchUsers();
  };

  const handleUserUpdated = () => {
    setEditingUser(null);
    fetchUsers();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Add User Dialog */}
      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onUserAdded={handleUserAdded}
      />

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}
