# İndirim Kodu Sistemi - Uygulama Dokümantasyonu

## 🎯 Özet
FGS Trade platformunda kullanıcıların ödeme sırasında indirim kodu kullanabilmesi için backend ile tam uyumlu bir sistem oluşturuldu.

---

## ✅ Backend API Testleri (Başarılı)

### 1. Geçerli İndirim Kodu Testi
```bash
curl -X POST http://localhost:3001/api/discountcode/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "code": "WELCOME20",
    "packageCode": "starter_monthly",
    "originalPrice": 15
  }'
```

**Backend Response:**
```json
{
  "isValid": true,
  "code": "WELCOME20",
  "discountPercentage": 20,
  "originalPrice": 15,
  "finalPrice": 12,
  "message": "İndirim kodu başarıyla uygulandı"
}
```

### 2. Geçersiz/Kullanılmış İndirim Kodu Testi
```bash
curl -X POST http://localhost:3001/api/discountcode/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "code": "INVALID",
    "packageCode": "starter_monthly",
    "originalPrice": 15
  }'
```

**Backend Response:**
```json
{
  "isValid": false,
  "message": "Bu indirim kodu bulunamadı"
}
```

---

## 🎨 Frontend Implementasyonu

### 1. Paket Kodu Eşleştirme (CartDrawer.tsx)

Backend'in beklediği paket kodları:
- **Abonelik paketleri:** `starter_monthly`, `pro_monthly`, `business_monthly`, `starter_yearly`, `pro_yearly`, `business_yearly`
- **Kredi paketleri:** `credit_10`, `credit_25`, `credit_50`, `credit_100`

```typescript
const validateDiscountCode = async () => {
  // ... validation checks ...
  
  // İlk ürünün paket bilgisini al
  const plan = getPlanInfo(items[0]);
  
  // Backend'in tam olarak beklediği paket kodunu gönder
  const rawId = items[0].id.toLowerCase();
  let packageCode = rawId;
  
  // Eğer kredi paketi değilse, billing period'a göre paket kodu oluştur
  if (!rawId.startsWith('credit')) {
    const baseId = normalizeId(rawId);
    packageCode = billingPeriod === 'yearly' ? `${baseId}_yearly` : `${baseId}_monthly`;
  }
  
  const response = await apiClient.post('/api/discountcode/validate', {
    code: discountCode.trim().toUpperCase(),
    packageCode: packageCode,
    originalPrice: totalPrice
  });
  
  if (response.data.isValid) {
    setDiscountData(response.data);
    setDiscountError('');
  } else {
    setDiscountError(response.data.message);
    setDiscountData(null);
  }
};
```

### 2. UI Özellikleri

#### İndirim Kodu Girişi
- İndirim kodu otomatik olarak büyük harfe çevrilir
- Enter tuşu ile doğrulama yapılabilir
- Loading durumunda buton devre dışı kalır
- Başarısız girişlerde hata mesajı gösterilir

#### Başarılı İndirim Kodu
- Yeşil başarı mesajı (Alert komponenti)
- İndirim kodu adı ve yüzdesi gösterilir
- Kodu kaldırma butonu (X icon)
- Fiyat detayları güncellenir:
  - Ara Toplam (üstü çizili)
  - İndirim tutarı (yeşil renk)
  - Final Toplam (kalın yazı)

#### Sepet Değişikliklerinde Otomatik Sıfırlama
```typescript
useEffect(() => {
  if (discountData) {
    removeDiscountCode();
  }
}, [items.length, billingPeriod]);
```

İndirim kodu şu durumlarda otomatik sıfırlanır:
- Ürün eklendiğinde/silindiğinde
- Aylık/Yıllık billing period değiştiğinde

### 3. Ödeme İşleminde İndirim Kodu

```typescript
const handleCheckout = async () => {
  // ... validation checks ...
  
  const paymentData: any = {
    productCode: plan.code,
    installment: 1,
    amount: finalPrice, // İndirimli fiyat
    currency: 'USD',
  };
  
  // İndirim kodu varsa backend'e gönder
  if (discountData?.code) {
    paymentData.discountCode = discountData.code;
  }
  
  const response = await apiClient.post('/api/payment/initialize', paymentData);
  // ...
};
```

