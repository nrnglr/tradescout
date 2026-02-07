# 🔧 Hızlı Sorun Giderme Rehberi

## ⚠️ Sorun: "Firma Ara" Butonuna Basınca Login Sayfasına Atıyor

### 📋 Olası Sebepler ve Çözümler:

---

## ✅ ÇÖZÜM 1: Backend Çalışmıyor

### Kontrol Et:
Terminal'de şu komutu çalıştır:
```bash
curl http://localhost:5000
```

### Eğer Hata Alırsan:
Backend çalışmıyor demektir. Backend'i başlat:

```bash
# Backend klasörüne git (proje dışında olabilir)
cd ../backend  # veya backend'in olduğu klasör

# Bağımlılıkları yükle (ilk kez çalıştırıyorsan)
npm install

# Backend'i başlat
npm run dev
```

**Beklenen Çıktı:**
```
Server running on port 5000
Database connected successfully
```

---

## ✅ ÇÖZÜM 2: Token Kaydedilmiyor

### Browser'da Test Et:

1. **Chrome/Firefox'ta `F12` tuşuna bas**
2. **Console sekmesini aç**
3. **Login sayfasına git:** http://localhost:3000/login
4. **Login ol**
5. **Console'da şunu yaz:**

```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### Eğer `null` görüyorsan:
Login başarısız olmuş. Network sekmesinde `/api/auth/login` isteğine bak.

### Çözüm:
```javascript
// Console'da cache temizle
localStorage.clear();

// Sayfayı yenile
location.reload();

// Tekrar login ol
```

---

## ✅ ÇÖZÜM 3: CORS Hatası

### Belirti:
Console'da şöyle bir hata:
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

### Çözüm:
Backend'de CORS ayarlarını kontrol et. `server.js` veya `app.js` dosyasında:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## ✅ ÇÖZÜM 4: Port Çakışması

### Belirti:
Backend `localhost:5000` yerine başka bir portta çalışıyor olabilir.

### Kontrol Et:
Backend terminal çıktısına bak:
```
Server running on port 5001  ← 5000 değil!
```

### Çözüm:
`.env` dosyasını güncelle:

```bash
# .env dosyası
REACT_APP_API_URL=http://localhost:5001  ← Port numarasını değiştir
```

**Sonra frontend'i yeniden başlat:**
```bash
# Frontend terminal'inde
# Ctrl+C ile durdur
npm start  # Tekrar başlat
```

---

## ✅ ÇÖZÜM 5: .env Dosyası Okunmuyor

### Kontrol Et:
Console'da şunu çalıştır:

```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

### Eğer `undefined` görüyorsan:
`.env` dosyası okunmuyor.

### Çözüm:
1. **.env dosyasının yeri doğru mu?**
   - Dosya `package.json` ile aynı klasörde olmalı
   - Dosya adı tam olarak `.env` olmalı (`.env.txt` değil!)

2. **Frontend'i yeniden başlat:**
   ```bash
   # Terminal'de
   # Ctrl+C ile durdur
   npm start  # Tekrar başlat
   ```

---

## ✅ ÇÖZÜM 6: Manuel Test

### Browser Console'da Manuel Test:

```javascript
// 1. API bağlantısını test et
fetch('http://localhost:5000')
  .then(res => res.json())
  .then(data => console.log('✅ Backend çalışıyor:', data))
  .catch(err => console.error('❌ Backend çalışmıyor:', err));

// 2. Login test et
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Login başarılı:', data);
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data));
})
.catch(err => console.error('❌ Login başarısız:', err));

// 3. Token'la API testi
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/scraper/credits', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log('✅ Token geçerli, krediler:', data))
.catch(err => console.error('❌ Token geçersiz:', err));
```

---

## 🎯 Hızlı Checklist

Sırayla kontrol et:

- [ ] **Backend çalışıyor mu?** → `curl http://localhost:5000`
- [ ] **Frontend çalışıyor mu?** → `curl http://localhost:3000`
- [ ] **.env dosyası var mı?** → `cat .env` (Terminal'de)
- [ ] **Login başarılı mı?** → Console'da token var mı?
- [ ] **Token header'da mı?** → Network sekmesinde Authorization header var mı?

---

## 🚀 Tam Yeniden Başlatma

Eğer hiçbir şey işe yaramazsa, her şeyi sıfırdan başlat:

### 1. Backend'i Durdur ve Başlat:
```bash
cd backend  # Backend klasörüne git
# Ctrl+C ile durdur (eğer çalışıyorsa)
npm install  # Bağımlılıkları yükle
npm run dev  # Başlat
```

### 2. Frontend'i Durdur ve Başlat:
```bash
cd tradescout  # Frontend klasörüne git
# Ctrl+C ile durdur (eğer çalışıyorsa)
rm -rf node_modules package-lock.json  # Temizle (opsiyonel)
npm install  # Bağımlılıkları yükle
npm start  # Başlat
```

### 3. Browser Cache Temizle:
```bash
# Chrome/Firefox Console'da:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 4. Yeni Kayıt Ol:
- http://localhost:3000/register
- Yeni bir hesap oluştur
- Dashboard'a git
- "Firma Ara" butonuna bas

---

## 📊 Debug Çıktıları

Dashboard'a gittiğinde Console'da **şunları göreceksin:**

### ✅ Başarılı Durum:
```
🔍 Dashboard Debug:
Token var mı? true
User var mı? true
Token: eyJhbGciOiJIUzI1NiIs...
User: {"fullName":"Test User","email":"test@example.com","credits":10}
```

### ❌ Başarısız Durum:
```
🔍 Dashboard Debug:
Token var mı? false
User var mı? false
Token: YOK
User: null
⚠️ Token veya user bulunamadı, login sayfasına yönlendiriliyor...
```

---

## 🆘 Hala Çalışmıyorsa

1. **Backend terminal çıktısını oku** - Orada hata var mı?
2. **Browser Console'u oku** - Kırmızı hatalar var mı?
3. **Network sekmesini kontrol et** - Hangi istek başarısız?
4. **Backend'in port numarasını kontrol et** - Gerçekten 5000 mi?
5. **Screenshot al ve hata mesajlarını oku** - Tam hata mesajı ne?

---

## 💡 Önemli Notlar

- **Backend ÖNCE başlamalı!** (Port 5000)
- **Frontend SONRA başlamalı!** (Port 3000)
- **.env değişikliği yapıldığında frontend yeniden başlatılmalı!**
- **Login olduktan sonra token `localStorage`'a kaydedilir**
- **401 hatası alırsan token geçersiz demektir**

---

## ✅ Son Kontrol

Terminal'de sırayla çalıştır:

```bash
# 1. Backend çalışıyor mu?
curl http://localhost:5000

# 2. Frontend çalışıyor mu?
curl http://localhost:3000

# 3. .env dosyası var mı?
cat .env

# 4. Port 5000 kullanılıyor mu?
lsof -i :5000

# 5. Port 3000 kullanılıyor mu?
lsof -i :3000
```

Tüm komutlar başarılı çalışıyorsa her şey hazır! 🎉

**Başarılar! 🚀**
