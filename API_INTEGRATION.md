# TradeScout Frontend - API Entegrasyon Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler
- Node.js 16+
- npm veya yarn
- Backend API (http://localhost:5000)

### 2. Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env

# Geliştirme sunucusunu başlat
npm start
```

### 3. Environment Ayarları

`.env` dosyasını düzenleyin:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 📁 Proje Yapısı

```
src/
├── services/
│   ├── api.ts           # Base API configuration (Axios)
│   ├── auth.ts          # Authentication servisleri
│   └── scraper.ts       # Scraper servisleri
├── pages/
│   ├── LandingPage.tsx  # Ana sayfa
│   ├── Login.tsx        # Giriş sayfası
│   ├── Register.tsx     # Kayıt sayfası
│   └── Dashboard.tsx    # Dashboard (Scraper arayüzü)
└── assent/
    └── fgs-logo.png     # Logo
```

---

## 🔧 API Servisleri

### **auth.ts** - Authentication

```typescript
import { authService } from './services/auth';

// Kayıt
const response = await authService.register({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  companyName: 'My Company' // opsiyonel
});

// Giriş
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123'
});

// Çıkış
authService.logout();

// Token kontrolü
const isLoggedIn = authService.isAuthenticated();

// Kullanıcı bilgileri
const user = authService.getCurrentUser();
```

### **scraper.ts** - Scraping İşlemleri

```typescript
import { scraperService } from './services/scraper';

// Firma ara
const response = await scraperService.scrape({
  category: 'Kafe',
  city: 'İstanbul',
  country: 'Türkiye',
  language: 'tr',
  maxResults: 10
});

// Kredi sorgula
const credits = await scraperService.getCredits();

// İş durumu sorgula
const status = await scraperService.getJobStatus(jobId);

// Excel indir
await scraperService.downloadExcel(jobId);
```

---

## 🔐 Token Yönetimi

Token otomatik olarak yönetilir:

1. **Login/Register** sonrası token `localStorage`'a kaydedilir
2. Her API isteğinde **otomatik** olarak `Authorization` header'ına eklenir
3. **401 hatası** durumunda otomatik logout yapılır

```typescript
// api.ts içinde otomatik yönetim
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🎯 Dashboard Kullanımı

Dashboard sayfasında kullanıcı firma arayabilir:

### Arama Parametreleri
- **Ürün/Kategori**: Ne satıyorsunuz? (örn: Kafe, Restaurant)
- **Şehir**: Hedef şehir (örn: İstanbul)
- **Ülke**: Hedef ülke (varsayılan: Türkiye)
- **Dil**: Arama dili (varsayılan: tr)
- **Firma Sayısı**: Kaç firma bulunacak? (1-100 arası)

### Arama Akışı

1. Kullanıcı formu doldurur
2. "Firma Ara" butonuna tıklar
3. **Kredi kontrolü** yapılır
4. **Loading state** gösterilir (~X dakika sürebilir)
5. **Sonuçlar** listelenir
6. **Excel** indirme seçeneği sunulur

### Örnek Kod

