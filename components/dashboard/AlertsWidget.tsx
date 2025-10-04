'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: string;
  fitting_id: string;
}

interface AlertsWidgetProps {
  alerts: Alert[];
  maxDisplay?: number;
}

const severityConfig = {
  critical: {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Critical',
  },
  high: {
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'High',
  },
  medium: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'Medium',
  },
  low: {
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Low',
  },
};

export function AlertsWidget({ alerts, maxDisplay = 5 }: AlertsWidgetProps) {
  const displayedAlerts = alerts.slice(0, maxDisplay);
  const hasMore = alerts.length > maxDisplay;

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            No Active Alerts
          </CardTitle>
          <CardDescription>All systems operating normally</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              {alerts.length} unresolved alert{alerts.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/alerts">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-lg border',
                config.bgColor,
                config.borderColor
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn('text-xs', config.textColor)}
                    >
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        {hasMore && (
          <div className="text-center pt-2">
            <Button asChild variant="link" size="sm">
              <Link href="/alerts">
                View {alerts.length - maxDisplay} more alert
                {alerts.length - maxDisplay !== 1 ? 's' : ''}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
