'use client';

import { useEffect, useRef } from 'react';

interface FittingPartOverlayProps {
  map: any; // Ola Maps instance
  partType: string; // e.g., 'clip', 'liner', 'pad', 'sleeper'
  position: [number, number]; // [longitude, latitude]
  size?: number; // Size multiplier for the overlay
  rotation?: number; // Rotation in degrees
}

export function FittingPartOverlay({ 
  map, 
  partType, 
  position, 
  size = 1, 
  rotation = 0 
}: FittingPartOverlayProps) {
  const overlayRef = useRef<any>(null);
  
  useEffect(() => {
    if (!map) return;
    
    // Clean up previous overlay if exists
    if (overlayRef.current) {
      overlayRef.current.remove();
    }
    
    // Determine the image URL based on part type
    let imageUrl = '';
    switch (partType.toLowerCase()) {
      case 'elastic_rail_clip':
      case 'clip':
        imageUrl = '/overlays/clips/rail-clip.png';
        break;
      case 'rail_pad':
      case 'pad':
        imageUrl = '/overlays/pads/rail-pad.png';
        break;
      case 'liner':
        imageUrl = '/overlays/liners/liner.png';
        break;
      case 'sleeper':
        imageUrl = '/overlays/sleepers/sleeper.png';
        break;
      default:
        imageUrl = '/overlays/clips/rail-clip.png'; // Default fallback
    }
    
    // Add image source to map
    const imageId = `fitting-overlay-${partType}-${Date.now()}`;
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = `${32 * size}px`;
    img.style.height = `${32 * size}px`;
    img.style.transform = `rotate(${rotation}deg)`;
    img.style.display = 'block';
    
    // Add image to map as a symbol
    map.loadImage(imageUrl, (error: any, image: any) => {
      if (error) {
        console.warn(`Failed to load overlay image for ${partType}:`, error);
        // Try fallback image
        map.loadImage('/overlays/clips/rail-clip.png', (fallbackError: any, fallbackImage: any) => {
          if (fallbackError) {
            console.error('Failed to load fallback overlay image:', fallbackError);
            return;
          }
          
          addImageToMap(fallbackImage);
        });
        return;
      }
      
      addImageToMap(image);
    });
    
    function addImageToMap(image: any) {
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, image);
      }
      
      // Add source and layer for the marker
      const sourceId = `fitting-source-${partType}-${Date.now()}`;
      const layerId = `fitting-layer-${partType}-${Date.now()}`;
      
      // Remove existing source/layer if they exist
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      
      // Add source
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: position
          }
        }
      });
      
      // Add layer with the image
      map.addLayer({
        id: layerId,
        type: 'symbol',
        source: sourceId,
        layout: {
          'icon-image': imageId,
          'icon-size': size,
          'icon-allow-overlap': true,
          'icon-rotate': rotation,
        }
      });
      
      // Store references for cleanup
      overlayRef.current = { sourceId, layerId, imageId };
    }
    
    // Cleanup function
    return () => {
      if (overlayRef.current && map) {
        const { sourceId, layerId, imageId } = overlayRef.current;
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
        // Note: We don't remove the image from map as other instances may be using it
      }
    };
  }, [map, partType, position, size, rotation]);

  // This component doesn't render anything visible on its own
  return null;
}