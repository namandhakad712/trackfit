'use client';

import { User } from 'lucide-react';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export function Header({ user }: HeaderProps) {

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
        </div>
      </div>
    </header>
  );
}
