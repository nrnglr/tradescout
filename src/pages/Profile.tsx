import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box, Container, Paper, Typography, Avatar, 
  Button, IconButton, Chip, CircularProgress,
  Divider, List, ListItem, ListItemText, ListItemIcon,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import BoltIcon from '@mui/icons-material/Bolt';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import DownloadIcon from '@mui/icons-material/Download';

const BRAND_COLORS = {
  primary: '#1565C0',
  secondary: '#1976D2',
  success: '#2E7D32',
};

const ProfileHero = styled(Box)({
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 100%)',
  height: '180px',
  borderRadius: '0 0 40px 40px',
  position: 'relative',
  marginBottom: '70px',
});

const ProfileAvatar = styled(Avatar)({
  width: '120px',
  height: '120px',
  border: '4px solid #FFFFFF',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  position: 'absolute',
  bottom: '-60px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '3rem',
  backgroundColor: '#1565C0',
});

const StyledCard = styled(Paper)({
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  height: '100%',
  backgroundColor: '#FFFFFF',
});

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Grid2 hatasını tamamen aşmak için standart Grid'i 'any' olarak kullanıyoruz
  const MuiGrid = Grid as any;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F4F8', pb: 6 }}>
      {/* Hero Bölümü */}
      <ProfileHero>
        <Container maxWidth="lg">
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff', mt: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Container>
        <ProfileAvatar>{user.fullName?.charAt(0)}</ProfileAvatar>
      </ProfileHero>

      <Container maxWidth="lg">
        {/* İsim ve Mail */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="800">{user.fullName}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>
        </Box>

        <MuiGrid container spacing={3}>
          {/* SOL KOLON */}
          <MuiGrid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Hesap Özeti */}
              <StyledCard>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Hesap Özeti</Typography>
                <List dense>
                  <ListItem disableGutters>
                    <ListItemIcon><StarIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Üyelik Tipi" secondary="Standart Plan" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon><BoltIcon sx={{ color: '#FFC107' }} /></ListItemIcon>
                    <ListItemText primary="Kalan Kredi" secondary={`${user.credits || 0} Kredi`} />
                  </ListItem>
                </List>
                <Button variant="outlined" fullWidth startIcon={<EditIcon />} sx={{ mt: 1, textTransform: 'none' }}>
                  Profili Düzenle
                </Button>
              </StyledCard>

              {/* Güvenlik Ayarları */}
              <StyledCard>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Güvenlik</Typography>
                <Button fullWidth sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'none' }} startIcon={<SecurityIcon />}>
                  Şifre Değiştir
                </Button>
                <Button fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none' }} startIcon={<EmailIcon />}>
                  Bildirim Ayarları
                </Button>
              </StyledCard>
            </Box>
          </MuiGrid>

          {/* SAĞ KOLON */}
          <MuiGrid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Sayısal İstatistikler */}
              <MuiGrid container spacing={2}>
                {[
                  { label: 'Toplam Arama', value: '12', color: '#1565C0' },
                  { label: 'İndirilen Rapor', value: '5', color: '#2E7D32' },
                  { label: 'Favori Firmalar', value: '24', color: '#E91E63' },
                ].map((stat) => (
                  <MuiGrid item xs={4} key={stat.label}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '12px', bgcolor: stat.color, color: 'white' }}>
                      <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>{stat.label}</Typography>
                    </Paper>
                  </MuiGrid>
                ))}
              </MuiGrid>

              {/* Son Aramalar Listesi */}
              <StyledCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Son Aramalarınız</Typography>
                  <Button size="small" onClick={() => navigate('/dashboard')} sx={{ textTransform: 'none' }}>Tümünü Gör</Button>
                </Box>
                <Divider />
                <List>
                  {[
                    { item: 'Güneş Paneli', loc: 'Almanya', date: '12 Mart' },
                    { item: 'Tekstil Makinesi', loc: 'İtalya', date: '10 Mart' },
                    { item: 'Yedek Parça', loc: 'Türkiye', date: '05 Mart' },
                  ].map((job, i) => (
                    <ListItem key={i} divider={i !== 2} secondaryAction={
                      <IconButton edge="end"><DownloadIcon /></IconButton>
                    }>
                      <ListItemIcon><HistoryIcon /></ListItemIcon>
                      <ListItemText 
                        primary={job.item} 
                        secondary={`${job.loc} • ${job.date}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </StyledCard>

              {/* Premium Duyurusu */}
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px', 
                background: 'linear-gradient(90deg, #1565C0 0%, #42A5F5 100%)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <Typography variant="h6" fontWeight="bold">Premium'a Geçin!</Typography>
                  <Typography variant="body2">Sınırsız arama ve detaylı pazar analizi raporları için yükseltin.</Typography>
                </Box>
                <Button variant="contained" sx={{ bgcolor: 'white', color: '#1565C0', fontWeight: 'bold', '&:hover': { bgcolor: '#f0f0f0' }, textTransform: 'none' }}>
                  Hemen Yükselt
                </Button>
              </Paper>

            </Box>
          </MuiGrid>
        </MuiGrid>
      </Container>
    </Box>
  );
};

export default Profile;