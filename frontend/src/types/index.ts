// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  id: string;
  userId: string;
  totalPrayers: number;
  totalParticipations: number;
  completedPrayers: number;
  createdAt: string;
  updatedAt: string;
}

// Prayer Types
export interface Prayer {
  id: string;
  title: string;
  description?: string;
  intention: string;
  targetCount: number;
  currentCount: number;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  prayerStats?: PrayerStats;
  participations?: Participation[];
}

export interface PrayerStats {
  id: string;
  prayerId: string;
  totalParticipants: number;
  averageDailyCount: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

// Participation Types
export interface Participation {
  id: string;
  userId: string;
  prayerId: string;
  count: number;
  date: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
  prayer?: {
    id: string;
    title: string;
    intention: string;
    targetCount: number;
    currentCount: number;
    status: string;
  };
}

// Content Types
export interface ReligiousContent {
  id: string;
  title: string;
  content: string;
  type: 'DUA' | 'HADITH' | 'SALAWAT_TEXT' | 'SALAWAT_AUDIO' | 'ETIQUETTE';
  audioUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Prayer Request Types
export interface CreatePrayerRequest {
  title: string;
  description?: string;
  intention: string;
  targetCount: number;
  startDate: string;
  endDate?: string;
  isPublic?: boolean;
}

export interface ParticipateRequest {
  count: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
} 