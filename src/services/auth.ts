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

// Backend'in beklediği format (PascalCase)
interface RegisterRequestDto {
  FullName: string;
  Email: string;
  Password: string;
  CompanyName?: string;
  Address?: string;
  City?: string;
  Country?: string;
  Phone?: string;
  Website?: string;
  UserType?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Backend'in beklediği format (PascalCase)
interface LoginRequestDto {
  Email: string;
  Password: string;
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
   * Google ile giriş yap
   */
  async googleLogin(accessToken: string): Promise<AuthResponse> {
    // Backend'in beklediği format (PascalCase)
    const requestData = {
      AccessToken: accessToken
    };

    // Senin kendi apiClient yapını kullanıyoruz
    const response = await apiClient.post<AuthResponse>('http://localhost:5100/api/auth/google-login', requestData);
    
    // Başarılı girişte Token ve Kullanıcı bilgilerini kaydediyoruz (Mevcut login mantığınla aynı)
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
   * Kullanıcı kaydı
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Frontend camelCase -> Backend PascalCase dönüşümü
    // Boş string'leri göndermiyoruz - backend URL validasyonu yapıyor
    const requestData: Partial<RegisterRequestDto> = {
      FullName: data.fullName,
      Email: data.email,
      Password: data.password,
    };

    // Opsiyonel alanları sadece dolu ise ekle
    if (data.companyName && data.companyName.trim()) {
      requestData.CompanyName = data.companyName;
    }
    if (data.address && data.address.trim()) {
      requestData.Address = data.address;
    }
    if (data.city && data.city.trim()) {
      requestData.City = data.city;
    }
    if (data.country && data.country.trim()) {
      requestData.Country = data.country;
    }
    if (data.phone && data.phone.trim()) {
      requestData.Phone = data.phone;
    }
    // Website sadece geçerli URL formatında ise gönder
    if (data.website && data.website.trim()) {
      // URL formatı kontrolü
      const websiteUrl = data.website.trim();
      if (websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://')) {
        requestData.Website = websiteUrl;
      } else if (websiteUrl.includes('.')) {
        // http:// ekle
        requestData.Website = 'https://' + websiteUrl;
      }
    }
    if (data.userType && data.userType.trim()) {
      requestData.UserType = data.userType;
    }

    const response = await apiClient.post<AuthResponse>('/api/auth/register', requestData);
    
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
    // Frontend camelCase -> Backend PascalCase dönüşümü
    const requestData: LoginRequestDto = {
      Email: data.email,
      Password: data.password,
    };

    const response = await apiClient.post<AuthResponse>('/api/auth/login', requestData);
    
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

  /**
   * Şifre sıfırlama isteği - e-postaya kod gönderir
   */
  async resetPasswordRequest(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/reset-password-request', {
      Email: email
    });
    return response.data;
  }

  /**
   * Şifre sıfırlama - kod ile yeni şifre belirleme
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/reset-password', {
      Email: email,
      Code: code,
      NewPassword: newPassword
    });
    return response.data;
  }

  /**
   * E-posta doğrulama kodu gönder
   */
  async sendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/send-verification', {
      Email: email
    });
    return response.data;
  }

  /**
   * E-posta doğrulama - kod ile doğrulama
   */
  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/verify-email', {
      Email: email,
      Code: code
    });
    return response.data;
  }
}

export const authService = new AuthService();