```typescript
const handleSearch = async () => {
  setIsLoading(true);
  try {
    const response = await scraperService.scrape({
      category: searchParams.product,
      city: searchParams.city,
      country: searchParams.country || 'Türkiye',
      language: searchParams.language || 'tr',
      maxResults: parseInt(searchParams.companyCount),
    });
    
    setSearchResults(response);
    // Kredi güncelleme
    const updatedUser = { ...user, credits: user.credits - response.creditsUsed };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## ⚠️ Hata Yönetimi

### Yaygın Hatalar

| Hata Kodu | Açıklama | Çözüm |
|-----------|----------|-------|
| **401** | Token geçersiz | Otomatik logout + login'e yönlendir |
| **402** | Yetersiz kredi | Kullanıcıya uyarı göster |
| **400** | Geçersiz parametreler | Validasyon hatası göster |
| **500** | Sunucu hatası | "Bir hata oluştu" mesajı |

### Örnek Hata Yakalama

```typescript
try {
  const response = await scraperService.scrape(data);
} catch (error: any) {
  if (error.response?.status === 402) {
    setError('Yetersiz kredi!');
  } else {
    setError(error.message || 'Bir hata oluştu');
  }
}
```

---

## 📊 State Yönetimi

Dashboard'da kullanılan state'ler:

```typescript
const [user, setUser] = useState(null);                    // Kullanıcı bilgileri
const [searchParams, setSearchParams] = useState({...});   // Arama parametreleri
const [isLoading, setIsLoading] = useState(false);         // Loading durumu
const [searchResults, setSearchResults] = useState(null);  // Arama sonuçları
const [error, setError] = useState('');                    // Hata mesajı
```

---

## 🎨 UI Bileşenleri

### Loading State
```tsx
{isLoading && (
  <Box sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: '12px' }}>
    <Typography>⏳ Firmalar aranıyor...</Typography>
    <Typography>
      Bu işlem ~{Math.ceil(firmaSayisi / 20 * 5)} dakika sürebilir
    </Typography>
  </Box>
)}
```

### Hata Mesajı
```tsx
{error && (
  <Box sx={{ bgcolor: '#ffebee', p: 2, borderRadius: '12px' }}>
    <Typography sx={{ color: '#c62828' }}>⚠️ {error}</Typography>
  </Box>
)}
```

### Sonuç Listesi
```tsx
{searchResults && (
  <Box>
    <Typography>✅ {searchResults.totalResults} Firma Bulundu!</Typography>
    {searchResults.businesses.map(business => (
      <Paper key={business.id}>
        <Typography>{business.businessName}</Typography>
        <Typography>📍 {business.address}</Typography>
        <Typography>📞 {business.phone}</Typography>
      </Paper>
    ))}
  </Box>
)}
```

---

## 🔄 API Response Yapısı

### Register/Login Response
```json
{
  "token": "eyJhbGci...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "credits": 100,
  "role": "User",
  "packageType": "Premium"
}
```

### Scrape Response
```json
{
  "jobId": 123,
  "status": "Completed",
  "message": "10 işletme bulundu",
  "totalResults": 10,
  "creditsUsed": 10,
  "businesses": [...],
  "downloadUrl": "/api/scraper/download/123"
}
```

---

## 📥 Excel İndirme

Excel indirme işlemi:

1. **Blob** olarak indirilir
2. **Otomatik** dosya adı oluşturulur: `TradeScout_2026-02-07_123.xlsx`
3. **Tarayıcı** download işlemini otomatik başlatır

```typescript
async downloadExcel(jobId: number) {
  const response = await apiClient.get(`/api/scraper/download/${jobId}`, {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `TradeScout_${new Date().toISOString().split('T')[0]}_${jobId}.xlsx`;
  link.click();
}
```

---

## 🧪 Test Edilmesi Gerekenler

- [ ] Login işlemi çalışıyor mu?
- [ ] Register işlemi çalışıyor mu?
- [ ] Token kaydediliyor mu?
- [ ] Dashboard'a erişim var mı?
- [ ] Scraping başlıyor mu?
- [ ] Loading state gösteriliyor mu?
- [ ] Sonuçlar listeleniyor mu?
- [ ] Excel indiriliyor mu?
- [ ] Kredi düşüyor mu?
- [ ] Logout çalışıyor mu?
- [ ] 401 hatası logout tetikliyor mu?

---

## 🚨 Önemli Notlar

1. **Backend çalışıyor olmalı**: `http://localhost:5000`
2. **CORS ayarları**: Backend'de frontend origin'i izin verilmiş olmalı
3. **Token süresi**: Token'ın expire süresi backend'de ayarlanır
4. **Kredi sistemi**: Her firma 1 kredi tüketir
5. **Rate limiting**: Her 20 firmada 60 saniye bekleme vardır (ban koruması)

---

## 📞 Destek

Sorun yaşarsanız:
- Backend loglarını kontrol edin
- Network tab'ı inceleyin (F12 > Network)
- Console'da hata var mı bakın (F12 > Console)

**API Dokümantasyonu**: Backend projesinde `API_REFERENCE.md`

---

## 🎉 Başarılar!

API entegrasyonu tamamlandı. Artık kullanıcılar:
- ✅ Kayıt olabilir
- ✅ Giriş yapabilir
- ✅ Firma arayabilir
- ✅ Excel indirebilir
- ✅ Kredilerini görebilir

**TradeScout hazır! 🚀**
