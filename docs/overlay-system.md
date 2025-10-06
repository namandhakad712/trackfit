# Fitting Part Overlay System

This documentation describes the overlay system for visualizing fitting parts on maps.

## Overlay Structure

### Directory Organization
```
/public/overlays/
├── clips/
│   ├── rail-clip.png
│   ├── elastic-clip.png
│   └── spring-clip.png
├── liners/
│   ├── rubber-liner.png
│   ├── plastic-liner.png
│   └── composite-liner.png
├── pads/
│   ├── rail-pad.png
│   ├── sleeper-pad.png
│   └── transition-pad.png
└── sleepers/
    ├── concrete-sleeper.png
    ├── wooden-sleeper.png
    └── steel-sleeper.png
```

### Database Schema for Overlay Metadata

#### `fitting_overlays` table
```sql
CREATE TABLE fitting_overlays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fitting_type TEXT NOT NULL, -- e.g., 'elastic_rail_clip', 'rail_pad', etc.
  part_type TEXT NOT NULL, -- e.g., 'clip', 'liner', 'pad', 'sleeper'
  overlay_image_url TEXT NOT NULL, -- URL to the overlay image
  default_size INTEGER DEFAULT 32, -- Default size in pixels
  default_rotation INTEGER DEFAULT 0, -- Default rotation in degrees
  category TEXT, -- Category for grouping (e.g., 'fasteners', 'support')
  metadata JSONB, -- Additional metadata like dimensions, material info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sample Overlay Data

| Fitting Type | Part Type | Category | Image | Size | Rotation | Metadata |
|--------------|-----------|----------|-------|------|----------|----------|
| elastic_rail_clip | clip | fasteners | /overlays/clips/rail-clip.png | 32 | 0 | {"material": "steel", "dimensions": "50x20mm"} |
| rail_pad | pad | support | /overlays/pads/rail-pad.png | 40 | 0 | {"material": "rubber", "thickness": "10mm"} |
| sleeper_liner | liner | protection | /overlays/liners/sleeper-liner.png | 36 | 0 | {"material": "polyurethane", "width": "120mm"} |
| concrete_sleeper | sleeper | foundation | /overlays/sleepers/concrete-sleeper.png | 64 | 0 | {"material": "concrete", "length": "2600mm"} |

## Integration with Map System

### Component Interface
```typescript
interface FittingPartOverlayProps {
  map: any; // Ola Maps instance
  partType: string; // e.g., 'clip', 'liner', 'pad', 'sleeper'
  position: [number, number]; // [longitude, latitude]
  size?: number; // Size multiplier for the overlay
  rotation?: number; // Rotation in degrees
}
```

### Usage Example
```tsx
// In a fitting detail view
<FittingPartOverlaysManager 
  map={olaMapInstance}
  fittings={[
    {
      id: 'abc-123',
      part_type: 'elastic_rail_clip',
      current_location: '12.934567,77.612345',
      qr_code: 'IR-CLIP-ABC-LOT123-1234567890',
      latitude: 12.934567,
      longitude: 77.612345
    }
  ]}
/>
```

## Admin Inspection Log Access

Only users with the `admin` role can access the full inspection log details:

### Authorization Check
```typescript
// In API routes or server components
const { data: { user } } = await supabase.auth.getUser();
const { data: userProfile } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single();

if (userProfile?.role !== 'admin') {
  return new Response('Unauthorized', { status: 403 });
}
```

### Admin-Only Components
- `AdminInspectionLogViewer` - Detailed view of inspection logs
- `AdminInspectionDashboard` - Comprehensive dashboard of all inspections
- `AdminGuard` - Route protection component

## API Endpoints for Admin Access

### GET `/api/admin/inspections`
Fetches all inspection logs with complete details including:
- Inspector identity and credentials
- Full fitting metadata
- Precise GPS coordinates
- Complete image sets
- Internal timestamps and audit trails

### GET `/api/admin/inspections/[id]`
Fetches a specific inspection log with all available metadata.

## Security Considerations

1. **Role-Based Access Control**: Only admins can view complete inspection logs
2. **Data Masking**: Regular users see limited information
3. **Audit Trail**: All admin accesses to inspection logs are logged
4. **PII Protection**: Personal information is only visible to authorized personnel

## Future Enhancements

1. **Dynamic Overlay Generation**: Generate overlays based on fitting specifications
2. **3D Visualization**: Integrate with 3D map models for immersive visualization
3. **AR Integration**: Augmented reality overlay for field inspections
4. **Custom Overlay Designer**: Admin tool for creating custom part overlays