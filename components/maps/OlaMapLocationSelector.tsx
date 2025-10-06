'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface OlaMapLocationSelectorProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string }) => void;
  initialLocation?: { latitude: number; longitude: number };
  disabled?: boolean;
}

declare global {
  interface Window {
    OlaMaps: any;
  }
}

export function OlaMapLocationSelector({ onLocationSelect, initialLocation, disabled }: OlaMapLocationSelectorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const olaMapsRef = useRef<any>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(
    initialLocation ? { ...initialLocation } : null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Ola Maps SDK script dynamically
  useEffect(() => {
    const scriptId = 'olamaps-sdk';
    
    // Check if script is already loaded
    if (document.getElementById(scriptId)) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://www.unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js';
    script.async = true;
    
    script.onload = () => {
      setTimeout(initializeMap, 500); // Small delay to ensure SDK is ready
    };
    
    script.onerror = () => {
      setError('Failed to load Ola Maps SDK');
      setLoading(false);
    };
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const initializeMap = async () => {
    if (!window.OlaMaps) {
      setError('Ola Maps SDK not loaded properly');
      setLoading(false);
      return;
    }

    try {
      // Initialize Ola Maps with actual project credentials
      const olaMaps = new window.OlaMaps({
        apiKey: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY || "Ic6rrIPg2Js8v1vWFpc0B5KB4SkxwUM96nAB8CUu", // Use env var with fallback to provided key
        // projectId: "1b66cf2a-e24e-4415-b38f-b97b3820e935", // Your project ID (if required by the SDK)
      });
      
      // Store the OlaMaps instance
      olaMapsRef.current = olaMaps;

      // Initialize the map if container is available
      if (mapContainerRef.current) {
        const initializedMap = await olaMaps.init({
          style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: mapContainerRef.current,
          center: initialLocation ? [initialLocation.longitude, initialLocation.latitude] : [77.61648476788898, 12.931423492103944],
          zoom: initialLocation ? 15 : 10,
        });

        // Store map reference
        mapRef.current = initializedMap;

        // Add click event to capture location
        initializedMap.on('click', (e: any) => {
          const newLocation = {
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          };

          setLocation(newLocation);
          onLocationSelect(newLocation);
        });

        // Add marker at initial location if provided
        if (initialLocation) {
          const marker = olaMaps
            .addMarker({ 
              offset: [0, -20], 
              anchor: 'center' 
            })
            .setLngLat([initialLocation.longitude, initialLocation.latitude])
            .addTo(initializedMap);

          // Store marker reference to potentially update it later
          (initializedMap as any)._currentMarker = marker;
        }

        setMapLoaded(true);
      }
    } catch (err) {
      console.error('Error initializing Ola Maps:', err);
      setError('Error initializing map: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const captureCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(newLocation);
        onLocationSelect(newLocation);

        // Update map view and marker if map is initialized
        if (mapRef.current && olaMapsRef.current) {
          // Remove existing marker if any
          if ((mapRef.current as any)._currentMarker) {
            (mapRef.current as any)._currentMarker.remove();
          }

          // Add new marker at the current position
          const marker = olaMapsRef.current
            .addMarker({ 
              offset: [0, -20], 
              anchor: 'center',
              color: '#FF0000' // Red color for current location marker
            })
            .setLngLat([newLocation.longitude, newLocation.latitude])
            .addTo(mapRef.current);

          // Store marker reference
          (mapRef.current as any)._currentMarker = marker;

          // Move map to the new location
          mapRef.current.flyTo({
            center: [newLocation.longitude, newLocation.latitude],
            zoom: 15,
            essential: true // This animation is considered essential with respect to prefers-reduced-motion
          });
        }

        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to retrieve your location: ' + error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>GPS Location</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={captureCurrentLocation}
          disabled={disabled || loading}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>
      </div>
      
      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {location && (
        <Badge variant="secondary" className="flex items-center gap-1 break-all">
          <MapPin className="h-3 w-3" />
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Badge>
      )}
      
      <div 
        ref={mapContainerRef} 
        className="w-full h-64 rounded-lg border border-gray-200 relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <span className="text-sm text-muted-foreground">Loading map...</span>
            </div>
          </div>
        )}
        {!mapLoaded && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <span className="text-sm text-muted-foreground">Map not loaded</span>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Click on the map to select a location or use the button to capture current location
      </p>
    </div>
  );
}

