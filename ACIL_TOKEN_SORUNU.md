# 🚨 Acil Durum Raporu - Token Authentication Sorunu

## 📊 Mevcut Durum

**Tarih:** 7 Şubat 2026  
**Durum:** 🔴 Backend JWT Token Validation Hatası  
**Etki:** Kullanıcılar scraping yapamıyor  

---

## ✅ Frontend (HAZIR)

- ✅ Login/Register çalışıyor
- ✅ Token localStorage'a kaydediliyor
- ✅ Token API'ye gönderiliyor (`Authorization: Bearer <token>`)
- ✅ Timeout 10 dakikaya çıkarıldı
- ✅ UI/UX responsive ve modern
- ✅ Hata yönetimi eksiksiz

**Frontend'de yapılacak bir şey YOK.**

---

## ❌ Backend (SORUNLU)

### Hata:
```
POST /api/scraper/scrape
401 Unauthorized
{"message":"Geçersiz kullanıcı token'ı"}
```

### Neden:
Backend token'ı doğrulayamıyor.

### Çözüm (Backend Developer İçin):

#### 1️⃣ JWT Secret Kontrolü (EN ÖNEMLİ)
```bash
# appsettings.json veya environment variable
"Jwt": {
  "Secret": "AYNI_SECRET_OLMALI_HER_YERDE"
}
```

#### 2️⃣ Middleware Sırası
```csharp
// Program.cs
app.UseAuthentication(); // ÖNCE
app.UseAuthorization();  // SONRA
```

#### 3️⃣ Backend Yeniden Başlat
```bash
dotnet run
```

---

## 🧪 Test Komutu

```bash
# 1. Login yap
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"gulernuran9@gmail.com","password":"your_password"}'

# 2. Response'dan token'ı kopyala

# 3. Scraper test et
curl -X POST http://localhost:5000/api/scraper/scrape \
  -H "Authorization: Bearer <TOKEN_BURAYA>" \
  -H "Content-Type: application/json" \
  -d '{"category":"mobilya","city":"istanbul","country":"Turkey","language":"tr","maxResults":3}'

# BEKLENEN: 200 OK ve firmalar
# MEVCUT: 401 Unauthorized
```

---

## 📄 Detaylı Dökümantasyon

1. **BACKEND_JWT_ISSUE.md** - Backend sorunun detaylı analizi ve çözümü
2. **TIMEOUT_FIX.md** - Frontend timeout düzeltmeleri
3. **FRONTEND_FAQ.md** - Frontend developer için rehber
4. **API_INTEGRATION.md** - API entegrasyon dökümanı

---

## 🎯 Hızlı Çözüm (Backend)

```bash
cd backend_klasoru

# 1. appsettings.json kontrol et
cat appsettings.json

# 2. JWT Secret değiştir (eğer farklıysa)
# Dosyayı düzenle, Secret değerini güncelle

# 3. Backend yeniden başlat
dotnet run

# 4. Test et
curl -X POST http://localhost:5000/api/auth/login ...
```

---

## ✅ Düzeltme Sonrası Beklenen

1. ✅ Login yapıldığında token alınıyor
2. ✅ Dashboard'da Firma Ara butonu çalışıyor
3. ✅ Scraping başlıyor (loading gösteriliyor)
4. ✅ Sonuçlar geliyor
5. ✅ Excel'e aktarılabiliyor

---

## 📞 İletişim

**Frontend:** ✅ Hazır  
**Backend:** ⚠️ JWT token sorunu çözülmeli

Bu README'yi backend developer'a gönderin!

