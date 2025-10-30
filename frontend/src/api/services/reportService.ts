/**
 * Report API Service
 */
import apiClient from '../client';

export interface DashboardStats {
  inventory: {
    base: { hq: number; nq: number };
    outstanding: { hq: number; nq: number };
    available: { hq: number; nq: number };
  };
  dispatches: {
    total: number;
    outstanding: number;
    returned: number;
    match_rate: number;
  };
  samples: {
    total: number;
    outstanding: number;
  };
}

export interface ReconciliationReport {
  outstanding: Array<{
    id: number;
    project: string;
    drillhole: string;
    company: string;
    dispatch_date: string;
    hq_boxes: number;
    nq_boxes: number;
    days_out: number;
    driver: string;
    technician: string;
  }>;
  discrepancies: Array<{
    id: number;
    project: string;
    drillhole: string;
    company: string;
    dispatch_date: string;
    return_date: string;
    hq_dispatched: number;
    hq_returned: number;
    hq_difference: number;
    nq_dispatched: number;
    nq_returned: number;
    nq_difference: number;
    notes: string;
  }>;
}

export interface AnalyticsData {
  by_company: Array<{
    company: string;
    dispatches: number;
    samples: number;
  }>;
  by_sample_type: Array<{
    sample_type: string;
    dispatches: number;
  }>;
}

export const reportService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/reports/dashboard');
    return response.data;
  },

  async getReconciliation(): Promise<ReconciliationReport> {
    const response = await apiClient.get('/reports/reconciliation');
    return response.data;
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await apiClient.get('/reports/analytics');
    return response.data;
  },

  async exportToCSV(): Promise<Blob> {
    const response = await apiClient.get('/reports/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};

