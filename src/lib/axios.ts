import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from './env';

export interface ApiErrorDetail {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can attach correlation IDs or headers if needed
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    let message = 'An unexpected network error occurred';

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      message = 'Request to backend timed out. Please check if the Django server is responding.';
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Cannot connect to backend server at ' + env.VITE_API_BASE_URL + '. Check if backend is running.';
    } else if (error.response) {
      const data = error.response.data as Record<string, unknown> | undefined;
      if (typeof data?.detail === 'string') {
        message = data.detail;
      } else if (typeof data?.message === 'string') {
        message = data.message;
      } else if (error.response.status === 404) {
        message = `API endpoint not found: ${error.config?.url ?? 'unknown'}`;
      } else if (error.response.status === 500) {
        message = 'Internal server error in backend service';
      }
    }

    const customError: ApiErrorDetail = {
      message,
      code: error.code,
      status: error.response?.status,
      details: (error.response?.data as Record<string, unknown>) || undefined,
    };

    return Promise.reject(customError);
  }
);

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && 'message' in error && typeof (error as ApiErrorDetail).message === 'string') {
    return (error as ApiErrorDetail).message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
