# 🔄 Proxy Ayarları - TradeScout

## 📋 Proxy Nedir?

Proxy, frontend'in backend API'sine erişirken kullandığı bir yönlendirme mekanizmasıdır.

**Avantajları:**
- ✅ CORS sorunlarını ortadan kaldırır
- ✅ Development ve Production'da aynı kod çalışır
- ✅ URL yönetimi daha kolay

---

## ⚙️ Mevcut Yapılandırma

### 1. `package.json` - Proxy Ayarı

```json
{
  "name": "tradescout",
  "proxy": "http://localhost:5000",
  ...
}
```

**Ne İşe Yarar?**
- Development'ta (`npm start`) frontend'den gelen `/api/*` istekleri otomatik olarak `http://localhost:5000/api/*`'a yönlendirilir
- CORS problemi olmaz çünkü aynı origin'den istek yapılıyor gibi görünür

### 2. `src/services/api.ts` - Base URL

```typescript
// Boş string = Relative path (proxy kullanılacak)
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';
```

**Nasıl Çalışır?**
- `REACT_APP_API_URL` boşsa → `/api/auth/login` (relative path)
- Proxy aktif → `http://localhost:5000/api/auth/login`'e yönlendirilir

### 3. `.env` - Environment Variables

```bash
# Development: Boş bırakın
REACT_APP_API_URL=

# Production: Backend URL'inizi yazın
# REACT_APP_API_URL=https://api.fgstrade.com
```

---

## 🚀 Development (Yerel Geliştirme)

### Adım 1: Backend'i Başlatın

```bash
cd backend_klasoru
dotnet run
# Backend çalışıyor: http://localhost:5000
```

### Adım 2: Frontend'i Başlatın

```bash
cd /Users/nuranguler/Desktop/TradeScout/tradescout
npm start
# Frontend çalışıyor: http://localhost:3000
```

### Adım 3: Test Edin

Frontend'den yapılan tüm `/api/*` istekleri otomatik olarak `http://localhost:5000/api/*`'a yönlendirilir.

**Örnek:**
```typescript
// Frontend'de
apiClient.post('/api/auth/login', { email, password })

// Gerçekte giden istek
// http://localhost:5000/api/auth/login
```

---

## 🌐 Production (Canlı Ortam)

### Seçenek 1: Environment Variable ile

#### `.env.production` dosyası oluşturun:

```bash
# Production Backend URL
REACT_APP_API_URL=https://api.fgstrade.com
```

#### Build alın:

```bash
npm run build
# Build klasörü oluşturuldu: /build
```

#### Sonuç:
- Tüm API istekleri `https://api.fgstrade.com/api/*` adresine gider
- Proxy kullanılmaz

### Seçenek 2: Reverse Proxy (Nginx/Apache)

Frontend ve backend'i aynı domain altında sunun.

#### Nginx Örneği:

```nginx
server {
    listen 80;
    server_name fgstrade.com;

    # Frontend (React build)
    location / {
        root /var/www/tradescout/build;
        try_files $uri /index.html;
    }

    # Backend API (Proxy)
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Avantajları:**
- ✅ Tek domain (CORS yok)
- ✅ HTTPS kolayca uygulanır
- ✅ Environment variable gerekmez

### Seçenek 3: Docker ile

#### `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: ./tradescout
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:5000

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
```

---

## 🧪 Test Senaryoları

### Development Test:

```bash
# Backend çalışıyor mu?
curl http://localhost:5000
# Response: {"message":"TradeScout API is running"}

# Frontend çalışıyor mu?
curl http://localhost:3000
# Response: HTML (React app)

# Proxy çalışıyor mu?
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
# Response: Backend'den gelecek (proxy yönlendirdi)
```

### Production Test:

```bash
# API çalışıyor mu?
curl https://api.fgstrade.com
# Response: Backend health check

# Frontend çalışıyor mu?
curl https://fgstrade.com
# Response: React app

# API entegrasyonu çalışıyor mu?
# Browser'da login yapın ve Network tab'inde istekleri kontrol edin
```

---

## 🐛 Sorun Giderme

### Sorun 1: CORS Hatası

**Belirti:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Çözüm:**
- ✅ `package.json`'da `"proxy": "http://localhost:5000"` olduğundan emin olun
- ✅ Frontend'i yeniden başlatın (`npm start`)
- ✅ Backend'de CORS middleware'ini kontrol edin

### Sorun 2: 404 Not Found

**Belirti:**
```
GET http://localhost:3000/api/auth/login 404 (Not Found)
```

**Çözüm:**
- ✅ Backend çalışıyor mu kontrol edin: `curl http://localhost:5000`
- ✅ Backend'in portu 5000 mi kontrol edin
- ✅ `package.json`'daki proxy ayarını kontrol edin

### Sorun 3: Timeout

**Belirti:**
```
Error: timeout of 600000ms exceeded
```

**Çözüm:**
- ✅ Backend çalışıyor mu?
- ✅ Backend işlemi tamamlanıyor mu?
- ✅ Timeout süresini artırın (10 dakikadan fazla sürüyorsa)

---

## 📊 Proxy vs Direct URL

| Özellik | Proxy (Önerilen) | Direct URL |
|---------|------------------|------------|
| CORS | ✅ Yok | ❌ Backend'de ayar gerekli |
| Setup | ✅ Kolay | ⚠️ Environment variable gerekli |
| Development | ✅ Hızlı | ⚠️ Her ortam için ayar |
| Production | ✅ Nginx ile kolay | ✅ Kolay |
| Debug | ✅ Kolay | ✅ Kolay |

---

## ✅ Önerilen Yapı (Production)

### 1. Nginx Reverse Proxy

**Domain:** `fgstrade.com`

- Frontend: `https://fgstrade.com/` → React build
- Backend: `https://fgstrade.com/api/` → ASP.NET Core (port 5000)

### 2. Avantajları

- ✅ Tek domain (CORS yok)
- ✅ HTTPS tek yerden yönetilir
- ✅ Cache ve load balancing yapılabilir
- ✅ Environment variable gerekmez

### 3. Deployment Adımları

```bash
# 1. Frontend build
cd tradescout
npm run build

# 2. Backend publish
cd backend
dotnet publish -c Release -o publish

# 3. Nginx configuration
sudo nano /etc/nginx/sites-available/fgstrade.com

# 4. Servisleri başlat
sudo systemctl restart nginx
cd backend/publish && dotnet TradeScout.API.dll
```

---

## 🎯 Sonuç

✅ **Development:** Proxy kullanılıyor (`package.json`)  
✅ **Production:** Nginx reverse proxy önerilir  
✅ **CORS:** Sorun yok  
✅ **Environment:** Minimal configuration

---

**Son güncelleme:** 2026-02-07 19:00  
**Durum:** ✅ Proxy aktif ve çalışıyor
