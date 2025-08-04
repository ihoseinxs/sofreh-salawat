import axios from 'axios';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, Prayer, CreatePrayerRequest, ParticipateRequest, User, UserStats, Participation, ReligiousContent } from '../types';

// Mock data for production
const mockPrayers: Prayer[] = [
  {
    id: 'prayer-1',
    title: 'ختم صلوات برای سلامتی امام زمان',
    description: 'ختم صلوات با نیت سلامتی و تعجیل فرج امام زمان (عج)',
    intention: 'سلامتی و تعجیل فرج امام زمان (عج)',
    targetCount: 1000,
    currentCount: 450,
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-12-31T00:00:00.000Z',
    status: 'ACTIVE',
    isPublic: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    creator: {
      id: 'user-1',
      name: 'کاربر تست',
      email: 'test@example.com'
    },
    prayerStats: {
      id: 'stats-1',
      prayerId: 'prayer-1',
      totalParticipants: 2,
      averageDailyCount: 40,
      completionRate: 45,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  {
    id: 'prayer-2',
    title: 'ختم صلوات برای رفع مشکلات',
    description: 'ختم صلوات با نیت رفع مشکلات و گشایش امور',
    intention: 'رفع مشکلات و گشایش امور',
    targetCount: 500,
    currentCount: 320,
    startDate: '2024-02-01T00:00:00.000Z',
    endDate: '2024-08-31T00:00:00.000Z',
    status: 'ACTIVE',
    isPublic: true,
    createdBy: 'user-2',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    creator: {
      id: 'user-2',
      name: 'مدیر سیستم',
      email: 'admin@example.com'
    },
    prayerStats: {
      id: 'stats-2',
      prayerId: 'prayer-2',
      totalParticipants: 1,
      averageDailyCount: 25,
      completionRate: 64,
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z'
    }
  }
];

const mockContent: ReligiousContent[] = [
  {
    id: 'content-1',
    title: 'دعای سلامتی امام زمان',
    content: 'اللَّهُمَّ كُنْ لِوَلِيِّكَ الْحُجَّةِ بْنِ الْحَسَنِ صَلَوَاتُكَ عَلَيْهِ وَعَلَى آبَائِهِ فِي هَذِهِ السَّاعَةِ وَفِي كُلِّ سَاعَةٍ وَلِيًّا وَحَافِظًا وَقَائِدًا وَنَاصِرًا وَدَلِيلًا وَعَيْنًا حَتَّى تُسْكِنَهُ أَرْضَكَ طَوْعًا وَتُمَتِّعَهُ فِيهَا طَوِيلًا',
    type: 'DUA',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'content-2',
    title: 'حدیث درباره صلوات',
    content: 'قالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ: مَنْ صَلَّى عَلَيَّ صَلَاةً وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرَ صَلَوَاتٍ وَحُطَّتْ عَنْهُ عَشْرُ خَطِيئَاتٍ وَرُفِعَتْ لَهُ عَشْرُ دَرَجَاتٍ',
    type: 'HADITH',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'content-3',
    title: 'صلوات شریف',
    content: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
    type: 'SALAWAT_TEXT',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

// API URL configuration
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For development
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiUrl();

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

// Mock API functions for production
const mockAPI = {
  // Auth API
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return {
      success: true,
      data: {
        user: {
          id: 'user-1',
          name: data.name,
          email: data.email,
          role: 'USER',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock-token-' + Date.now()
      }
    };
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return {
      success: true,
      data: {
        user: {
          id: 'user-1',
          name: 'کاربر تست',
          email: data.email,
          role: 'USER',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock-token-' + Date.now()
      }
    };
  },

  getProfile: async (): Promise<ApiResponse<{ user: User & { stats?: UserStats } }>> => {
    return {
      success: true,
      data: {
        user: {
          id: 'user-1',
          name: 'کاربر تست',
          email: 'test@example.com',
          role: 'USER',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: {
            id: 'stats-1',
            userId: 'user-1',
            totalPrayers: 75,
            totalParticipations: 2,
            completedPrayers: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      }
    };
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    return {
      success: true,
      data: {
        user: {
          id: 'user-1',
          name: data.name || 'کاربر تست',
          email: data.email || 'test@example.com',
          role: 'USER',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };
  },

  // Prayer API
  createPrayer: async (data: CreatePrayerRequest): Promise<ApiResponse<{ prayer: Prayer }>> => {
    const newPrayer: Prayer = {
      id: 'prayer-' + Date.now(),
      title: data.title,
      description: data.description,
      intention: data.intention,
      targetCount: data.targetCount,
      startDate: data.startDate,
      endDate: data.endDate,
      isPublic: data.isPublic || true,
      currentCount: 0,
      status: 'ACTIVE',
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: {
        id: 'user-1',
        name: 'کاربر تست',
        email: 'test@example.com'
      }
    };
    return { success: true, data: { prayer: newPrayer } };
  },

  getPrayers: async (): Promise<ApiResponse<{ prayers: Prayer[]; pagination: any }>> => {
    return {
      success: true,
      data: {
        prayers: mockPrayers,
        pagination: {
          page: 1,
          limit: 10,
          total: mockPrayers.length,
          pages: 1
        }
      }
    };
  },

  getPrayerById: async (id: string): Promise<ApiResponse<{ prayer: Prayer }>> => {
    const prayer = mockPrayers.find(p => p.id === id);
    return {
      success: true,
      data: { prayer: prayer! }
    };
  },

  participateInPrayer: async (id: string, data: ParticipateRequest): Promise<ApiResponse<{ participation: Participation }>> => {
    return {
      success: true,
      data: {
        participation: {
          id: 'part-' + Date.now(),
          userId: 'user-1',
          prayerId: id,
          count: data.count,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      }
    };
  },

  // Content API
  getReligiousContent: async (): Promise<ApiResponse<{ content: ReligiousContent[]; pagination: any }>> => {
    return {
      success: true,
      data: {
        content: mockContent,
        pagination: {
          page: 1,
          limit: 10,
          total: mockContent.length,
          pages: 1
        }
      }
    };
  }
};

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    if (import.meta.env.PROD) {
      return mockAPI.register(data);
    }
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    if (import.meta.env.PROD) {
      return mockAPI.login(data);
    }
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: User & { stats?: UserStats } }>> => {
    if (import.meta.env.PROD) {
      return mockAPI.getProfile();
    }
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    if (import.meta.env.PROD) {
      return mockAPI.updateProfile(data);
    }
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Prayer API
export const prayerAPI = {
  createPrayer: async (data: CreatePrayerRequest): Promise<ApiResponse<{ prayer: Prayer }>> => {
    if (import.meta.env.PROD) {
      return mockAPI.createPrayer(data);
    }
    const response = await api.post('/prayers', data);
    return response.data;
  },

  getPrayers: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ prayers: Prayer[]; pagination: any }>> => {
    if (import.meta.env.PROD) {
      return mockAPI.getPrayers();
    }
    const response = await api.get('/prayers', { params });
    return response.data;
  },

  getPrayerById: async (id: string): Promise<ApiResponse<{ prayer: Prayer }>> => {
    if (import.meta.env.PROD) {
      return mockAPI.getPrayerById(id);
    }
    const response = await api.get(`/prayers/${id}`);
    return response.data;
  },

  participateInPrayer: async (id: string, data: ParticipateRequest): Promise<ApiResponse<{ participation: Participation }>> => {
    if (import.meta.env.PROD) {
      return mockAPI.participateInPrayer(id, data);
    }
    const response = await api.post(`/prayers/${id}/participate`, data);
    return response.data;
  },

  getPrayerStats: async (id: string): Promise<ApiResponse<{ stats: any }>> => {
    if (import.meta.env.PROD) {
      return { success: true, data: { stats: { totalParticipants: 2, averageDailyCount: 40, completionRate: 45 } } };
    }
    const response = await api.get(`/prayers/${id}/stats`);
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
    if (import.meta.env.PROD) {
      return mockAPI.getReligiousContent();
    }
    const response = await api.get('/content', { params });
    return response.data;
  },

  getContentByType: async (type: string): Promise<ApiResponse<{ content: ReligiousContent[] }>> => {
    if (import.meta.env.PROD) {
      const filteredContent = mockContent.filter(item => item.type === type);
      return { success: true, data: { content: filteredContent } };
    }
    const response = await api.get(`/content/${type}`);
    return response.data;
  },
};

export default api; 