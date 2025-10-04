import { differenceInDays, differenceInMonths, differenceInHours } from 'date-fns';
import type { AlertType, Severity } from '@/types';

export interface AlertRule {
  type: AlertType;
  condition: (context: AlertContext) => boolean;
  severity: (context: AlertContext) => Severity;
  message: (context: AlertContext) => string;
}

export interface AlertContext {
  fitting: {
    id: string;
    qr_code: string;
    part_type: string;
    manufacturer: string;
    lot_number: string;
    warranty_expiry: string;
    created_at: string;
  };
  inspection?: {
    id: string;
    status: string;
    timestamp: string;
  };
  vendor?: {
    vendor_code: string;
    vendor_name: string;
    failure_rate: number;
  };
  recentInspections?: Array<{
    id: string;
    status: string;
    timestamp: string;
  }>;
  lotInspections?: Array<{
    id: string;
    status: string;
    lot_number: string;
  }>;
}

export interface GeneratedAlert {
  fitting_id: string;
  alert_type: AlertType;
  severity: Severity;
  message: string;
}

// Alert Rules
const warrantyExpiryRule: AlertRule = {
  type: 'warranty_expiry',
  condition: (ctx) => {
    const daysUntilExpiry = differenceInDays(new Date(ctx.fitting.warranty_expiry), new Date());
    return daysUntilExpiry <= 180;
  },
  severity: (ctx) => {
    const daysUntilExpiry = differenceInDays(new Date(ctx.fitting.warranty_expiry), new Date());
    if (daysUntilExpiry < 0) return 'critical';
    if (daysUntilExpiry < 30) return 'critical';
    if (daysUntilExpiry < 90) return 'high';
    return 'medium';
  },
  message: (ctx) => {
    const daysUntilExpiry = differenceInDays(new Date(ctx.fitting.warranty_expiry), new Date());
    if (daysUntilExpiry < 0) {
      return `Warranty EXPIRED ${Math.abs(daysUntilExpiry)} days ago - Replace immediately`;
    }
    if (daysUntilExpiry < 30) {
      return `Warranty expires in ${daysUntilExpiry} days - Replace immediately`;
    }
    if (daysUntilExpiry < 90) {
      return `Warranty expires in ${daysUntilExpiry} days - Plan replacement soon`;
    }
    return `Warranty expires in ${daysUntilExpiry} days - Monitor closely`;
  },
};

const vendorQualityRule: AlertRule = {
  type: 'vendor_quality',
  condition: (ctx) => {
    return ctx.vendor !== undefined && ctx.vendor.failure_rate >= 10;
  },
  severity: (ctx) => {
    const rate = ctx.vendor!.failure_rate;
    if (rate >= 20) return 'critical';
    if (rate >= 15) return 'high';
    return 'medium';
  },
  message: (ctx) => {
    const rate = ctx.vendor!.failure_rate.toFixed(1);
    const vendor = ctx.vendor!.vendor_name;
    if (ctx.vendor!.failure_rate >= 20) {
      return `CRITICAL: Vendor ${vendor} has ${rate}% failure rate - Review quality immediately`;
    }
    if (ctx.vendor!.failure_rate >= 15) {
      return `HIGH: Vendor ${vendor} has ${rate}% failure rate - Quality review recommended`;
    }
    return `Vendor ${vendor} has ${rate}% failure rate - Monitor quality`;
  },
};

const failurePredictionRule: AlertRule = {
  type: 'failure_prediction',
  condition: (ctx) => {
    // Check for 2+ "needs_attention" inspections within 6 months
    const needsAttentionCount = ctx.recentInspections?.filter(
      (i) => i.status === 'needs_attention' &&
        differenceInMonths(new Date(), new Date(i.timestamp)) <= 6
    ).length || 0;

    // Check for 3+ failed inspections in same lot
    const lotFailureCount = ctx.lotInspections?.filter(
      (i) => i.status === 'fail'
    ).length || 0;

    return needsAttentionCount >= 2 || lotFailureCount >= 3;
  },
  severity: (ctx) => {
    const lotFailureCount = ctx.lotInspections?.filter((i) => i.status === 'fail').length || 0;
    return lotFailureCount >= 3 ? 'critical' : 'high';
  },
  message: (ctx) => {
    const needsAttentionCount = ctx.recentInspections?.filter(
      (i) => i.status === 'needs_attention' &&
        differenceInMonths(new Date(), new Date(i.timestamp)) <= 6
    ).length || 0;

    const lotFailureCount = ctx.lotInspections?.filter((i) => i.status === 'fail').length || 0;

    if (lotFailureCount >= 3) {
      return `CRITICAL: ${lotFailureCount} failures detected in lot ${ctx.fitting.lot_number} - Inspect entire lot`;
    }
    return `HIGH RISK: ${needsAttentionCount} attention flags in 6 months - Increased monitoring required`;
  },
};

const duplicateInspectionRule: AlertRule = {
  type: 'duplicate_inspection',
  condition: (ctx) => {
    if (!ctx.inspection) return false;

    const recentInspection = ctx.recentInspections?.find(
      (i) => i.id !== ctx.inspection!.id &&
        differenceInHours(new Date(ctx.inspection!.timestamp), new Date(i.timestamp)) <= 24
    );

    return !!recentInspection;
  },
  severity: () => 'low',
  message: () => {
    return 'Duplicate inspection detected - Fitting inspected twice within 24 hours';
  },
};

// All alert rules
const alertRules: AlertRule[] = [
  warrantyExpiryRule,
  vendorQualityRule,
  failurePredictionRule,
  duplicateInspectionRule,
];

/**
 * Run all alert rules against the provided context
 * Returns an array of generated alerts
 */
export function runAlertEngine(context: AlertContext): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];

  for (const rule of alertRules) {
    try {
      if (rule.condition(context)) {
        alerts.push({
          fitting_id: context.fitting.id,
          alert_type: rule.type,
          severity: rule.severity(context),
          message: rule.message(context),
        });
      }
    } catch (error) {
      console.error(`Error running alert rule ${rule.type}:`, error);
    }
  }

  return alerts;
}

/**
 * Create alerts in the database
 */
export async function createAlerts(
  supabase: any,
  alerts: GeneratedAlert[]
): Promise<void> {
  if (alerts.length === 0) return;

  const { error } = await supabase
    .from('alerts')
    .insert(
      alerts.map((alert) => ({
        fitting_id: alert.fitting_id,
        alert_type: alert.alert_type,
        severity: alert.severity,
        message: alert.message,
        resolved: false,
      }))
    );

  if (error) {
    console.error('Error creating alerts:', error);
    throw error;
  }
}
