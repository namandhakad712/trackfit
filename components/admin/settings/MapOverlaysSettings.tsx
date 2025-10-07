'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  Wrench,
  Hash,
  Tag,
  Ruler,
  Droplets
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FittingOverlay {
  id: string;
  fitting_type: string;
  part_type: string;
  overlay_image_url: string;
  default_size: number;
  default_rotation: number;
  category: string | null;
  metadata: {
    material?: string;
    dimensions?: string;
    weight?: string;
    [key: string]: any;
  } | null;
  created_at: string;
}

export function MapOverlaysSettings() {
  const supabase = createClient();
  const [overlays, setOverlays] = useState<FittingOverlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOverlay, setSelectedOverlay] = useState<FittingOverlay | null>(null);
  const [newMetadataField, setNewMetadataField] = useState({ key: '', value: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch existing overlays
  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fitting_overlays')
        .select('*')
        .order('fitting_type')
        .order('part_type');

      if (error) throw error;
      setOverlays(data || []);
    } catch (error) {
      console.error('Failed to fetch overlays:', error);
      alert('Failed to fetch overlays: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedOverlay({
      id: '',
      fitting_type: 'elastic_rail_clip',
      part_type: 'clip',
      overlay_image_url: '',
      default_size: 32,
      default_rotation: 0,
      category: 'fasteners',
      metadata: {},
      created_at: new Date().toISOString(),
    });
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!selectedOverlay) return;

    try {
      const overlayData = {
        fitting_type: selectedOverlay.fitting_type,
        part_type: selectedOverlay.part_type,
        overlay_image_url: selectedOverlay.overlay_image_url,
        default_size: selectedOverlay.default_size,
        default_rotation: selectedOverlay.default_rotation,
        category: selectedOverlay.category,
        metadata: selectedOverlay.metadata,
      };

      let result;
      if (selectedOverlay.id) {
        // Update existing
        result = await supabase
          .from('fitting_overlays')
          .update(overlayData)
          .eq('id', selectedOverlay.id);
      } else {
        // Create new
        result = await supabase
          .from('fitting_overlays')
          .insert(overlayData);
      }

      if (result.error) throw result.error;

      alert(selectedOverlay.id ? 'Overlay updated successfully' : 'Overlay created successfully');

      fetchOverlays();
      setSelectedOverlay(null);
      setImagePreview(null);
    } catch (error) {
      alert('Failed to save overlay: ' + (error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this overlay?')) return;

    try {
      const { error } = await supabase
        .from('fitting_overlays')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Overlay deleted successfully');

      fetchOverlays();
      if (selectedOverlay?.id === id) {
        setSelectedOverlay(null);
        setImagePreview(null);
      }
    } catch (error) {
      alert('Failed to delete overlay: ' + (error as Error).message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would upload to Supabase Storage
    // For now, we'll just create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setImagePreview(previewUrl);
      if (selectedOverlay) {
        setSelectedOverlay({
          ...selectedOverlay,
          overlay_image_url: previewUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const addMetadataField = () => {
    if (!newMetadataField.key || !newMetadataField.value) return;
    
    if (selectedOverlay) {
      const updatedMetadata = {
        ...selectedOverlay.metadata,
        [newMetadataField.key]: newMetadataField.value,
      };
      
      setSelectedOverlay({
        ...selectedOverlay,
        metadata: updatedMetadata,
      });
      
      setNewMetadataField({ key: '', value: '' });
    }
  };

  const removeMetadataField = (key: string) => {
    if (selectedOverlay && selectedOverlay.metadata) {
      const updatedMetadata = { ...selectedOverlay.metadata };
      delete updatedMetadata[key];
      
      setSelectedOverlay({
        ...selectedOverlay,
        metadata: updatedMetadata,
      });
    }
  };

  const formatFittingType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Map Overlays Settings
          </CardTitle>
          <CardDescription>
            Manage fitting part overlays for map visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Overlay List */}
            <div className="lg:w-1/2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Existing Overlays</h3>
                <Button onClick={handleCreateNew} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : overlays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4" />
                  <p>No overlays found</p>
                  <p className="text-sm mt-1">Create your first overlay to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {overlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      className={`border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedOverlay?.id === overlay.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedOverlay(overlay);
                        setImagePreview(overlay.overlay_image_url);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {overlay.overlay_image_url ? (
                              <img
                                src={overlay.overlay_image_url}
                                alt={overlay.part_type}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>';
                                }}
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{formatFittingType(overlay.fitting_type)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {overlay.part_type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {overlay.default_size}px
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(overlay.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Overlay Editor */}
            <div className="lg:w-1/2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedOverlay ? 'Edit Overlay' : 'Overlay Details'}
                  </CardTitle>
                  <CardDescription>
                    {selectedOverlay
                      ? 'Modify the selected overlay settings'
                      : 'Select an overlay to edit or create a new one'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedOverlay ? (
                    <div className="space-y-6">
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>Overlay Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <Label htmlFor="image-upload">
                              <Button asChild variant="outline" size="sm">
                                <span>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Image
                                </span>
                              </Button>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, or SVG (recommended 32x32px)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Basic Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fitting-type">Fitting Type</Label>
                          <Select
                            value={selectedOverlay.fitting_type}
                            onValueChange={(value) =>
                              setSelectedOverlay({
                                ...selectedOverlay,
                                fitting_type: value,
                              })
                            }
                          >
                            <SelectTrigger id="fitting-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="elastic_rail_clip">Elastic Rail Clip</SelectItem>
                              <SelectItem value="rail_pad">Rail Pad</SelectItem>
                              <SelectItem value="liner">Liner</SelectItem>
                              <SelectItem value="sleeper">Sleeper</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="part-type">Part Type</Label>
                          <Input
                            id="part-type"
                            value={selectedOverlay.part_type}
                            onChange={(e) =>
                              setSelectedOverlay({
                                ...selectedOverlay,
                                part_type: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="default-size">Default Size (px)</Label>
                          <Input
                            id="default-size"
                            type="number"
                            min="16"
                            max="128"
                            value={selectedOverlay.default_size}
                            onChange={(e) =>
                              setSelectedOverlay({
                                ...selectedOverlay,
                                default_size: parseInt(e.target.value) || 32,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="default-rotation">Rotation (degrees)</Label>
                          <Select
                            value={selectedOverlay.default_rotation.toString()}
                            onValueChange={(value) =>
                              setSelectedOverlay({
                                ...selectedOverlay,
                                default_rotation: parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger id="default-rotation">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0° (Standard)</SelectItem>
                              <SelectItem value="90">90° (Rotated)</SelectItem>
                              <SelectItem value="180">180° (Upside Down)</SelectItem>
                              <SelectItem value="270">270° (Rotated CCW)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={selectedOverlay.category || ''}
                            onValueChange={(value) =>
                              setSelectedOverlay({
                                ...selectedOverlay,
                                category: value || null,
                              })
                            }
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fasteners">Fasteners</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                              <SelectItem value="protection">Protection</SelectItem>
                              <SelectItem value="foundation">Foundation</SelectItem>
                              <SelectItem value="">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Metadata
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Additional information about this overlay
                          </p>
                        </div>

                        {selectedOverlay.metadata && Object.entries(selectedOverlay.metadata).length > 0 && (
                          <div className="space-y-2">
                            {Object.entries(selectedOverlay.metadata).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                                <div>
                                  <span className="text-sm font-medium">{key}:</span>
                                  <span className="text-sm ml-2">{String(value)}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMetadataField(key)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Input
                            placeholder="Key"
                            value={newMetadataField.key}
                            onChange={(e) => setNewMetadataField({...newMetadataField, key: e.target.value})}
                          />
                          <Input
                            placeholder="Value"
                            value={newMetadataField.value}
                            onChange={(e) => setNewMetadataField({...newMetadataField, value: e.target.value})}
                          />
                          <Button onClick={addMetadataField} variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={() => setSelectedOverlay(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Wrench className="h-12 w-12 mx-auto mb-4" />
                      <p>Select an overlay to edit or create a new one</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
