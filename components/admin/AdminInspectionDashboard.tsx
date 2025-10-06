'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Hash,
  Wrench,
  MapPin,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { AdminInspectionLogViewer } from './AdminInspectionLogViewer';
import { useSupabase } from '@/lib/supabase/client';

interface AdminInspectionLog {
  id: string;
  fitting_id: string;
  inspector_id: string;
  inspection_type: string;
  status: string;
  notes: string | null;
  gps_latitude: number | null;
  gps_longitude: number | null;
  images: string[] | null;
  timestamp: string;
  fitting: {
    qr_code: string;
    part_type: string;
    manufacturer: string;
    current_location: string;
  };
  inspector: {
    name: string;
    email: string;
    role: string;
  };
}

export function AdminInspectionDashboard() {
  const supabase = useSupabase();
  const [logs, setLogs] = useState<AdminInspectionLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AdminInspectionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchInspectionLogs();
  }, []);

  const fetchInspectionLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch all inspection logs with related data
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          id,
          fitting_id,
          inspector_id,
          inspection_type,
          status,
          notes,
          gps_latitude,
          gps_longitude,
          images,
          timestamp,
          fitting:fittings!inner(
            qr_code,
            part_type,
            manufacturer,
            current_location
          ),
          inspector:users!inner(
            name,
            email,
            role
          )
        `)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      setLogs(data || []);
      setFilteredLogs(data || []);
    } catch (error) {
      console.error('Error fetching inspection logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...logs];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.fitting.qr_code.toLowerCase().includes(term) ||
        log.fitting.part_type.toLowerCase().includes(term) ||
        log.fitting.manufacturer.toLowerCase().includes(term) ||
        log.inspector.name.toLowerCase().includes(term) ||
        (log.notes && log.notes.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(log => log.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(log => log.inspection_type === typeFilter);
    }
    
    setFilteredLogs(result);
  }, [searchTerm, statusFilter, typeFilter, logs]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pass': return 'default';
      case 'fail': return 'destructive';
      case 'needs_attention': return 'warning';
      default: return 'secondary';
    }
  };

  const formatInspectionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inspection Logs</h1>
          <p className="text-muted-foreground">
            Comprehensive view of all inspection activities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by QR code, part type, inspector..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="needs_attention">Needs Attention</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Inspection Type</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="supply">Supply</option>
                <option value="in_service">In Service</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Inspection Records
          </CardTitle>
          <CardDescription>
            {filteredLogs.length} {filteredLogs.length === 1 ? 'record' : 'records'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length > 0 ? (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/5 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {log.fitting.qr_code}
                        </Badge>
                        <Badge variant="secondary">
                          {log.fitting.part_type.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant={getStatusVariant(log.status) as any}>
                          {log.status.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {formatInspectionType(log.inspection_type)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{log.inspector.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(log.timestamp), 'PPp')}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{log.fitting.current_location}</span>
                        </div>
                      </div>
                      
                      {log.notes && (
                        <p className="text-sm mt-1 line-clamp-2">
                          {log.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AdminInspectionLogViewer inspection={log as any} />
                      
                      {log.images && log.images.length > 0 && (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Images ({log.images.length})
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4" />
              <p>No inspection logs found matching your criteria</p>
              <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}