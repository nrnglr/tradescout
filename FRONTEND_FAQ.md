# Frontend Entegrasyon - Sık Sorulan Sorular (FAQ)

## 📋 Frontend Geliştiricisi İçin Önemli Bilgiler

### 1. API Servis Dosyası Yapısı

#### Önerilen Dosya Konumu:
```
src/
  └── services/
      ├── api.ts (veya api.js)          # Base API configuration
      ├── auth.service.ts                # Authentication işlemleri
      └── scraper.service.ts             # Scraping işlemleri
```

#### Alternatif Yapılar:
- **Next.js App Router**: `app/lib/services/` veya `app/api/client/`
- **React (Vite)**: `src/services/` veya `src/lib/api/`     
- **TypeScript**: `.ts` uzantısı kullanın
- **JavaScript**: `.js` uzantısı kullanın

### 2. Token Yönetimi - Detaylı Açıklama

#### ✅ Önerilen Yöntem: localStorage
```typescript
// Token'ı kaydetme
localStorage.setItem('token', jwtToken);

// Token'ı okuma
const token = localStorage.getItem('token');

// Token'ı silme (logout)
localStorage.removeItem('token');
```

#### Güvenlik Notları:
- ✅ **localStorage kullanın** - Browser kapatılınca silinmez, kullanıcı login kalır
- ⚠️ **sessionStorage** - Browser kapatılınca silinir (daha güvenli ama kullanıcı deneyimi kötü)
- ❌ **Cookie** - Backend tarafından set edilmeli, frontend için kompleks
- ❌ **State only** - Sayfa yenilenince kaybolur

#### Ek Bilgiler Saklama (Opsiyonel):
```typescript
// Kullanıcı bilgilerini de saklayabilirsiniz
localStorage.setItem('user', JSON.stringify({
  fullName: response.fullName,
  email: response.email,
  credits: response.credits
}));
```

### 3. Loading State Gösterimi - Seçenekler

#### Seçenek 1: Basit Spinner (Önerilen - Hızlı İşlemler İçin)
```typescript
const [isLoading, setIsLoading] = useState(false);

// Kullanım
if (isLoading) {
  return <div className="spinner">Loading...</div>;
}
```

**Ne Zaman Kullanılır:**
- Login/Register işlemleri (1-2 saniye)
- Excel download (anlık)
- Credit kontrolü (anlık)

#### Seçenek 2: Progress Bar (Önerilen - Scraping İçin)
```typescript
const [progress, setProgress] = useState(0);
const [status, setStatus] = useState('');

// Scraping sırasında güncelleme
setProgress(50); // %50 tamamlandı
setStatus('25/50 firma bulundu...');
```

**Ne Zaman Kullanılır:**
- Scraping işlemi (10-60 saniye sürebilir)
- Büyük veri indirme
- Uzun süren işlemler

#### Seçenek 3: Loading States ile Detaylı Gösterim
```typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
const [loadingState, setLoadingState] = useState<LoadingState>('idle');

// Kullanım
switch(loadingState) {
  case 'loading': return <Spinner />;
  case 'success': return <SuccessMessage />;
  case 'error': return <ErrorMessage />;
  default: return <Form />;
}
```

### 4. Detaylı API Servis Dosyası Örnekleri

#### A) Base API Configuration (`src/services/api.ts`)

