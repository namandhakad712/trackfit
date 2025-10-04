'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold">RailTrack QR</h1>
          <p className="text-sm text-muted-foreground">
            AI-Powered Fitting Management
          </p>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground capitalize">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </header>
  );
}
