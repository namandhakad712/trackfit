'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SupabaseConnectionStatusProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function SupabaseConnectionStatus({ position = 'bottom-right' }: SupabaseConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // null = checking, true = connected, false = disconnected
  const supabase = createClient();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsConnected(null); // Set to loading state
        
        // Check if we can access the Supabase client configuration (basic connectivity test)
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // If there's no error, the connection is working
        // Even if no user is found (user will be null), it means connection is good
        setIsConnected(true);
      } catch (err) {
        // For connection-related errors, mark as disconnected
        // For auth-related errors (no session), connection is still good
        if (err instanceof Error && 
            (err.message.includes('session') || 
             err.message.includes('Auth session') ||
             err.message.includes('missing'))) {
          // Connection is working, just no user is logged in - which is normal
          setIsConnected(true);
        } else {
          setIsConnected(false);
          console.error('Supabase server connection error:', err);
        }
      }
    };

    // Initial check
    checkConnection();

    // Check connection every 30 seconds
    const intervalId = setInterval(checkConnection, 30000);

    return () => clearInterval(intervalId);
  }, [supabase]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const getDotColor = () => {
    if (isConnected === null) return 'bg-gray-400';
    return isConnected ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div 
        className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className={`${getDotColor()} w-2 h-2 rounded-full`}></div>
      </div>
    </div>
  );
}