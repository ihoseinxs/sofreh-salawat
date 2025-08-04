import axios from 'axios';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, Prayer, CreatePrayerRequest, ParticipateRequest, User, UserStats, Participation, ReligiousContent } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://your-app.vercel.app/api' : 'http://localhost:5000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: User & { stats?: UserStats } }>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Prayer API
export const prayerAPI = {
  createPrayer: async (data: CreatePrayerRequest): Promise<ApiResponse<{ prayer: Prayer }>> => {
    const response = await api.post('/prayers', data);
    return response.data;
  },

  getPrayers: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ prayers: Prayer[]; pagination: any }>> => {
    const response = await api.get('/prayers', { params });
    return response.data;
  },

  getPrayerById: async (id: string): Promise<ApiResponse<{ prayer: Prayer }>> => {
    const response = await api.get(`/prayers/${id}`);
    return response.data;
  },

  updatePrayer: async (id: string, data: Partial<Prayer>): Promise<ApiResponse<{ prayer: Prayer }>> => {
    const response = await api.put(`/prayers/${id}`, data);
    return response.data;
  },

  deletePrayer: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/prayers/${id}`);
    return response.data;
  },

  participateInPrayer: async (id: string, data: ParticipateRequest): Promise<ApiResponse<{ participation: Participation }>> => {
    const response = await api.post(`/prayers/${id}/participate`, data);
    return response.data;
  },

  getPrayerStats: async (id: string): Promise<ApiResponse<{ stats: any }>> => {
    const response = await api.get(`/prayers/${id}/stats`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getUserStats: async (): Promise<ApiResponse<{ stats: UserStats }>> => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  getUserParticipations: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ participations: Participation[]; pagination: any }>> => {
    const response = await api.get('/users/participations', { params });
    return response.data;
  },
};

// Content API
export const contentAPI = {
  getReligiousContent: async (params?: {
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ content: ReligiousContent[]; pagination: any }>> => {
    const response = await api.get('/content', { params });
    return response.data;
  },

  getContentByType: async (type: string): Promise<ApiResponse<{ content: ReligiousContent[] }>> => {
    const response = await api.get(`/content/${type}`);
    return response.data;
  },
};

export default api; 