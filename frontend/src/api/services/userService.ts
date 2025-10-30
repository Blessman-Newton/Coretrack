import apiClient from '../client';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'manager' | 'operator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'manager' | 'operator';
  password: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  role?: 'admin' | 'manager' | 'operator';
  is_active?: boolean;
  password?: string;
}

export const userService = {
  /**
   * Get all users (Admin only)
   */
  async getAll(): Promise<User[]> {
    const response = await apiClient.get('/users/');
    return response.data;
  },

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user (Admin only)
   */
  async create(data: UserCreate): Promise<User> {
    const response = await apiClient.post('/users/', data);
    return response.data;
  },

  /**
   * Update a user (Admin only)
   */
  async update(id: number, data: UserUpdate): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user (Admin only)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};

export default userService;