```typescript
// src/services/api.ts
import axios from 'axios';

// Base URL - Environment variable'dan okunabilir
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Axios instance oluştur
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 saniye (scraping için uzun süre gerekli)
});

// Request interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
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

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz - Logout yap
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### B) Authentication Service (`src/services/auth.service.ts`)

```typescript
// src/services/auth.service.ts
import { apiClient } from './api';

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  companyName?: string;
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
    }));
    
    return response.data;
  }

  /**
   * Kullanıcı girişi
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    
    // Token'ı kaydet
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      fullName: response.data.fullName,
      email: response.data.email,
      credits: response.data.credits,
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
  getCurrentUser(): { fullName: string; email: string; credits: number } | null {
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
```

#### C) Scraper Service (`src/services/scraper.service.ts`)

```typescript
// src/services/scraper.service.ts
import { apiClient } from './api';

export interface ScrapeRequest {
  searchQuery: string;
  maxResults: number;
}

export interface Business {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  category: string | null;
  googleMapsUrl: string | null;
}

export interface ScrapeResponse {
  success: boolean;
  message: string;
  jobId: number;
  businessesFound: number;
  creditsUsed: number;
  businesses: Business[];
}

export interface JobHistory {
  id: number;
  searchQuery: string;
  status: string;
  businessesFound: number;
  creditsUsed: number;
  createdAt: string;
}

export interface CreditsResponse {
  credits: number;
  packageType: string;
  message: string;
}

class ScraperService {
  /**
   * Scraping başlat
   * @param data - Scraping parametreleri
   * @returns Scraping sonucu
   */
  async scrape(data: ScrapeRequest): Promise<ScrapeResponse> {
    const response = await apiClient.post<ScrapeResponse>('/api/scraper/scrape', data);
    return response.data;
  }

  /**
   * Excel dosyası indir
   * @param jobId - İş ID'si
   */
  async downloadExcel(jobId: number): Promise<void> {
    const response = await apiClient.get(`/api/scraper/download/${jobId}`, {
      responseType: 'blob', // Önemli: Excel dosyası için blob kullan
    });

    // Dosyayı indir
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `businesses_${jobId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Scraping geçmişini getir
   */
  async getHistory(): Promise<JobHistory[]> {
    const response = await apiClient.get<JobHistory[]>('/api/scraper/history');
    return response.data;
  }

  /**
   * Mevcut kredi bakiyesini getir
   */
  async getCredits(): Promise<CreditsResponse> {
    const response = await apiClient.get<CreditsResponse>('/api/scraper/credits');
    return response.data;
  }
}

export const scraperService = new ScraperService();
```

### 5. React Component Örnekleri

#### Login Component (Basit Spinner ile)

```typescript
// src/components/Login.tsx
import { useState } from 'react';
import { authService } from '../services/auth.service';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      console.log('Login başarılı:', response);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Giriş Yap</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
    </form>
  );
}
```

#### Scraper Component (Progress Bar ile)

```typescript
// src/components/Scraper.tsx
import { useState } from 'react';
import { scraperService } from '../services/scraper.service';

export function Scraper() {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setStatus('Scraping başlatılıyor...');
    setError('');
    setResults(null);

    try {
      // İlerleme simülasyonu (gerçek API'de backend'den gelecek)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 2000);

      const response = await scraperService.scrape({
        searchQuery,
        maxResults,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setStatus('Scraping tamamlandı!');
      setResults(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Scraping başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (jobId: number) => {
    try {
      await scraperService.downloadExcel(jobId);
      alert('Excel dosyası indirildi!');
    } catch (err) {
      alert('İndirme başarısız');
    }
  };

  return (
    <div>
      <h2>Google Maps Scraper</h2>

      <form onSubmit={handleScrape}>
        <input
          type="text"
          placeholder="Arama sorgusu (örn: restaurants in Istanbul)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
          required
        />

        <input
          type="number"
          placeholder="Firma sayısı"
          value={maxResults}
          onChange={(e) => setMaxResults(parseInt(e.target.value))}
          min="1"
          max="100"
          disabled={isLoading}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Scraping yapılıyor...' : 'Scraping Başlat'}
        </button>
      </form>

      {/* Progress Bar */}
      {isLoading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
          <p>{status}</p>
        </div>
      )}

      {/* Sonuçlar */}
      {results && (
        <div className="results">
          <h3>✅ Scraping Tamamlandı!</h3>
          <p>Bulunan Firma: {results.businessesFound}</p>
          <p>Kullanılan Kredi: {results.creditsUsed}</p>
          <button onClick={() => handleDownload(results.jobId)}>
            📥 Excel İndir
          </button>

          <div className="businesses">
            <h4>Bulunan Firmalar:</h4>
            {results.businesses.map((business: any) => (
              <div key={business.id} className="business-card">
                <h5>{business.name}</h5>
                <p>{business.address}</p>
                <p>📞 {business.phone || 'N/A'}</p>
                <p>⭐ {business.rating || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hata mesajı */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### 6. CSS Örnekleri

```css
/* Loading Spinner */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Progress Bar */
.progress-container {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 8px;
  margin: 20px 0;
  overflow: hidden;
}

.progress-bar {
  height: 30px;
  background-color: #4CAF50;
  text-align: center;
  line-height: 30px;
  color: white;
  transition: width 0.3s ease;
  border-radius: 8px;
}

/* Error Message */
.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #c62828;
  margin: 10px 0;
}

