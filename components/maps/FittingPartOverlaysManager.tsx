'use client';

import { FittingPartOverlay } from './FittingPartOverlay';

interface FittingPartOverlaysManagerProps {
  map: any; // Ola Maps instance
  fittings: Array<{
    id: string;
    part_type: string;
    current_location: string;
    qr_code: string;
    latitude: number;
    longitude: number;
    status?: string;
  }>;
  selectedFittingId?: string;
}

export function FittingPartOverlaysManager({ 
  map, 
  fittings, 
  selectedFittingId 
}: FittingPartOverlaysManagerProps) {
  return (
    <>
      {fittings.map((fitting) => (
        <FittingPartOverlay
          key={fitting.id}
          map={map}
          partType={fitting.part_type}
          position={[fitting.longitude, fitting.latitude]}
          size={selectedFittingId === fitting.id ? 1.5 : 1} // Slightly larger when selected
          rotation={0} // Can be modified based on fitting orientation data
        />
      ))}
    </>
  );
}