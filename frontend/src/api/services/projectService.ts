import apiClient from '../client';

export interface Project {
  id: number;
  project_id: string;
  name: string;
  company_id: number;
  location?: string;
  status: 'active' | 'inactive' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ProjectWithDetails extends Project {
  company_name?: string;
  drillhole_count: number;
  dispatch_count: number;
}

export interface ProjectCreate {
  project_id: string;
  name: string;
  company_id: number;
  location?: string;
  status?: 'active' | 'inactive' | 'completed';
}

export interface ProjectUpdate {
  name?: string;
  location?: string;
  status?: 'active' | 'inactive' | 'completed';
}

export const projectService = {
  /**
   * Get all projects
   */
  async getAll(params?: { company_id?: number; status?: string }): Promise<Project[]> {
    const response = await apiClient.get('/projects/', { params });
    return response.data;
  },

  /**
   * Get project by ID with details
   */
  async getById(id: number): Promise<ProjectWithDetails> {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create a new project
   */
  async create(data: ProjectCreate): Promise<Project> {
    const response = await apiClient.post('/projects/', data);
    return response.data;
  },

  /**
   * Update a project
   */
  async update(id: number, data: ProjectUpdate): Promise<Project> {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete a project
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};

export default projectService;
