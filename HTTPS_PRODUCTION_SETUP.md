# HTTPS Production Setup - TradeScout Frontend

## 📋 Özet
Frontend uygulaması artık production ortamında HTTPS üzerinden backend API'ye bağlanacak şekilde yapılandırılmıştır.

## 🔧 Yapılan Değişiklikler

### 1. Environment Variables (.env)
```properties
# Production için HTTPS URL
REACT_APP_API_URL=https://fgstrade.com/api

# Development için (yoruma alındı)
# REACT_APP_API_URL=http://localhost:5000
```

### 2. API Configuration (src/services/api.ts)
- Base URL otomatik olarak environment variable'dan okunur
- Development: `http://localhost:5000` veya boş string (proxy kullanır)
- Production: `https://fgstrade.com/api` (direkt HTTPS bağlantı)
- Timeout: 10 dakika (600000ms) - Scraping için yeterli süre

## 🌐 URL Yapılandırması

### Development Ortamı
```bash
# .env dosyasında
REACT_APP_API_URL=http://localhost:5000

# veya boş bırakarak proxy kullan (package.json'daki proxy config)
REACT_APP_API_URL=
```

Frontend istekleri:
- `http://localhost:3000` → Frontend React app
- `/api/*` istekleri → `http://localhost:5000` (proxy ile yönlendirilir)

### Production Ortamı
```bash
# .env dosyasında
REACT_APP_API_URL=https://fgstrade.com/api
```

Frontend istekleri:
- `https://fgstrade.com` → Frontend static files
- API istekleri → `https://fgstrade.com/api` (direkt HTTPS)

## 🔐 HTTPS Gereksinimleri

### Backend'de Olması Gerekenler
1. **SSL Sertifikası**: Let's Encrypt, SSL.com vb.
2. **HTTPS Listener**: Port 443 (standart HTTPS portu)
3. **CORS Ayarları**: Frontend domain'ine izin verilmeli
   ```javascript
   // Backend CORS config
   {
     origin: 'https://fgstrade.com',
     credentials: true
   }
   ```

4. **HTTP → HTTPS Redirect**: Otomatik yönlendirme (önerilen)

### Frontend Build Ayarları
```bash
# Production build oluştur
npm run build

# Build dosyaları /build klasöründe
# Bu dosyaları web server'a deploy et
```

## 📡 API Endpoint'leri (HTTPS)

### Authentication
- POST `https://fgstrade.com/api/auth/register`
- POST `https://fgstrade.com/api/auth/login`

### Scraping (Gemini AI - Backend ChromeDriver)
- POST `https://fgstrade.com/api/scraper/scrape-gemini`
  - Kullanıcıdan gizli: Backend'de ChromeDriver kullanılır
  - Timeout: 10 dakika
  - Request body:
    ```json
    {
      "query": "arama terimi",
      "maxResults": 20
    }
    ```

### User Management
- GET `https://fgstrade.com/api/users/profile`
- PUT `https://fgstrade.com/api/users/profile`

## 🧪 Test Etme

### 1. Local Test (Development)
```bash
# .env dosyasını development için ayarla
REACT_APP_API_URL=http://localhost:5000

# Backend'i başlat (ayrı terminal)
cd backend
npm start

# Frontend'i başlat
npm start

# Test: http://localhost:3000
```

### 2. Production Test
```bash
# .env dosyasını production için ayarla
REACT_APP_API_URL=https://fgstrade.com/api

# Production build oluştur
npm run build

# Build'i test et (local server ile)
npx serve -s build -p 3000

# Test: http://localhost:3000 (HTTPS API'ye bağlanır)
```

### 3. SSL/HTTPS Test
```bash
# Backend HTTPS endpoint'ini test et
curl -v https://fgstrade.com/api/health

# Beklenen: 200 OK ve SSL handshake başarılı
```

## 🐛 Sık Karşılaşılan Sorunlar

### 1. CORS Hatası
**Hata**: `Access-Control-Allow-Origin` hatası
**Çözüm**: Backend CORS config'ini kontrol et
```javascript
// Backend'de
app.use(cors({
  origin: 'https://fgstrade.com',
  credentials: true
}));
```

### 2. SSL Certificate Hatası
**Hata**: `NET::ERR_CERT_AUTHORITY_INVALID`
**Çözüm**: 
- Geçerli SSL sertifikası yükle
- Let's Encrypt ile ücretsiz sertifika al
- Domain DNS ayarlarını kontrol et

### 3. Mixed Content Hatası
**Hata**: HTTPS sayfasında HTTP kaynaklar yüklenemez
**Çözüm**: Tüm kaynakları (API, CDN, resimler) HTTPS yap

### 4. Timeout Hatası
**Hata**: Scraping sırasında timeout
**Çözüm**: 
- Timeout değeri zaten 10 dakika (yeterli)
- Backend'de de timeout artırılmalı
- Nginx/reverse proxy timeout ayarlarını kontrol et

## 📊 Performans İyileştirmeleri

### 1. CDN Kullanımı
```bash
# Build dosyalarını CDN'e yükle (CloudFlare, AWS CloudFront vb.)
npm run build
# /build klasörünü CDN'e upload et
```

### 2. Gzip Compression
```nginx
# Nginx config
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. Caching Headers
```nginx
# Static dosyalar için cache
location /static {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## 🔄 Deployment Workflow

### Adım 1: Environment Ayarla
```bash
# Production .env
REACT_APP_API_URL=https://fgstrade.com/api
REACT_APP_NAME=TradeScout
REACT_APP_VERSION=1.0.0
```

### Adım 2: Build Oluştur
```bash
npm run build
# Output: /build klasörü
```

### Adım 3: Deploy
```bash
# Build dosyalarını server'a kopyala
scp -r build/* user@server:/var/www/fgstrade.com/

# veya GitHub Actions, Vercel, Netlify vb. kullan
```

### Adım 4: Verify
```bash
# Site'yi test et
curl -I https://fgstrade.com
# Beklenen: 200 OK

# API'yi test et
curl https://fgstrade.com/api/health
# Beklenen: {"status": "ok"}
```

## 📝 Checklist

- [x] `.env` dosyasında HTTPS URL ayarlandı
- [x] API client timeout 10 dakikaya çıkarıldı
- [x] Gemini AI scraping endpoint yapılandırıldı
- [x] Kullanıcıdan scraping method gizlendi
- [ ] Backend HTTPS endpoint'i erişilebilir durumda
- [ ] SSL sertifikası yüklendi ve geçerli
- [ ] CORS ayarları yapılandırıldı
- [ ] Production build test edildi
- [ ] Domain DNS ayarları yapıldı

## 🔗 İlgili Dökümanlar
- `PROXY_SETUP.md` - Development proxy yapılandırması
- `TIMEOUT_FIX.md` - Timeout artırma detayları
- `GEMINI_AI_FRONTEND.md` - Gemini AI entegrasyonu
- `BACKEND_JWT_ISSUE.md` - Token yönetimi

## 📞 Destek
Herhangi bir sorun için backend ekibiyle iletişime geçin ve SSL sertifikası kurulumunu doğrulayın.
