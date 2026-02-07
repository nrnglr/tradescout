# 🧪 API Test Rehberi

## Sorun: "Firma Ara" Butonuna Basınca Hata Veriyor

### ✅ Yapılan İyileştirmeler:

1. **Detaylı Console Log Eklendi**
   - Token kontrolü
   - User kontrolü
   - API istek/yanıt detayları
   - Hata detayları

2. **Gelişmiş Hata Yönetimi**
   - Backend hata mesajları düzgün gösteriliyor
   - Network hataları yakalanıyor
   - 401 (Yetkisiz) hataları özel olarak handle ediliyor

3. **Token Kontrolü Güçlendirildi**
   - Dashboard yüklenirken token ve user kontrolü yapılıyor
   - Firma ara butonu basıldığında token kontrolü yapılıyor

---

## 🔍 Test Adımları

### 1. Backend Çalışıyor mu Kontrol Et

Terminal'de şu komutu çalıştır:

```bash
curl http://localhost:5000
```

**Beklenen Sonuç:**
```json
{"message":"FortexGlobe API is running"}
```

**Eğer hata alıyorsan:** Backend çalışmıyor, önce backend'i başlatman gerekiyor.

---

### 2. Kayıt Ol ve Login Ol

#### A) Kayıt Ol (Register)
Terminal'de:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "companyName": "Test Company"
  }'
```

**Beklenen Sonuç:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "fullName": "Test User",
  "email": "test@example.com",
  "credits": 10,
  "role": "User",
  "packageType": "Free"
}
```

#### B) Login Ol
Terminal'de:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Beklenen Sonuç:** Yukarıdaki ile aynı (token + user bilgileri)

---

### 3. Browser'da Test Et

#### A) Browser Açık Console
1. Chrome/Firefox'ta `F12` tuşuna bas
2. `Console` sekmesini aç

#### B) Login Sayfasına Git
- http://localhost:3000/login
- Email: `test@example.com`
- Password: `test123`
- Login butonuna bas

#### C) Console'da Şunları Gör:
```
🔍 Dashboard Debug:
Token var mı? true
User var mı? true
Token: eyJhbGciOiJIUzI1NiIs...
User: {"fullName":"Test User","email":"test@example.com","credits":10}
```

**Eğer token veya user YOK görüyorsan:** Login başarısız olmuş, backend'e bağlanamıyor.

---

### 4. Firma Ara Testi

Dashboard'da:
1. **Ürün İsmi:** "Restaurant"
2. **Şehir:** "Istanbul"
3. **Firma Sayısı:** 5
4. **"Firma Ara"** butonuna bas

#### Console'da Göreceğin Log'lar:

```
🔍 Firma Ara başlatıldı
Token mevcut mu? true
User mevcut mu? true

📡 API isteği gönderiliyor...
Parametreler: {
  category: "Restaurant",
  city: "Istanbul",
  country: "Türkiye",
  language: "tr",
  maxResults: 5
}

✅ API isteği başarılı: { jobId: 1, status: "completed", ... }
```

---

## ❌ Hata Durumları ve Çözümleri

### Hata 1: "Sunucuya bağlanılamıyor"
**Sebep:** Backend çalışmıyor
**Çözüm:**
```bash
cd backend
npm install
npm run dev
```

### Hata 2: "Oturumunuz sona erdi"
**Sebep:** Token geçersiz veya süresi dolmuş
**Çözüm:**
- Logout yap
- Tekrar login ol
- veya `localStorage.clear()` console'da çalıştır

### Hata 3: "Token yok" (Console'da)
**Sebep:** Login başarısız olmuş
**Çözüm:**
1. Backend çalışıyor mu kontrol et (`curl http://localhost:5000`)
2. Network sekmesinde `/api/auth/login` isteğine bak
3. Hata mesajını oku

### Hata 4: "CORS Error"
**Sebep:** Backend CORS ayarı yanlış
**Çözüm:** Backend'in `server.js` dosyasında:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Hata 5: "Cannot GET /api/scraper/scrape"
**Sebep:** Backend route'u yanlış veya eksik
**Çözüm:** Backend'de `routes/scraper.js` dosyasını kontrol et

---

## 🛠️ Manuel Test (Browser Console)

Browser console'da şunu çalıştır:

```javascript
// 1. Token var mı?
console.log('Token:', localStorage.getItem('token'));

// 2. User var mı?
console.log('User:', localStorage.getItem('user'));

// 3. Manuel API testi
fetch('http://localhost:5000/api/scraper/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    category: 'Restaurant',
    city: 'Istanbul',
    country: 'Türkiye',
    language: 'tr',
    maxResults: 5
  })
})
.then(res => res.json())
.then(data => console.log('✅ Başarılı:', data))
.catch(err => console.error('❌ Hata:', err));
```

---

## 📊 Başarılı Test Sonucu

Eğer her şey doğru çalışıyorsa Console'da şunu göreceksin:

```
🔍 Firma Ara başlatıldı
Token mevcut mu? true
User mevcut mu? true
📡 API isteği gönderiliyor...
Parametreler: { category: "Restaurant", city: "Istanbul", ... }
✅ API isteği başarılı: {
  jobId: 1,
  status: "completed",
  message: "Scraping completed successfully",
  totalResults: 5,
  creditsUsed: 5,
  businesses: [...],
  downloadUrl: "..."
}
```

Ve ekranda:
- ✅ **5 firma bulundu** mesajı
- 📊 Firma listesi görünür
- 📥 "Excel İndir" butonu aktif

---

## 🚀 Hızlı Debug Komutları

```bash
# Backend çalışıyor mu?
curl http://localhost:5000

# Health check
curl http://localhost:5000/health

# Token'ı test et (TOKEN'i kendi token'inle değiştir)
curl http://localhost:5000/api/scraper/credits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Frontend çalışıyor mu?
curl http://localhost:3000
```

---

## 📝 Notlar

1. **Backend önce başlamalı** (`npm run dev` backend klasöründe)
2. **Frontend sonra başlamalı** (`npm start` frontend klasöründe)
3. **Browser cache temizle** eğer garip hatalar alıyorsan
4. **Console log'ları takip et** gerçek hatayı görmek için

---

## 🆘 Hala Çalışmıyorsa

1. **Browser Console'u tamamen oku** - Gerçek hata mesajı orada
2. **Network sekmesini kontrol et** - Hangi API çağrısı başarısız oluyor?
3. **Backend terminal'ini kontrol et** - Backend'de hata var mı?
4. **Token'ı kontrol et** - `localStorage.getItem('token')` console'da çalıştır
5. **Bu dosyayı takip et** - Adım adım her testi yap

**İyi şanslar! 🚀**
