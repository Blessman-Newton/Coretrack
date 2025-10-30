/**
 * Company API Service
 */
import apiClient from '../client';

export interface Company {
  id: number;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreateData {
  name: string;
  contact_email?: string;
  contact_phone?: string;
}

export const companyService = {
  async getAll(skip = 0, limit = 100): Promise<Company[]> {
    const response = await apiClient.get('/companies/', { params: { skip, limit } });
    return response.data;
  },

  async getById(id: number): Promise<Company> {
    const response = await apiClient.get(`/companies/${id}`);
    return response.data;
  },

  async create(data: CompanyCreateData): Promise<Company> {
    const response = await apiClient.post('/companies/', data);
    return response.data;
  },

  async update(id: number, data: Partial<CompanyCreateData>): Promise<Company> {
    const response = await apiClient.put(`/companies/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/companies/${id}`);
  },
};

