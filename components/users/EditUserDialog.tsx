/**
 * Edit User Dialog Component
 * Form for updating existing users
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface User {
  id: string;
  email: string;
  name: string;
  role: 'inspector' | 'depot_manager' | 'admin';
  depot_location: string | null;
  phone: string | null;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onUserUpdated: () => void;
}

export function EditUserDialog({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    email: user.email,
    name: user.name,
    role: user.role,
    depot_location: user.depot_location || '',
    phone: user.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      depot_location: user.depot_location || '',
      phone: user.phone || '',
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details and permissions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as any })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspector">Inspector</SelectItem>
                <SelectItem value="depot_manager">Depot Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === 'depot_manager' && (
            <div className="space-y-2">
              <Label htmlFor="edit-depot_location">Depot Location *</Label>
              <Input
                id="edit-depot_location"
                value={formData.depot_location}
                onChange={(e) => setFormData({ ...formData, depot_location: e.target.value })}
                required
                placeholder="e.g., Mumbai Central"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 1234567890"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
