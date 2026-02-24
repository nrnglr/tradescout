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

// Request interceptor - Her istekte token ekle (login/register hariç)
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 AXIOS REQUEST INTERCEPTOR:');
    console.log('  - URL:', config.url);
    console.log('  - Method:', config.method);
    console.log('  - Headers:', config.headers);
    console.log('  - Data:', config.data);
    
    // Login ve Register endpoint'lerine token ekleme (public endpoints)
    const publicEndpoints = ['/api/auth/login', '/api/auth/register'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('  - ✅ Authorization header eklendi:', `Bearer ${token.substring(0, 20)}...`);
      } else {
        console.warn('⚠️ Token bulunamadı - API isteği reddedilebilir');
      }
    } else {
      console.log('  - 🔓 Public endpoint - Token eklenmedi');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Hatası:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 AXIOS RESPONSE - SUCCESS:');
    console.log('  - URL:', response.config.url);
    console.log('  - Status:', response.status);
    console.log('  - Headers:', response.headers);
    console.log('  - Data:', response.data);
    return response;
  },
  (error) => {
    console.error('📥 AXIOS RESPONSE - ERROR:');
    console.error('  - Status:', error.response?.status);
    console.error('  - URL:', error.response?.config?.url);
    console.error('  - Data:', error.response?.data);
    console.error('  - Headers:', error.response?.headers);
    console.error('  - Full error:', error);
    
    // 401 hatası gelirse sadece hatayı fırlat
    // Logout işlemini component'ler kendi handle etsin (kullanıcıya mesaj gösterebilsinler)
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Token geçersiz veya eksik');
      // Burada logout YAPMA, component'e bırak
    }
    return Promise.reject(error);
  }
);
