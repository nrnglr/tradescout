import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box, Container, Paper, Typography, Avatar,
  Button, IconButton, Chip, CircularProgress,
  Divider, List, ListItem, ListItemText, ListItemIcon,
  Grid, LinearProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField // YENİ EKLENENLER
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BoltIcon from '@mui/icons-material/Bolt';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DiamondIcon from '@mui/icons-material/Diamond';
import CancelIcon from '@mui/icons-material/Cancel'; // İptal ikonu
import { authService } from '../services/auth';
import { scraperService, UserJob } from '../services/scraper';
import { apiClient } from '../services/api';

const BRAND = {
  primary: '#1565C0', secondary: '#1976D2', light: '#42A5F5',
  success: '#2E7D32', gold: '#F59E0B', bg: '#F0F4F8',
};

const PACKAGE_CONFIG: Record<string, { color: string; label: string; icon: string; maxCompanies: number; creditsPerMonth: number }> = {
  'Free':             { color: '#78909C', label: 'Ücretsiz',          icon: '🆓', maxCompanies: 100, creditsPerMonth: 2   },
  'Starter':          { color: '#1565C0', label: 'Başlangıç',         icon: '🚀', maxCompanies: 200, creditsPerMonth: 10  },
  'Starter Yıllık':   { color: '#1565C0', label: 'Başlangıç Yıllık',  icon: '🚀', maxCompanies: 200, creditsPerMonth: 10  },
  'Pro':              { color: '#7B1FA2', label: 'Profesyonel',       icon: '⚡', maxCompanies: 200, creditsPerMonth: 40  },
  'Pro Yıllık':       { color: '#7B1FA2', label: 'Profesyonel Yıllık',icon: '⚡', maxCompanies: 200, creditsPerMonth: 40  },
  'Business':         { color: '#1B5E20', label: 'İş',                icon: '💼', maxCompanies: 200, creditsPerMonth: 100 },
  'Business Yıllık':  { color: '#1B5E20', label: 'İş Yıllık',         icon: '💼', maxCompanies: 200, creditsPerMonth: 100 },
};

const getPkg = (type: string) =>
  PACKAGE_CONFIG[type] ?? { color: '#78909C', label: type || 'Ücretsiz', icon: '🆓', maxCompanies: 100, creditsPerMonth: 2 };

const HeroBg = styled(Box)({
  background: `linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)`,
  height: 200, borderRadius: '0 0 40px 40px',
  position: 'relative', marginBottom: 70,
});

const UserAvatar = styled(Avatar)({
  width: 120, height: 120, border: '4px solid #fff',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  position: 'absolute', bottom: -60, left: '50%',
  transform: 'translateX(-50%)', fontSize: '3rem',
  backgroundColor: '#1565C0',
});

const Card = styled(Paper)({
  padding: 24, borderRadius: 16,
  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  backgroundColor: '#fff', height: '100%',
});

