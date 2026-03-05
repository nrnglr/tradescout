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

const SalesAgreement: React.FC = () => {
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
            Mesafeli Satış Sözleşmesi
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 1 - TARAFLAR
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            <strong>SATICI:</strong>
            <br />
            Ünvan: FGS Trade
            <br />
            Adres: İstanbul, Türkiye
            <br />
            E-posta: info@fgstrade.com
            <br />
            Telefon: 0554 199 13 27
            <br /><br />
            <strong>ALICI:</strong>
            <br />
            Üyelik sırasında beyan edilen ad, soyad, adres ve iletişim bilgileridir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 2 - SÖZLEŞMENİN KONUSU
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya (FGS Trade) ait fgstrade.com 
            web sitesinden elektronik ortamda siparişini yaptığı abonelik veya kredi 
            paketinin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin 
            Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri 
            gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 3 - HİZMETİN TANIMI
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            ALICI, dijital hizmetin içeriğini, temel niteliklerini ve fiyatını bildiğini 
            kabul eder. FGS Trade platformunda sunulan hizmetler:
            <br /><br />
            • <strong>Başlangıç Paketi:</strong> Aylık 10 arama hakkı
            <br />
            • <strong>Profesyonel Paket:</strong> Aylık 40 arama hakkı + Öncelikli destek
            <br />
            • <strong>Kurumsal Paket:</strong> Aylık 100 arama hakkı + API erişimi + Özel hesap yöneticisi
            <br /><br />
            Tüm paketler PDF rapor indirme, detaylı firma bilgileri ve ihracat/ithalat 
            verileri özelliklerini içermektedir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 4 - FİYAT VE ÖDEME
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Hizmet bedeli, sipariş anında web sitesinde belirtilen fiyattır. Tüm fiyatlara 
            KDV dahildir. Ödeme, iyzico güvenli ödeme altyapısı üzerinden kredi kartı veya 
            banka kartı ile gerçekleştirilir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 5 - TESLİMAT
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Dijital hizmet, ödemenin onaylanmasının ardından anında ALICI'nın hesabına 
            tanımlanır. Abonelik veya kredi hakkı, kullanıcı panelinden hemen 
            kullanılabilir hale gelir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 6 - CAYMA HAKKI
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            ALICI, satın aldığı hizmeti hiç kullanmamış olmak kaydıyla, satın alma 
            tarihinden itibaren 14 gün içinde cayma hakkını kullanabilir. Ancak, 
            dijital içeriğin kullanılmaya başlanması (arama yapılması, rapor 
            indirilmesi vb.) halinde cayma hakkı ortadan kalkar.
            <br /><br />
            6502 sayılı Kanun'un 53. maddesi ve Mesafeli Sözleşmeler Yönetmeliği'nin 
            15. maddesi gereğince, tüketicinin onayı ile anında ifa edilen ve maddi 
            ortamda sunulmayan dijital içeriklerin teslimine başlandıktan sonra 
            cayma hakkı kullanılamaz.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 7 - GENEL HÜKÜMLER
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            • ALICI, bu sözleşmeyi elektronik ortamda onaylayarak tüm şartları 
            kabul ettiğini beyan eder.
            <br />
            • İşbu sözleşme, ALICI tarafından onaylandığı tarihte yürürlüğe girer.
            <br />
            • Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            <br />
            • Bu sözleşmeden doğan ihtilaflarda Tüketici Hakem Heyetleri ve 
            Tüketici Mahkemeleri yetkilidir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            MADDE 8 - YÜRÜRLÜK
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
            İşbu sözleşme, ALICI tarafından elektronik ortamda onaylanması ile 
            birlikte yürürlüğe girer. Sözleşmenin bir nüshası ALICI'nın kayıtlı 
            e-posta adresine gönderilir.
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

export default SalesAgreement;
