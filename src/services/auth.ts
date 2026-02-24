// Authentication Service
import { apiClient } from './api';

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  website?: string;
  userType?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  credits: number;
  role: string;
  packageType: string;
}

class AuthService {
  /**
   * Kullanıcı kaydı
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    
    // Token'ı kaydet
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      fullName: response.data.fullName,
      email: response.data.email,
      credits: response.data.credits,
      role: response.data.role,
      packageType: response.data.packageType,
    }));
    
    return response.data;
  }

  /**
   * Kullanıcı girişi
   */
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔍 Login REQUEST Debug:');
    console.log('  - Email:', data.email);
    console.log('  - Password:', data.password);
    console.log('  - Request body:', JSON.stringify(data));
    console.log('  - Content-Type header:', 'application/json');
    
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    
    console.log('🔍 Login RESPONSE Debug:');
    console.log('  - Full response:', response);
    console.log('  - Response data:', response.data);
    console.log('  - Token:', response.data.token);
    console.log('  - Token type:', typeof response.data.token);
    console.log('  - Token length:', response.data.token?.length);
    
    // Token'ı kaydet
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      fullName: response.data.fullName,
      email: response.data.email,
      credits: response.data.credits,
      role: response.data.role,
      packageType: response.data.packageType,
    }));
    
    console.log('✅ Token ve user localStorage\'a kaydedildi');
    
    return response.data;
  }

  /**
   * Çıkış yap
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Token var mı kontrol et
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Mevcut kullanıcı bilgilerini al
   */
  getCurrentUser(): { fullName: string; email: string; credits: number; role: string; packageType: string } | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
