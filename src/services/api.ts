// Base API Configuration
import axios from 'axios';

// Base URL - Environment variable'dan okunabilir
// Development: localhost:5000
// Production: Backend URL (ör. https://api.fgstrade.com)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Axios instance oluştur
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 600000, // 10 dakika (600000ms) - Scraping uzun sürebilir
});

// Request interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ Token bulunamadı - API isteği reddedilebilir');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 hatası gelirse sadece hatayı fırlat
    // Logout işlemini component'ler kendi handle etsin (kullanıcıya mesaj gösterebilsinler)
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Token geçersiz veya eksik');
      // Burada logout YAPMA, component'e bırak
    }
    return Promise.reject(error);
  }
);
