# Backend JWT Token Sorunu - Rapor

## 🚨 Problem
Frontend'den gönderilen token backend tarafından reddediliyor.

**Hata Mesajı:** "Geçersiz kullanıcı token'ı"

## 📊 Durum Özeti

### ✅ Çalışan:
- Login endpoint (`/api/auth/login`) - Token üretiyor
- Register endpoint (`/api/auth/register`) - Kullanıcı kaydediyor
- Frontend token'ı doğru gönderiyor (`Authorization: Bearer <token>`)

### ❌ Çalışmayan:
- Scraper endpoint (`/api/scraper/scrape`) - 401 Unauthorized döndürüyor
- Token validation middleware - Token'ı geçersiz buluyor

## 🔍 Test Sonuçları

### cURL ile Test:

```bash
curl -X POST http://localhost:5000/api/scraper/scrape \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"category":"mobilya","city":"gaziantep",...}'

# SONUÇ: {"message":"Geçersiz kullanıcı token'ı"}
```

### Token İçeriği (Decoded):

```json
{
  "sub": "gulernuran9@gmail.com",
  "jti": "ac381994-40b3-4fdc-a49a-f64dc390624b",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "2",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "Nuran güler",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "gulernuran9@gmail.com",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "User",
  "Credits": "5",
  "PackageType": "Free",
  "exp": 1770574762,
  "iss": "TradeScout.API",
  "aud": "TradeScout.Client"
}
```

**Token:**
- ✅ Format doğru (JWT)
- ✅ Expire olmamış (exp: 1770574762 = gelecekte)
- ✅ Issuer ve Audience doğru
- ✅ User claims mevcut

## 🔧 Olası Nedenler

### 1. JWT Secret Uyumsuzluğu
**En yaygın sebep!**

Login sırasında token farklı bir secret ile imzalanıyor, scraper endpoint'i farklı bir secret ile doğrulamaya çalışıyor.

**Kontrol:**
```csharp
// appsettings.json veya environment variable
"Jwt": {
  "Secret": "AYNI_SECRET_OLMALI",
  "Issuer": "TradeScout.API",
  "Audience": "TradeScout.Client"
}
```

**Düzeltme:**
- Login ve Scraper endpoint'leri aynı JWT configuration'ı kullanmalı
- Environment variable'lar doğru set edilmeli
- Backend yeniden başlatılmalı

### 2. Middleware Sırası Yanlış
**Program.cs veya Startup.cs'de:**

```csharp
// DOĞRU SIRA:
app.UseAuthentication(); // ÖNCE authentication
app.UseAuthorization();  // SONRA authorization
app.MapControllers();
```

**YANLIŞ:**
```csharp
app.UseAuthorization();  // ❌ Önce authorization olmamalı
app.UseAuthentication(); // ❌ Sonra authentication olmamalı
```

### 3. [Authorize] Attribute Yanlış

**ScraperController.cs kontrolü:**

```csharp
[Authorize] // ✅ DOĞRU
[HttpPost("scrape")]
public async Task<IActionResult> Scrape([FromBody] ScrapeRequest request)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    // ...
}
```

**Yanlış kullanım:**
```csharp
[Authorize(AuthenticationSchemes = "FarkliScheme")] // ❌ Farklı scheme
[Authorize(Policy = "VarOlmayanPolicy")] // ❌ Var olmayan policy
```

### 4. Claims Okuma Sorunu

Token'daki claim'ler uzun namespace'lerle tanımlanmış:
```
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
```

Backend bunu okuyamazsa hata verir.

**Düzeltme:**
```csharp
// Claim okuma
var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
// veya
var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
```

### 5. CORS Problemi (Olası Değil Ama Kontrol Edilmeli)

**Program.cs'de:**
```csharp
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
```

## 🎯 Hızlı Çözüm Adımları

### Adım 1: JWT Secret Kontrolü
```bash
# Backend klasöründe
grep -r "Secret" appsettings*.json

# Çıktı şuna benzer olmalı:
# "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong"
```

### Adım 2: Backend Yeniden Başlatma
```bash
# Backend'i durdur (Ctrl+C)
# Yeniden başlat
dotnet run
```

### Adım 3: Middleware Sırasını Kontrol Et
```csharp
// Program.cs
app.UseAuthentication(); // ÖNCE bu
app.UseAuthorization();  // SONRA bu
```

### Adım 4: Test Et
```bash
# Login yap ve yeni token al
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Response'dan token'ı kopyala
# Scraper endpoint'ini test et
curl -X POST http://localhost:5000/api/scraper/scrape \
  -H "Authorization: Bearer <YENİ_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"category":"test","city":"test","country":"Turkey","language":"en","maxResults":3}'
```

## 📝 Backend Developer İçin Checklist

- [ ] JWT Secret aynı mı? (Login ve Scraper için)
- [ ] Middleware sırası doğru mu? (Authentication → Authorization)
- [ ] [Authorize] attribute doğru mu?
- [ ] Claims doğru okunuyor mu?
- [ ] CORS yapılandırması doğru mu?
- [ ] Backend yeniden başlatıldı mı?
- [ ] Environment variable'lar doğru mu?
- [ ] appsettings.json doğru mu?

## 🐛 Debug Logları

Backend'e şu logları ekleyin:

```csharp
[Authorize]
[HttpPost("scrape")]
public async Task<IActionResult> Scrape([FromBody] ScrapeRequest request)
{
    Console.WriteLine("===== SCRAPER ENDPOINT =====");
    Console.WriteLine($"User authenticated: {User.Identity?.IsAuthenticated}");
    Console.WriteLine($"User name: {User.Identity?.Name}");
    Console.WriteLine($"Claims count: {User.Claims.Count()}");
    
    foreach (var claim in User.Claims)
    {
        Console.WriteLine($"  - {claim.Type}: {claim.Value}");
    }
    
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    Console.WriteLine($"User ID: {userId}");
    
    // ... rest of code
}
```

## ✅ Beklenen Sonuç

Düzeltme sonrası:
```bash
curl -X POST http://localhost:5000/api/scraper/scrape \
  -H "Authorization: Bearer <token>" \
  ...

# BEKLENEN RESPONSE:
{
  "success": true,
  "message": "Scraping tamamlandı",
  "jobId": 123,
  "businessesFound": 5,
  "businesses": [...]
}
```

---

**Rapor Tarihi:** 2026-02-07 18:45  
**Frontend Durumu:** ✅ Hazır ve çalışıyor  
**Backend Durumu:** ⚠️ JWT Token validation sorunu  
**Öncelik:** 🔴 Yüksek (Kritik bug)