const formatDate = (d?: string | null) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const daysLeft = (d?: string | null) => {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  return diff > 0 ? diff : 0;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const MuiGrid  = Grid as any;

  const [user,          setUser]          = useState<any>(null);
  const [jobs,          setJobs]          = useState<UserJob[]>([]);
  const [payments,      setPayments]      = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // ABONELİK İPTALİ İÇİN YENİ STATE'LER
  const [subscription, setSubscription] = useState<any>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Güncel kullanıcı bilgisi
        const fresh = await authService.refreshUserData();
        if (fresh) {
          setUser(fresh);
        } else {
          const stored = localStorage.getItem('user');
          if (stored) setUser(JSON.parse(stored));
        }
        
        // Aktif Abonelik Sorgusu (YENİ EKLENDİ)
        try {
          const subRes = await apiClient.get('/api/payment/paratika/subscription');
          if (subRes.data && subRes.data.hasActiveSubscription) {
            setSubscription(subRes.data);
          }
        } catch (e) { console.error('Abonelik sorgulama hatası:', e); }

        // Firma aramaları
        try { setJobs(await scraperService.getMyJobs(1, 50)); } catch {}
        
        // Ödeme geçmişi
        try {
          const res = await apiClient.get('/api/payment/history');
          setPayments(res.data ?? []);
        } catch {}

      } catch {
        setError('Profil bilgileri yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = async (job: UserJob) => {
    setDownloadingId(job.jobId);
    try { await scraperService.downloadExcelFromJob(job); }
    catch { alert('İndirme başarısız.'); }
    finally { setDownloadingId(null); }
  };

  // ABONELİK İPTAL FONKSİYONU
  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      await apiClient.delete('/api/payment/paratika/subscription', {
        data: { Reason: cancelReason || 'Kullanıcı paneli üzerinden iptal' }
      });
      alert('Aboneliğiniz başarıyla iptal edildi. Mevcut dönem sonuna kadar kullanmaya devam edebilirsiniz.');
      setCancelOpen(false);
      setSubscription(null); // İptal edildiği için butonu gizle
    } catch (err: any) {
      alert(err.response?.data?.error || 'İptal işlemi başarısız oldu. Lütfen destek ekibiyle iletişime geçin.');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: BRAND.bg }}>
      <CircularProgress size={48} sx={{ color: BRAND.primary }} />
    </Box>
  );

  if (!user) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error">Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.</Alert>
      <Button sx={{ mt: 2 }} onClick={() => navigate('/login')}>Giriş Yap</Button>
    </Box>
  );

  const pkgType       = user.packageType || user.PackageType || 'Free';
  const pkg           = getPkg(pkgType);
  const credits       = user.credits ?? 0;
  const creditPct     = Math.min(100, (credits / Math.max(pkg.creditsPerMonth, 1)) * 100);
  const memberEnd     = user.membershipEnd || user.MembershipEnd;
  const remaining     = daysLeft(memberEnd);
  const completedJobs = jobs.filter(j => j.status?.toLowerCase() === 'completed');
  const totalResults  = jobs.reduce((s, j) => s + (j.totalResults || 0), 0);
  const hasPaid       = pkgType !== 'Free' && pkgType !== '';

  const analysisHistory: any[] = (() => {
    try {
      const raw = localStorage.getItem('recentSearches');
      if (!raw) return [];
      return JSON.parse(raw).filter((s: any) => s.type === 'analiz');
    } catch { return []; }
  })();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: BRAND.bg, pb: 6 }}>

      {/* Hero */}
      <HeroBg>
        <Container maxWidth="lg">
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff', mt: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Container>
        <UserAvatar>{user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}</UserAvatar>
      </HeroBg>

      <Container maxWidth="lg">
        {/* İsim + Paket Chip */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="800">{user.fullName}</Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>{user.email}</Typography>
          <Chip
            label={`${pkg.icon}  ${pkg.label}`}
            sx={{ bgcolor: pkg.color, color: '#fff', fontWeight: 700, px: 1, fontSize: '0.85rem' }}
          />
        </Box>

        {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

        <MuiGrid container spacing={3}>

          {/* ─── SOL ─── */}
          <MuiGrid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* Hesap Özeti */}
              <Card>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Hesap Özeti</Typography>
                <List dense disablePadding>

                  {/* Paket */}
                  <ListItem disableGutters>
                    <ListItemIcon><StarIcon sx={{ color: pkg.color }} /></ListItemIcon>
                    <ListItemText
                      primary="Üyelik Paketi"
                      secondary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box component="span" sx={{ color: pkg.color, fontWeight: 700 }}>{pkg.label}</Box>
                          {hasPaid && <CheckCircleIcon sx={{ fontSize: 14, color: BRAND.success }} />}
                        </Box>
                      }
                    />
                  </ListItem>

                  {/* Üyelik Bitiş */}
                  {memberEnd && (
                    <ListItem disableGutters>
                      <ListItemIcon><CalendarTodayIcon color="action" /></ListItemIcon>
                      <ListItemText
                        primary="Üyelik Bitiş"
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                            <span>{formatDate(memberEnd)}</span>
                            {remaining !== null && (
                              <Chip
                                label={`${remaining} gün`}
                                size="small"
                                sx={{
                                  bgcolor: remaining < 7 ? '#FFEBEE' : '#E8F5E9',
                                  color: remaining < 7 ? '#C62828' : BRAND.success,
                                  fontWeight: 600, fontSize: '0.65rem', height: 18,
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  )}

                  {/* Kredi */}
                  <ListItem disableGutters>
                    <ListItemIcon><BoltIcon sx={{ color: BRAND.gold }} /></ListItemIcon>
                    <ListItemText
                      primary="Kalan Kredi"
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" fontWeight={700}>{credits} kredi</Typography>
                            <Typography variant="caption" color="text.secondary">/ {pkg.creditsPerMonth} limit</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate" value={creditPct}
                            sx={{ height: 6, borderRadius: 3, bgcolor: '#E3F2FD',
                              '& .MuiLinearProgress-bar': { bgcolor: BRAND.gold, borderRadius: 3 } }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>

                  {/* Firma Limiti */}
                  <ListItem disableGutters>
                    <ListItemIcon><BusinessIcon color="action" /></ListItemIcon>
                    <ListItemText primary="Arama Limiti" secondary={`Maks. ${pkg.maxCompanies} firma / arama`} />
                  </ListItem>

                </List>

                {/* Eğer aktif bir tekrar eden aboneliği (recurring) varsa "İptal Et" butonu göster */}
                {subscription ? (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    fullWidth 
                    startIcon={<CancelIcon />}
                    onClick={() => setCancelOpen(true)}
                    sx={{ mt: 3, textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}>
                    Aboneliği İptal Et
                  </Button>
                ) : !hasPaid && (
                  <Button variant="contained" fullWidth startIcon={<DiamondIcon />}
                    onClick={() => navigate('/#packages')}
                    sx={{ mt: 3, textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}>
                    Pakete Yükselt
                  </Button>
                )}
              </Card>

              {/* Güvenlik */}
              <Card>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Güvenlik</Typography>
                <Button fullWidth sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'none' }} startIcon={<SecurityIcon />}>
                  Şifre Değiştir
                </Button>
                <Button fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none' }} startIcon={<EmailIcon />}>
                  Bildirim Ayarları
                </Button>
              </Card>
            </Box>
          </MuiGrid>

          {/* ─── SAĞ ─── */}
          <MuiGrid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* İstatistik Kartları */}
              <MuiGrid container spacing={2}>
                {[
                  { label: 'Toplam Arama',  value: jobs.length,            color: BRAND.primary, icon: '🔍' },
                  { label: 'Tamamlanan',    value: completedJobs.length,   color: BRAND.success, icon: '✅' },
                  { label: 'Toplam Sonuç',  value: totalResults,           color: '#7B1FA2',     icon: '🏢' },
                  { label: 'Pazar Analizi', value: analysisHistory.length, color: '#E65100',     icon: '📊' },
                ].map(stat => (
                  <MuiGrid item xs={6} sm={3} key={stat.label}>
                    <Paper sx={{
                      p: 2, textAlign: 'center', borderRadius: '14px',
                      bgcolor: stat.color, color: '#fff',
                      boxShadow: `0 4px 14px ${stat.color}55`,
                    }}>
                      <Typography sx={{ fontSize: '1.4rem', mb: 0.5 }}>{stat.icon}</Typography>
                      <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>{stat.label}</Typography>
                    </Paper>
                  </MuiGrid>
                ))}
              </MuiGrid>

              {/* Firma Aramaları */}
              <Card>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">🏢 Firma Aramalarım</Typography>
                  <Button size="small" onClick={() => navigate('/dashboard')} sx={{ textTransform: 'none' }}>
                    Tümünü Gör
                  </Button>
                </Box>
                <Divider sx={{ mb: 1 }} />
                {jobs.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <HistoryIcon sx={{ fontSize: 48, color: '#BDBDBD', mb: 1 }} />
                    <Typography color="text.secondary">Henüz arama yapılmadı.</Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {jobs.slice(0, 5).map((job, i) => (
                      <ListItem key={job.jobId} divider={i < Math.min(jobs.length, 5) - 1} sx={{ px: 0 }}
                        secondaryAction={
                          job.status?.toLowerCase() === 'completed' ? (
                            <IconButton size="small" onClick={() => handleDownload(job)} disabled={downloadingId === job.jobId}>
                              {downloadingId === job.jobId ? <CircularProgress size={16} /> : <DownloadIcon fontSize="small" />}
                            </IconButton>
                          ) : null
                        }
                      >
                        <ListItemIcon><BusinessIcon sx={{ color: BRAND.primary }} /></ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography fontWeight={600} noWrap>{job.category}</Typography>
                              <Chip
                                label={job.status?.toLowerCase() === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                                size="small"
                                sx={{
                                  bgcolor: job.status?.toLowerCase() === 'completed' ? '#E8F5E9' : '#FFF8E1',
                                  color: job.status?.toLowerCase() === 'completed' ? BRAND.success : '#F57F17',
                                  fontWeight: 600, fontSize: '0.65rem', height: 18,
                                }}
                              />
                            </Box>
                          }
                          secondary={`${[job.city, job.country].filter(Boolean).join(', ')} • ${new Date(job.createdAt).toLocaleDateString('tr-TR')} • ${job.totalResults ?? 0} sonuç`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Card>

              {/* Pazar Analizi Geçmişi */}
              {analysisHistory.length > 0 && (
                <Card>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>📊 Pazar Analizlerim</Typography>
                  <Divider sx={{ mb: 1 }} />
                  <List disablePadding>
                    {analysisHistory.slice(0, 5).map((s: any, i: number) => (
                      <ListItem key={i} divider={i < Math.min(analysisHistory.length, 5) - 1} sx={{ px: 0 }}>
                        <ListItemIcon><TrendingUpIcon sx={{ color: '#E65100' }} /></ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography fontWeight={600}>{s.product}</Typography>
                              {s.hsCode && (
                                <Chip label={`HS: ${s.hsCode}`} size="small"
                                  sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 600, fontSize: '0.65rem', height: 18 }} />
                              )}
                            </Box>
                          }
                          secondary={`Hedef: ${s.country} • ${new Date(s.timestamp).toLocaleDateString('tr-TR')}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              )}

              {/* Ödeme Geçmişi */}
              {payments.length > 0 && (
                <Card>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>💳 Satın Alım Geçmişi</Typography>
                  <Divider sx={{ mb: 1 }} />
                  <List disablePadding>
                    {payments.slice(0, 5).map((p: any, i: number) => (
                      <ListItem key={i} divider={i < Math.min(payments.length, 5) - 1} sx={{ px: 0 }}>
                        <ListItemIcon><BoltIcon sx={{ color: BRAND.gold }} /></ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography fontWeight={600}>{p.packageName ?? 'Paket'}</Typography>
                              <Chip
                                label={p.status === 'SUCCESS' ? '✅ Başarılı' : '❌ Başarısız'}
                                size="small"
                                sx={{
                                  bgcolor: p.status === 'SUCCESS' ? '#E8F5E9' : '#FFEBEE',
                                  color: p.status === 'SUCCESS' ? BRAND.success : '#C62828',
                                  fontWeight: 600, fontSize: '0.65rem', height: 18,
                                }}
                              />
                            </Box>
                          }
                          secondary={[
                            p.amount ? `${p.amount} TL` : null, // Backend'i USD yaptıysan buradaki "TL" yazısını "$" veya "USD" olarak değiştirmeyi unutma
                            p.creditsAdded ? `+${p.creditsAdded} kredi` : null,
                            formatDate(p.paymentDate),
                          ].filter(Boolean).join(' • ')}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              )}

              {/* Premium Banner — sadece Free kullanıcılara */}
              {!hasPaid && (
                <Paper sx={{
                  p: 3, borderRadius: 4,
                  background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
                }}>
                  <Box sx={{ flex: '1 1 280px' }}>
                    <Typography variant="h6" fontWeight="bold">🚀 Premium'a Geçin!</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      200'e kadar firma araması, detaylı pazar analizi ve çok daha fazlası.
                    </Typography>
                  </Box>
                  <Button variant="contained" onClick={() => navigate('/#packages')}
                    sx={{ bgcolor: '#fff', color: '#1565C0', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#f0f0f0' } }}>
                    Hemen Yükselt
                  </Button>
                </Paper>
              )}

            </Box>
          </MuiGrid>
        </MuiGrid>
      </Container>

      {/* ABONELİK İPTAL DİALOGU */}
      <Dialog open={cancelOpen} onClose={() => !canceling && setCancelOpen(false)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Aboneliği İptal Et</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Aboneliğinizi iptal etmek istediğinize emin misiniz? <br/><br/>
            Mevcut dönem sonuna kadar (<strong>{formatDate(memberEnd)}</strong>) kullanım hakkınız ve kredileriniz devam edecektir. Ancak gelecek ay için kredi kartınızdan çekim <strong>yapılmayacaktır</strong>.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="İptal Nedeni (Bize yardımcı olmak için isteğe bağlı)"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            disabled={canceling}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCancelOpen(false)} disabled={canceling} color="inherit">
            Vazgeç
          </Button>
          <Button 
            onClick={handleCancelSubscription} 
            color="error" 
            variant="contained" 
            disabled={canceling}
            sx={{ fontWeight: 'bold' }}
          >
            {canceling ? <CircularProgress size={24} color="inherit" /> : 'Evet, İptal Et'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Profile;