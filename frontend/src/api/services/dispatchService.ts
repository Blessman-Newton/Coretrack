/**
 * Dispatch API Service
 */
import apiClient from '../client';
import { Dispatch } from '../../types';

export interface DispatchCreateData {
  project_id: number;
  drillhole_id: number;
  company_id: number;
  hq_boxes: number;
  nq_boxes: number;
  driver: string;
  technician: string;
  samples_collected: number;
  sample_type: string;
  dispatch_date?: string;
}

export interface DispatchReturnData {
  returned_hq: number;
  returned_nq: number;
  return_condition: string;
  return_notes?: string;
  return_date?: string;
}

export interface DispatchFilters {
  skip?: number;
  limit?: number;
  status_filter?: 'outstanding' | 'returned';
  company_id?: number;
}

export const dispatchService = {
  async getAll(filters?: DispatchFilters): Promise<Dispatch[]> {
    const params = new URLSearchParams();
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters?.status_filter) params.append('status_filter', filters.status_filter);
    if (filters?.company_id) params.append('company_id', filters.company_id.toString());

    const response = await apiClient.get(`/dispatches/?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<Dispatch> {
    const response = await apiClient.get(`/dispatches/${id}`);
    return response.data;
  },

  async getOutstanding(): Promise<Dispatch[]> {
    const response = await apiClient.get('/dispatches/outstanding');
    return response.data;
  },

  async create(data: DispatchCreateData): Promise<Dispatch> {
    const response = await apiClient.post('/dispatches/', data);
    return response.data;
  },

  async update(id: number, data: Partial<DispatchCreateData>): Promise<Dispatch> {
    const response = await apiClient.put(`/dispatches/${id}`, data);
    return response.data;
  },

  async processReturn(id: number, data: DispatchReturnData): Promise<Dispatch> {
    const response = await apiClient.post(`/dispatches/${id}/return`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/dispatches/${id}`);
  },
};

