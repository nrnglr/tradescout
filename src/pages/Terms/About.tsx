import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import { ArrowBack, Public, TrendingUp, Security, Support } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

const About: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Public sx={{ fontSize: 40, color: '#1565C0' }} />,
      title: 'Küresel Veri Erişimi',
      description: 'Dünya genelindeki ithalat ve ihracat verilerine anında erişim sağlayın.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#1565C0' }} />,
      title: 'Pazar Analizi',
      description: 'Detaylı pazar analiz raporları ile stratejik kararlar alın.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#1565C0' }} />,
      title: 'Güvenli Altyapı',
      description: 'Verileriniz en yüksek güvenlik standartlarıyla korunur.',
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#1565C0' }} />,
      title: '7/24 Destek',
      description: 'Uzman ekibimiz sorularınız için her zaman yanınızda.',
    },
  ];

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
            Hakkımızda
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            FGS Trade Nedir?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: '#555' }}>
            FGS Trade, işletmelerin küresel ticaret verilerine erişerek potansiyel müşterilerini 
            ve tedarikçilerini bulmasını sağlayan yenilikçi bir ticari istihbarat platformudur. 
            Gümrük verileri, ihracat/ithalat kayıtları ve şirket bilgilerini tek bir platformda 
            birleştirerek, dış ticaret yapan firmalara değerli içgörüler sunar.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Misyonumuz
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: '#555' }}>
            Her ölçekten işletmenin küresel pazarlara erişimini kolaylaştırmak, doğru ticari 
            bağlantılar kurmasını sağlamak ve veri odaklı kararlar almasına yardımcı olmaktır. 
            Karmaşık ticaret verilerini anlaşılır ve uygulanabilir bilgilere dönüştürüyoruz.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Vizyonumuz
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: '#555' }}>
            Türkiye'nin ve bölgenin lider ticari istihbarat platformu olmak, işletmelerin 
            uluslararası ticarette başarılı olmalarına katkıda bulunmak.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Neden FGS Trade?
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            İletişim Bilgileri
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
            <strong>Şirket:</strong> FGS Trade
            <br />
            <strong>Adres:</strong> İstanbul, Türkiye
            <br />
            <strong>E-posta:</strong> info@fgstrade.com
            <br />
            <strong>Telefon:</strong> 0554 199 13 27
            <br />
            <strong>Web:</strong> www.fgstrade.com
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
            © 2026 FGS Trade. Tüm hakları saklıdır.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
