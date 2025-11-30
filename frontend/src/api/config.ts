/**
 * API Configuration
 * PUBLIC_API_BASE_URL: Public-facing backend API URL
 */

export const API_CONFIG = {
  BASE_URL:
    import.meta.env.PUBLIC_API_BASE_URL || "https://coretrack.onrender.com",
  API_VERSION: "/api/v1",
  TIMEOUT: 30000,
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};
