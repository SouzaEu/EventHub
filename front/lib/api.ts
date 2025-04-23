import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getToken, setToken, removeToken, isTokenExpired, refreshToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    if (isTokenExpired(token)) {
      try {
        const newToken = await refreshToken();
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
      } catch (error) {
        removeToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    } else {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken();
        const config = error.config;
        if (config) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return api(config);
        }
      } catch (refreshError) {
        removeToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
  logout: () => {
    removeToken();
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

export const eventService = {
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  getEvent: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  createEvent: async (data: any) => {
    const response = await api.post('/events', data);
    return response.data;
  },
  updateEvent: async (id: string, data: any) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default api; 