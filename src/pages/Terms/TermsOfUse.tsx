import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

const TermsOfUse: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: '#1565C0' }}
        >
          {t('back')}
        </Button>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#1565C0', mb: 3 }}
          >
            Kullanım Şartları
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Hizmet Tanımı
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            FGS Trade, kullanıcılarına ticari istihbarat hizmetleri sunan bir dijital platformdur. 
            Platform üzerinden ithalat/ihracat verileri, firma bilgileri ve pazar analizlerine 
            erişim sağlanmaktadır.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. Üyelik Koşulları
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            • Platformu kullanabilmek için 18 yaşından büyük olmak gerekmektedir.
            <br />
            • Üyelik sırasında verilen bilgilerin doğru ve güncel olması zorunludur.
            <br />
            • Her kullanıcı yalnızca bir hesap açabilir.
            <br />
            • Hesap bilgileri kişiseldir ve üçüncü kişilerle paylaşılamaz.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Hizmetin Kullanımı
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            • Platform üzerinden elde edilen veriler yalnızca ticari amaçlarla kullanılabilir.
            <br />
            • Verilerin üçüncü taraflarla paylaşılması, satılması veya yayınlanması yasaktır.
            <br />
            • Otomatik veri çekme (scraping) araçları kullanmak yasaktır.
            <br />
            • Platform kaynaklarını aşırı yükleyecek şekilde kullanmak yasaktır.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Fikri Mülkiyet Hakları
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Platform üzerindeki tüm içerik, tasarım, logo, yazılım ve veritabanları FGS Trade'in 
            fikri mülkiyetidir. Bu içeriklerin izinsiz kopyalanması, dağıtılması veya değiştirilmesi 
            yasaktır ve yasal işlem başlatılabilir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. Ödeme ve Abonelik
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            • Abonelik ücretleri, seçilen paket türüne göre aylık olarak faturalandırılır.
            <br />
            • Ödemeler iyzico güvenli ödeme altyapısı üzerinden gerçekleştirilir.
            <br />
            • Abonelik iptali, bir sonraki fatura dönemi için geçerli olur.
            <br />
            • Kullanılmış kredilerin iadesi yapılmaz.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Sorumluluk Sınırları
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            • FGS Trade, verilerin doğruluğu konusunda garanti vermez.
            <br />
            • Platform üzerinden alınan kararların sonuçlarından FGS Trade sorumlu tutulamaz.
            <br />
            • Teknik aksaklıklar nedeniyle oluşabilecek zararlardan sorumluluk kabul edilmez.
            <br />
            • Mücbir sebep durumlarında hizmet kesintileri yaşanabilir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. Hesap Askıya Alma ve Fesih
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            FGS Trade, bu kullanım şartlarını ihlal eden hesapları önceden bildirimde bulunmaksızın 
            askıya alabilir veya kalıcı olarak kapatabilir. Bu durumda kullanılmamış krediler 
            iade edilmez.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. Değişiklikler
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            FGS Trade, bu kullanım şartlarını dilediği zaman değiştirme hakkını saklı tutar. 
            Değişiklikler, platformda yayınlandığı anda yürürlüğe girer. Kullanıcıların düzenli 
            olarak bu sayfayı kontrol etmesi önerilir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            9. Uygulanacak Hukuk
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
            Bu kullanım şartları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda 
            İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
            Son güncelleme: Mart 2026
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfUse;
