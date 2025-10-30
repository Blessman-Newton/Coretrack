import apiClient from '../client';

export interface Sample {
  id: number;
  dispatch_id: number;
  sample_id: string;
  sample_type: 'core' | 'assay' | 'geochemical' | 'mineralogy';
  from_depth?: number;
  to_depth?: number;
  status: 'collected' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface SampleCreate {
  dispatch_id: number;
  sample_id: string;
  sample_type: 'core' | 'assay' | 'geochemical' | 'mineralogy';
  from_depth?: number;
  to_depth?: number;
  status?: 'collected' | 'processing' | 'completed';
}

export interface SampleUpdate {
  sample_type?: 'core' | 'assay' | 'geochemical' | 'mineralogy';
  from_depth?: number;
  to_depth?: number;
  status?: 'collected' | 'processing' | 'completed';
}

export const sampleService = {
  /**
   * Get all samples
   */
  async getAll(params?: { dispatch_id?: number }): Promise<Sample[]> {
    const response = await apiClient.get('/samples/', { params });
    return response.data;
  },

  /**
   * Get sample by ID
   */
  async getById(id: number): Promise<Sample> {
    const response = await apiClient.get(`/samples/${id}`);
    return response.data;
  },

  /**
   * Create a new sample
   */
  async create(data: SampleCreate): Promise<Sample> {
    const response = await apiClient.post('/samples/', data);
    return response.data;
  },

  /**
   * Update a sample
   */
  async update(id: number, data: SampleUpdate): Promise<Sample> {
    const response = await apiClient.put(`/samples/${id}`, data);
    return response.data;
  },

  /**
   * Delete a sample
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/samples/${id}`);
  },
};

export default sampleService;
