// Authentication Service
import { apiClient } from './api';

// Kullanıcı dostu hata mesajları için yardımcı fonksiyon
export const getUserFriendlyErrorMessage = (error: any, language: 'tr' | 'en' = 'tr'): string => {
  // HTTP status koduna göre mesaj
  const statusCode = error?.response?.status;
  const backendMessage = error?.response?.data?.message || error?.response?.data?.Message || '';
  
  // Türkçe ve İngilizce mesaj eşlemeleri
  const messages = {
    tr: {
      // Genel hatalar
      network: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
      server: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
      unknown: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
      
      // Login hataları
      invalidCredentials: 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.',
      accountLocked: 'Hesabınız geçici olarak kilitlendi. Lütfen birkaç dakika sonra tekrar deneyin.',
      accountNotFound: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.',
      emailNotVerified: 'E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.',
      
      // Register hataları
      emailExists: 'Bu e-posta adresi zaten kullanılıyor. Farklı bir e-posta deneyin veya giriş yapın.',
      weakPassword: 'Şifreniz çok zayıf. En az 6 karakter, bir büyük harf ve bir rakam içermelidir.',
      invalidEmail: 'Geçersiz e-posta adresi. Lütfen doğru formatta girin.',
      invalidPhone: 'Geçersiz telefon numarası formatı.',
      invalidWebsite: 'Geçersiz web sitesi adresi. Örnek: https://example.com',
      
      // Şifre sıfırlama hataları
      resetCodeInvalid: 'Doğrulama kodu hatalı veya süresi dolmuş.',
      resetCodeExpired: 'Doğrulama kodunun süresi doldu. Lütfen yeni kod isteyin.',
      tooManyRequests: 'Çok fazla deneme yaptınız. Lütfen birkaç dakika bekleyin.',
    },
    en: {
      // General errors
      network: 'Connection error. Please check your internet connection.',
      server: 'Server error. Please try again later.',
      unknown: 'An unexpected error occurred. Please try again.',
      
      // Login errors
      invalidCredentials: 'Invalid email or password. Please check your credentials.',
      accountLocked: 'Your account is temporarily locked. Please try again in a few minutes.',
      accountNotFound: 'No account found with this email address.',
      emailNotVerified: 'Your email has not been verified yet. Please check your inbox.',
      
      // Register errors
      emailExists: 'This email is already registered. Try a different email or login.',
      weakPassword: 'Password is too weak. Must contain at least 6 characters, one uppercase letter, and one number.',
      invalidEmail: 'Invalid email address format.',
      invalidPhone: 'Invalid phone number format.',
      invalidWebsite: 'Invalid website URL. Example: https://example.com',
      
      // Password reset errors
      resetCodeInvalid: 'Invalid or expired verification code.',
      resetCodeExpired: 'Verification code has expired. Please request a new one.',
      tooManyRequests: 'Too many attempts. Please wait a few minutes.',
    }
  };
  
  const msg = messages[language];
  
  // Network hatası kontrolü
  if (!error?.response || error?.code === 'ERR_NETWORK' || error?.code === 'ECONNABORTED') {
    return msg.network;
  }
  
  // HTTP status koduna göre mesaj belirle
  switch (statusCode) {
    case 400:
      // Bad Request - Backend'den gelen mesaja bakarak karar ver
      const errorLower = backendMessage.toLowerCase();
      
      if (errorLower.includes('email') && (errorLower.includes('exist') || errorLower.includes('already') || errorLower.includes('kayıtlı') || errorLower.includes('zaten') || errorLower.includes('registered') || errorLower.includes('taken'))) {
        return msg.emailExists;
      }
      if (errorLower.includes('password') || errorLower.includes('şifre')) {
        if (errorLower.includes('weak') || errorLower.includes('zayıf') || errorLower.includes('short') || errorLower.includes('kısa') || errorLower.includes('least') || errorLower.includes('minimum') || errorLower.includes('character')) {
          return msg.weakPassword;
        }
        return msg.weakPassword; // Şifre ile ilgili herhangi bir hata
      }
      if (errorLower.includes('email') && (errorLower.includes('invalid') || errorLower.includes('geçersiz') || errorLower.includes('format') || errorLower.includes('valid'))) {
        return msg.invalidEmail;
      }
      if (errorLower.includes('phone') || errorLower.includes('telefon')) {
        return msg.invalidPhone;
      }
      if (errorLower.includes('website') || errorLower.includes('url') || errorLower.includes('web')) {
        return msg.invalidWebsite;
      }
      if (errorLower.includes('name') || errorLower.includes('isim') || errorLower.includes('ad')) {
        return language === 'tr' ? 'Lütfen geçerli bir ad soyad giriniz.' : 'Please enter a valid name.';
      }
      if (errorLower.includes('required') || errorLower.includes('zorunlu') || errorLower.includes('empty') || errorLower.includes('boş')) {
        return language === 'tr' ? 'Lütfen tüm zorunlu alanları doldurunuz.' : 'Please fill in all required fields.';
      }
      // Genel 400 hatası - backend mesajını da ekleyelim (debug için faydalı)
      console.warn('400 Backend Error:', backendMessage); // Geliştirici için log
      return language === 'tr' 
        ? 'Girdiğiniz bilgilerde bir hata var. Lütfen tüm alanları kontrol edip tekrar deneyin.' 
        : 'There is an error in the information you entered. Please check all fields and try again.';
      
    case 401:
      // Unauthorized - Giriş hataları
      if (backendMessage.toLowerCase().includes('verified') || backendMessage.toLowerCase().includes('doğrulan')) {
        return msg.emailNotVerified;
      }
      return msg.invalidCredentials;
      
    case 403:
      // Forbidden - Hesap kilitli
      return msg.accountLocked;
      
    case 404:
      // Not Found - Hesap bulunamadı
      return msg.accountNotFound;
      
    case 409:
      // Conflict - Email zaten var
      return msg.emailExists;
      
    case 422:
      // Unprocessable Entity - Validation hatası
      if (backendMessage.toLowerCase().includes('code') || backendMessage.toLowerCase().includes('kod')) {
        return msg.resetCodeInvalid;
      }
      return msg.unknown;
      
    case 429:
      // Too Many Requests
      return msg.tooManyRequests;
      
    case 500:
    case 502:
    case 503:
      // Server errors
      return msg.server;
      
    default:
      return msg.unknown;
  }
}

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
