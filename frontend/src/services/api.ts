// API Service for Tray Inventory Management System

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';
const FULL_API_URL = `${API_BASE_URL}${API_VERSION}`;

// Token management
let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => accessToken;

// API Request wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${FULL_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && refreshToken) {
    // Try to refresh token
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry the original request with new token
      const retryHeaders: Record<string, string> = {
        ...headers,
        'Authorization': `Bearer ${newToken}`,
      };
      const retryResponse = await fetch(`${FULL_API_URL}${endpoint}`, {
        ...options,
        headers: retryHeaders,
      });
      if (!retryResponse.ok) {
        throw new Error(`API Error: ${retryResponse.statusText}`);
      }
      return retryResponse.json();
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${FULL_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  return null;
}

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await apiRequest<{ access_token: string; refresh_token: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  register: async (data: { username: string; email: string; password: string; full_name: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    clearTokens();
  },

  getCurrentUser: () => {
    return apiRequest<any>('/auth/me');
  },
};

// Companies API
export const companiesAPI = {
  getAll: () => apiRequest<any[]>('/companies'),
  getById: (id: number) => apiRequest<any>(`/companies/${id}`),
  create: (data: any) => apiRequest('/companies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/companies/${id}`, { method: 'DELETE' }),
};

// Dispatches API
export const dispatchesAPI = {
  getAll: (params?: { project_id?: number; drillhole_id?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append('project_id', params.project_id.toString());
    if (params?.drillhole_id) queryParams.append('drillhole_id', params.drillhole_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    const query = queryParams.toString();
    return apiRequest<any[]>(`/dispatches${query ? `?${query}` : ''}`);
  },

  getById: (id: number) => apiRequest<any>(`/dispatches/${id}`),

  create: (data: {
    project_id: number;
    drillhole_id: number;
    company_id: number;
    hq_boxes: number;
    nq_boxes: number;
    driver: string;
    technician: string;
    samples_collected?: number;
    sample_type?: string;
  }) => apiRequest('/dispatches', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: any) =>
    apiRequest(`/dispatches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  processReturn: (id: number, data: {
    returned_hq: number;
    returned_nq: number;
    return_condition: string;
    return_notes?: string;
    return_driver?: string;
    return_technician?: string;
  }) => apiRequest(`/dispatches/${id}/return`, { method: 'POST', body: JSON.stringify(data) }),

  getOutstanding: () => apiRequest<any[]>('/dispatches/outstanding'),

  delete: (id: number) => apiRequest(`/dispatches/${id}`, { method: 'DELETE' }),
};

// Reports API
export const reportsAPI = {
  getDashboard: (params?: { project_id?: number; drillhole_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append('project_id', params.project_id.toString());
    if (params?.drillhole_id) queryParams.append('drillhole_id', params.drillhole_id.toString());
    const query = queryParams.toString();
    return apiRequest<any>(`/reports/dashboard${query ? `?${query}` : ''}`);
  },

  getReconciliation: (params?: { project_id?: number; drillhole_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append('project_id', params.project_id.toString());
    if (params?.drillhole_id) queryParams.append('drillhole_id', params.drillhole_id.toString());
    const query = queryParams.toString();
    return apiRequest<any>(`/reports/reconciliation${query ? `?${query}` : ''}`);
  },

  getAnalytics: (params?: { project_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append('project_id', params.project_id.toString());
    const query = queryParams.toString();
    return apiRequest<any>(`/reports/analytics${query ? `?${query}` : ''}`);
  },

  exportCSV: async (params?: { project_id?: number; drillhole_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append('project_id', params.project_id.toString());
    if (params?.drillhole_id) queryParams.append('drillhole_id', params.drillhole_id.toString());
    const query = queryParams.toString();
    
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${FULL_API_URL}/reports/export${query ? `?${query}` : ''}`, { headers });
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tray_inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

// Projects API
export const projectsAPI = {
  getAll: () => apiRequest<any[]>('/projects'),
  getById: (id: number) => apiRequest<any>(`/projects/${id}`),
};

// Drillholes API
export const drillholesAPI = {
  getAll: (projectId?: number) => {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiRequest<any[]>(`/drillholes${query}`);
  },
  getById: (id: number) => apiRequest<any>(`/drillholes/${id}`),
};

// Samples API
export const samplesAPI = {
  getAll: (drillholeId?: number) => {
    const query = drillholeId ? `?drillhole_id=${drillholeId}` : '';
    return apiRequest<any[]>(`/samples${query}`);
  },
  create: (data: {
    drillhole_id: number;
    depth_sampled_to: number;
    samples_generated: number;
    samples_submitted_to_lab: number;
  }) => apiRequest('/samples', { method: 'POST', body: JSON.stringify(data) }),
};

export default {
  auth: authAPI,
  companies: companiesAPI,
  dispatches: dispatchesAPI,
  reports: reportsAPI,
  projects: projectsAPI,
  drillholes: drillholesAPI,
  samples: samplesAPI,
};