---

## 🔐 Güvenlik ve Token Yönetimi

### API Client Konfigürasyonu (services/api.ts)

```typescript
// Request interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      '/api/auth/login', 
      '/api/auth/register',
      // ... diğer public endpoints
    ];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  }
);
```

**Önemli:** İndirim kodu doğrulama endpoint'i (`/api/discountcode/validate`) authentication gerektiriyor, bu nedenle token otomatik olarak ekleniyor.

---

## 🧪 Test Senaryoları

### 1. Geçerli İndirim Kodu
- ✅ Sepete ürün ekle
- ✅ Geçerli bir indirim kodu gir (örn: WELCOME20)
- ✅ "İndirim Kodunu Uygula" butonuna tıkla
- ✅ Başarı mesajı gösterilir
- ✅ Fiyat detayları güncellenir (ara toplam, indirim, final)
- ✅ Ödeme yap butonuna tıkla
- ✅ Backend'e doğru bilgiler gönderilir

### 2. Geçersiz İndirim Kodu
- ✅ Sepete ürün ekle
- ✅ Geçersiz bir kod gir
- ✅ Hata mesajı gösterilir
- ✅ Fiyat değişmez

### 3. Sepet Değişiklikleri
- ✅ İndirim kodu uygula
- ✅ Aylık/Yıllık toggle'ı değiştir → İndirim sıfırlanır
- ✅ Ürün ekle/sil → İndirim sıfırlanır

### 4. Farklı Paket Türleri
- ✅ Starter Monthly paketi + indirim kodu
- ✅ Pro Yearly paketi + indirim kodu
- ✅ Kredi paketi (credit_10) + indirim kodu
- ✅ Business paketi + indirim kodu

---

## 📝 Çeviri Anahtarları (translations.ts)

İndirim kodu için kullanılan çeviri anahtarları translations.ts'de mevcut:

```typescript
// TR
discountCode: 'İndirim Kodu',
applyDiscount: 'İndirim Kodunu Uygula',
discountApplied: 'İndirim Uygulandı',
// ... vs.

// EN
discountCode: 'Discount Code',
applyDiscount: 'Apply Discount Code',
discountApplied: 'Discount Applied',
// ... vs.
```

---

## 🚀 Deployment Notları

### Environment Variables
```bash
# .env (Development)
REACT_APP_API_URL=

# .env.production
REACT_APP_API_URL=https://api.fgstrade.com
```

### Build & Deploy
```bash
npm run build
# Build klasörünü production sunucuya deploy et
```

---

## 🎉 Sonuç

- ✅ Backend API mükemmel çalışıyor (curl testleri başarılı)
- ✅ Frontend backend ile tam uyumlu
- ✅ İndirim kodu doğrulama, uygulama ve görselleştirme çalışıyor
- ✅ Ödeme işleminde indirim kodu backend'e gönderiliyor
- ✅ Sepet değişikliklerinde indirim otomatik sıfırlanıyor
- ✅ UI/UX detayları optimize edildi
- ✅ Türkçe ve İngilizce dil desteği
- ✅ Token authentication tam uyumlu

**Sistem production'a hazır! 🚀**

---

## 📞 Troubleshooting

### Sorun: İndirim kodu doğrulanmıyor
**Çözüm:** 
1. Token'ın geçerli olduğundan emin olun
2. Backend'in çalıştığından emin olun
3. Browser console'da API response'u kontrol edin

### Sorun: Fiyat güncellenmiyor
**Çözüm:** 
1. `discountData` state'inin doğru set edildiğini kontrol edin
2. `finalPrice` hesaplamasını kontrol edin

### Sorun: Sepet değişince indirim sıfırlanmıyor
**Çözüm:** 
useEffect dependency array'ine `items.length` ve `billingPeriod` eklendiğinden emin olun

---

**Son Güncelleme:** 2025-01-22
**Versiyon:** 1.0.0