/* Success Message */
.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #2e7d32;
  margin: 10px 0;
}
```

### 7. Environment Variables (.env)

```bash
# Frontend .env dosyası
REACT_APP_API_URL=http://localhost:5000

# Production için
# REACT_APP_API_URL=https://api.fgstrade.com
```

### 8. TypeScript Interface'leri (types.ts)

```typescript
// src/types/api.types.ts

export interface User {
  id: number;
  fullName: string;
  email: string;
  credits: number;
  packageType: 'Free' | 'Basic' | 'Premium';
  role: 'User' | 'Admin';
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  credits: number;
  role: string;
  packageType: string;
}

export interface Business {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  category: string | null;
  googleMapsUrl: string | null;
}

export interface ScrapeResponse {
  success: boolean;
  message: string;
  jobId: number;
  businessesFound: number;
  creditsUsed: number;
  businesses: Business[];
}
```

---

## 🎯 Özet - Frontend Geliştiricisi İçin Checklist

### ✅ Yapılması Gerekenler:

1. **API Servis Dosyaları Oluştur**
   - [ ] `src/services/api.ts` - Base configuration ve interceptors
   - [ ] `src/services/auth.service.ts` - Login/Register işlemleri (veya mevcut auth.ts'i güncelle)
   - [ ] `src/services/scraper.service.ts` - Scraping işlemleri (veya mevcut scraper.ts'i güncelle)

2. **Token Yönetimi**
   - [ ] Login/Register'da token'ı `localStorage.setItem('token', token)` ile kaydet
   - [ ] Her API isteğinde `Authorization: Bearer ${token}` header'ı ekle
   - [ ] 401 hatası gelirse logout yap ve login sayfasına yönlendir

3. **Loading States**
   - [ ] **Login/Register**: Basit spinner kullan
   - [ ] **Scraping**: Progress bar + status mesajı kullan
   - [ ] **Excel Download**: Basit spinner veya "İndiriliyor..." mesajı

4. **Hata Yönetimi**
   - [ ] API hatalarını yakala ve kullanıcıya göster
   - [ ] 401 → Logout yap
   - [ ] 400 → Validation hatası göster
   - [ ] 500 → "Sunucu hatası" göster

5. **Test Et**
   - [ ] Login işlemi çalışıyor mu?
   - [ ] Token kaydediliyor mu?
   - [ ] Scraping başlıyor mu?
   - [ ] Excel indiriliyor mu?
   - [ ] Logout çalışıyor mu?

---

## 📞 Sorular İçin

Eğer frontend geliştiricisinin başka soruları olursa:

- **Backend API**: `http://localhost:5000`
- **Health Check**: `GET /`
- **API Dokümantasyonu**: `API_REFERENCE.md` (backend klasöründe)
- **Detaylı Frontend Kullanımı**: `FRONTEND_KULLANIM.md` (backend klasöründe)

**Backend hazır ve çalışıyor! Frontend entegrasyonu için her şey mevcut.** 🚀

---

## 🔧 Mevcut Proje Durumu

Bu projede zaten şunlar mevcut:
- ✅ `src/services/api.ts` - Base API configuration (axios instance, interceptors)
- ✅ `src/services/auth.ts` - Authentication servisi
- ✅ `src/services/scraper.ts` - Scraper servisi
- ✅ `src/pages/Dashboard.tsx` - API entegrasyonu ile çalışan dashboard
- ✅ `.env` ve `.env.example` - Environment variables
- ✅ `API_INTEGRATION.md` - Detaylı entegrasyon dökümanı

**Proje hazır ve çalışır durumda!** Bu FAQ, ekip üyeleri ve yeni geliştiriciler için ek bir referans dökümanıdır.
