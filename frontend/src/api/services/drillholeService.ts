import apiClient from '../client';

export interface Drillhole {
  id: number;
  drillhole_id: string;
  project_id: number;
  depth?: number;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface DrillholeWithDetails extends Drillhole {
  project_name?: string;
  project_project_id?: string;
  dispatch_count: number;
}

export interface DrillholeCreate {
  drillhole_id: string;
  project_id: number;
  depth?: number;
  status?: 'active' | 'completed' | 'abandoned';
}

export interface DrillholeUpdate {
  drillhole_id?: string;
  depth?: number;
  status?: 'active' | 'completed' | 'abandoned';
}

export const drillholeService = {
  /**
   * Get all drillholes
   */
  async getAll(params?: { project_id?: number; status?: string }): Promise<DrillholeWithDetails[]> {
    const response = await apiClient.get('/drillholes/', { params });
    return response.data;
  },

  /**
   * Get drillhole by ID with details
   */
  async getById(id: number): Promise<DrillholeWithDetails> {
    const response = await apiClient.get(`/drillholes/${id}`);
    return response.data;
  },

  /**
   * Create a new drillhole
   */
  async create(data: DrillholeCreate): Promise<Drillhole> {
    const response = await apiClient.post('/drillholes/', data);
    return response.data;
  },

  /**
   * Update a drillhole
   */
  async update(id: number, data: DrillholeUpdate): Promise<Drillhole> {
    const response = await apiClient.put(`/drillholes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a drillhole
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/drillholes/${id}`);
  },
};

export default drillholeService;
