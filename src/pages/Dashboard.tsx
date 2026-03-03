import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  InputAdornment,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Fade,
  Backdrop,
  CircularProgress,
  Divider,
  Autocomplete,
  Popper,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Collapse,
  Tabs,
  Tab,
} from '@mui/material';

// İkonlar
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public'; // Ülke için
import LanguageIcon from '@mui/icons-material/Language'; // Dil için
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; // Ürün için
import DownloadIcon from '@mui/icons-material/Download'; // Excel için
import LogoutIcon from '@mui/icons-material/Logout';
import BoltIcon from '@mui/icons-material/Bolt'; // Kredi ikonu
import BusinessIcon from '@mui/icons-material/Business'; // Firma sayısı için
import HistoryIcon from '@mui/icons-material/History'; // Geçmiş ikonu
import CloseIcon from '@mui/icons-material/Close'; // Kapatma ikonu
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Başarılı ikonu
import ErrorIcon from '@mui/icons-material/Error'; // Hata ikonu
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Bekliyor ikonu
import ConstructionIcon from '@mui/icons-material/Construction'; // Yapım ikonu
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'; // Hediye ikonu
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Konum ikonu
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Genişlet ikonu
import PlaceIcon from '@mui/icons-material/Place'; // Bölge ikonu
import DescriptionIcon from '@mui/icons-material/Description'; // PDF/Rapor ikonu
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Analiz ikonu

import { authService } from '../services/auth';
import { scraperService, ScrapeResponse, UserJob } from '../services/scraper';
import { apiClient } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { Country, State } from 'country-state-city';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';

// Tüm diller listesi
const ALL_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', native: 'Türkçe' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
];

// --- STİLLER (Mavi tema ağırlıklı) ---
const BRAND_COLORS = {
  primary: '#1565C0',
  primaryHover: '#0D47A1',
  secondary: '#1976D2',
  lightBlue: '#42A5F5',
  bgLight: '#E3F2FD', // Açık mavi arka plan
  bgGradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
  success: '#2E7D32', // Excel butonu için yeşil
  cardBg: '#FFFFFF',
};

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: BRAND_COLORS.bgGradient,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
    zIndex: 0,
  }
});

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(227, 242, 253, 0.95) 15%, rgba(21, 101, 192, 0.95) 35%, rgba(21, 101, 192, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
  color: '#FFFFFF',
});

const SearchCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(21, 101, 192, 0.15)',
  marginTop: theme.spacing(4),
  backgroundColor: BRAND_COLORS.cardBg,
  border: '1px solid rgba(21, 101, 192, 0.1)',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    borderRadius: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '12px',
    marginTop: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F8F9FA',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#BBDEFB',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: BRAND_COLORS.primary,
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderColor: BRAND_COLORS.primary,
      borderWidth: 2,
      boxShadow: '0 0 0 3px rgba(21, 101, 192, 0.1)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_COLORS.primary,
    fontWeight: 600,
  },
});

const StyledFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F8F9FA',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#BBDEFB',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: BRAND_COLORS.primary,
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderColor: BRAND_COLORS.primary,
      borderWidth: 2,
      boxShadow: '0 0 0 3px rgba(21, 101, 192, 0.1)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_COLORS.primary,
    fontWeight: 600,
  },
});

const ActionButton = styled(Button)(({ theme }: { theme?: any }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: '0 4px 10px rgba(21, 101, 192, 0.3)',
  backgroundColor: BRAND_COLORS.primary,
  color: '#fff',
  '&:hover': {
    backgroundColor: BRAND_COLORS.primaryHover,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  },
  transition: 'all 0.2s ease',
  [theme?.breakpoints.down('sm')]: {
    padding: '10px 16px',
    fontSize: '0.9rem',
    width: '100%',
  },
}));

const ExcelButton = styled(Button)(({ theme }: { theme?: any }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)',
  backgroundColor: BRAND_COLORS.success,
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1B5E20',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  },
  transition: 'all 0.2s ease',
  [theme?.breakpoints.down('sm')]: {
    padding: '10px 16px',
    fontSize: '0.9rem',
    width: '100%',
  },
}));

// --- COMPONENT ---

const Dashboard = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Tab State'i - 0: Firma Arama, 1: Pazar Analizi
  const [activeTab, setActiveTab] = useState(0);

  // Pazar Analizi State'leri
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string>('');
  const [analysisFormData, setAnalysisFormData] = useState({
    hsCode: '',
    productName: '',
    targetCountry: '',
    originCountry: 'Türkiye'
  });

  // Ülke ve Şehir State'leri
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Bölge Detayları State'leri
  const [showRegionDetails, setShowRegionDetails] = useState(false);

  // Arama State'leri
  const [searchParams, setSearchParams] = useState({
    country: '',
    city: '',
    district: '',    // İlçe
    neighborhood: '', // Mahalle/Bölge
    language: 'tr',
    product: '',
    companyCount: '10'
  });

  // Loading ve Sonuç State'leri
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ScrapeResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Geçmiş Aramalar Modal State'leri
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<UserJob[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string>('');
  const [downloadingJobId, setDownloadingJobId] = useState<number | null>(null);

  // Son Arama Önerileri State'leri (localStorage'dan)
  interface RecentSearch {
    product: string;
    country: string;
    city: string;
    timestamp: number;
  }
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // LocalStorage'dan son aramaları yükle
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed);
      } catch (e) {
        console.error('Son aramalar yüklenemedi');
      }
    }
  }, []);

  // Yeni arama kaydet
  const saveRecentSearch = (product: string, country: string, city: string) => {
    const newSearch: RecentSearch = {
      product,
      country,
      city,
      timestamp: Date.now()
    };

    // Aynı aramayı tekrar ekleme, en fazla 10 arama sakla
    const filtered = recentSearches.filter(
      s => !(s.product === product && s.country === country && s.city === city)
    );
    const updated = [newSearch, ...filtered].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Son ürün aramalarını getir (benzersiz)
  const getRecentProducts = (): string[] => {
    const products = recentSearches.map(s => s.product).filter(Boolean);
    return Array.from(new Set(products)).slice(0, 5);
  };

  // Son şehir aramalarını getir (benzersiz)
  const getRecentCities = (): string[] => {
    const citiesFromHistory = recentSearches.map(s => s.city).filter(Boolean);
    return Array.from(new Set(citiesFromHistory)).slice(0, 5);
  };

  // Sayfa yüklendiğinde kullanıcıyı çek
  useEffect(() => {
    // Ülkeleri yükle
    const countryList = Country.getAllCountries().map(c => c.name);
    setCountries(countryList);

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      // Kullanıcı yoksa Login'e at (Güvenlik)
      navigate('/login');
    }
  }, [navigate]);

  // Ülke değiştiğinde şehirleri güncelle
  useEffect(() => {
    if (searchParams.country) {
      const countryData = Country.getAllCountries().find(c => c.name === searchParams.country);
      if (countryData) {
        const stateList = State.getStatesOfCountry(countryData.isoCode).map(s => s.name);
        setCities(stateList);
        setSearchParams(prev => ({ ...prev, city: '' })); // Şehri sıfırla
      }
    }
  }, [searchParams.country]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Geçmiş aramaları yükle
  const loadSearchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const jobs = await scraperService.getMyJobs(1, 50);
      setHistoryData(jobs);
    } catch (err: any) {
      // 404 hatası - endpoint henüz mevcut değil
      if (err?.response?.status === 404) {
        setHistoryError(
          language === 'tr'
            ? 'Bu özellik henüz aktif değil. Yakında kullanılabilir olacak!'
            : 'This feature is not yet active. Coming soon!'
        );
      } else {
        setHistoryError(
          language === 'tr'
            ? 'Geçmiş aramalar yüklenirken bir hata oluştu.'
            : 'An error occurred while loading search history.'
        );
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  // Modal açıldığında geçmişi yükle
  const handleOpenHistoryModal = () => {
    setHistoryModalOpen(true);
    loadSearchHistory();
    handleClose(); // Menüyü kapat
  };

  // Geçmiş aramadan Excel indir
  const handleDownloadFromHistory = async (job: UserJob) => {
    setDownloadingJobId(job.jobId);
    try {
      await scraperService.downloadExcelFromJob(job);
    } catch (err: any) {
      setHistoryError(
        language === 'tr'
          ? 'Excel indirme sırasında bir hata oluştu.'
          : 'An error occurred while downloading Excel.'
      );
    } finally {
      setDownloadingJobId(null);
    }
  };

  // Tarihi formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Durum badge rengi
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#2E7D32';
      case 'pending':
      case 'processing':
        return '#ED6C02';
      case 'failed':
        return '#D32F2F';
      default:
        return '#757575';
    }
  };

  // Durum ikonu
  const getStatusIcon = (status: string): React.ReactElement | undefined => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'pending':
      case 'processing':
        return <HourglassEmptyIcon sx={{ fontSize: 16 }} />;
      case 'failed':
        return <ErrorIcon sx={{ fontSize: 16 }} />;
      default:
        return undefined;
    }
  };

  const handleSearch = async () => {
    // Validasyon
    if (!searchParams.product.trim()) {
      setError(language === 'tr' ? 'Lütfen ürün ismi girin!' : 'Please enter a product name!');
      return;
    }
    if (!searchParams.country) {
      setError(language === 'tr' ? 'Lütfen ülke seçin!' : 'Please select a country!');
      return;
    }
    if (!searchParams.city) {
      setError(language === 'tr' ? 'Lütfen şehir seçin!' : 'Please select a city!');
      return;
    }

    const companyCount = parseInt(searchParams.companyCount);
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    // Admin değilse firma sayısı kontrolü yap (Max 10)
    if (!isAdmin && (companyCount < 1 || companyCount > 10)) {
      setError(`⚠️ ${language === 'tr' ? 'Free pakette maksimum 10 firma aranabilir.' : 'Maximum 10 companies per search in free plan.'} ${language === 'tr' ? 'Daha fazla arama için paket yükseltin!' : 'Upgrade your package to search more!'}`);
      return;
    }

    // Admin ise sınır yok, normal kullanıcılar için minimum kontrol
    if (companyCount < 1) {
      setError(language === 'tr' ? 'Lütfen en az 1 firma seçin!' : 'Please select at least 1 company!');
      return;
    }

    setError('');
    setIsLoading(true);
    setSearchResults(null);

    try {
      // Kredi kontrolü (Admin için değil)
      const isAdmin = user?.role?.toLowerCase() === 'admin';
      const availableCredits = user?.credits || 0;

      // Her arama 1 kredi kullanıyor
      if (!isAdmin && availableCredits < 1) {
        setError(`${language === 'tr' ? '❌ Yetersiz kredi!' : '❌ Insufficient credits!'} ${language === 'tr' ? 'Mevcut' : 'Available'}: ${availableCredits}`);
        setIsLoading(false);
        return;
      }

      // API isteği - Arka planda otomatik arama
      // Bölge detayları varsa şehir bilgisine ekle
      let locationQuery = searchParams.city;
      if (searchParams.district) {
        locationQuery += `, ${searchParams.district}`;
      }
      if (searchParams.neighborhood) {
        locationQuery += `, ${searchParams.neighborhood}`;
      }

      const response = await scraperService.scrape({
        category: searchParams.product,
        city: locationQuery,
        country: searchParams.country || 'Türkiye',
        language: searchParams.language || 'tr',
        maxResults: companyCount,
      });

      setSearchResults(response);

      // Son aramayı kaydet (öneriler için)
      saveRecentSearch(searchParams.product, searchParams.country, searchParams.city);

      // Kullanıcının kredi bilgisini güncelle - Her arama 1 kredi düşer (companyCount değil)
      const updatedUser = { ...user, credits: (user?.credits || 0) - 1 };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err: any) {
      // Axios hata mesajını doğru şekilde yakala
      if (err.response) {
        // Backend'den gelen hata mesajı - Detaylarını gösterme
        // Sadece genel bir hata mesajı göster
        if (err.response.status === 401) {
          setError(language === 'tr' ? '⚠️ Oturumunuz sona erdi. 3 saniye içinde giriş sayfasına yönlendirileceksiniz...' : '⚠️ Your session has expired. You will be redirected to login in 3 seconds...');
          // 3 saniye bekle ki kullanıcı mesajı görebilsin
          setTimeout(() => {
            authService.logout();
            navigate('/login');
          }, 3000);
        } else {
          // Diğer hatalar için genel mesaj
          setError(language === 'tr' ? '❌ Arama başarısız oldu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.' : '❌ Search failed. Please check your information and try again.');
        }

        // Hata mesajına scroll yap
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

      } else if (err.request) {
        // İstek gönderildi ama cevap alınamadı (network hatası)
        setError(language === 'tr' ? '❌ Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.' : '❌ Cannot connect to server. Please check your internet connection.');
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        // Başka bir hata
        setError(language === 'tr' ? '❌ Arama başarısız oldu. Lütfen tekrar deneyin.' : '❌ Search failed. Please try again.');
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (searchResults) {
      // Ürün ismi, ülke ve şehir bilgilerini kullan
      const productName = searchParams.product.trim();
      const country = searchParams.country;
      const city = searchParams.city;
      scraperService.downloadExcel(searchResults.jobId, productName, country, city);
    }
  };

  // PDF İndirme State'i
  const [pdfDownloading, setPdfDownloading] = React.useState(false);

  // Örnek HS Kodları ve Popüler Ülkeler (obje formatında)
  interface HsCodeItem {
    code: string;
    description: string;
    category: string;
  }
  const [sampleHsCodes, setSampleHsCodes] = React.useState<HsCodeItem[]>([]);
  const [popularCountries, setPopularCountries] = React.useState<string[]>([]);

  // Örnek HS Kodları ve Popüler Ülkeleri Yükle
  React.useEffect(() => {
    const fetchSampleData = async () => {
      try {
        const [hsResponse, countriesResponse] = await Promise.all([
          apiClient.get('/api/tradeintelligence/sample-hs-codes'),
          apiClient.get('/api/tradeintelligence/popular-countries')
        ]);
        
        // HS Kodları - obje dizisi olarak gelir
        if (hsResponse.data && Array.isArray(hsResponse.data)) {
          setSampleHsCodes(hsResponse.data);
        }
        
        // Popüler ülkeler - string dizisi veya obje dizisi olabilir
        if (countriesResponse.data && Array.isArray(countriesResponse.data)) {
          // Eğer obje dizisi ise name alanını al
          if (typeof countriesResponse.data[0] === 'object') {
            setPopularCountries(countriesResponse.data.map((c: any) => c.name || c.country || c));
          } else {
            setPopularCountries(countriesResponse.data);
          }
        }
      } catch (err) {
        console.log('Sample data fetch failed, using defaults');
        // Varsayılan değerler
        setSampleHsCodes([
          { code: '87116000', description: 'Elektrikli Bisiklet', category: 'Taşıtlar' },
          { code: '84713000', description: 'Dizüstü Bilgisayar', category: 'Elektronik' },
          { code: '85044090', description: 'Güç Kaynakları', category: 'Elektronik' },
          { code: '39269099', description: 'Plastik Ürünler', category: 'Plastik' },
          { code: '61091000', description: 'Pamuklu Tişört', category: 'Tekstil' }
        ]);
        setPopularCountries(['Almanya', 'Hollanda', 'Fransa', 'İtalya', 'İspanya', 'Belçika', 'Polonya', 'Romanya', 'Bulgaristan', 'Yunanistan']);
      }
    };
    fetchSampleData();
  }, []);

  // Mevcut Markdown'ı PDF'e Çevir (convert-to-pdf endpoint'i)
  const handleDownloadPDF = async () => {
    if (!analysisResult) return;
    
    setPdfDownloading(true);
    try {
      const response = await apiClient.post(
        '/api/tradeintelligence/convert-to-pdf',
        {
          // Backend'in beklediği format
          MarkdownContent: analysisResult,
          HsCode: analysisFormData.hsCode,
          ProductName: analysisFormData.productName,
          TargetCountry: analysisFormData.targetCountry,
          OriginCountry: analysisFormData.originCountry || 'Türkiye'
        },
        {
          responseType: 'blob' // PDF için blob response
        }
      );

      // PDF dosyasını indir
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Pazar_Analizi_${analysisFormData.productName}_${analysisFormData.targetCountry}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PDF download error:', err);
      
      // Blob response ise text'e çevir
      let errorDetail = '';
      if (err.response?.data instanceof Blob) {
        try {
          errorDetail = await err.response.data.text();
          console.error('Error detail (from blob):', errorDetail);
        } catch (e) {
          console.error('Could not read blob error');
        }
      } else if (err.response?.data) {
        errorDetail = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
        console.error('Error detail:', errorDetail);
      }
      
      setAnalysisError(language === 'tr' 
        ? `❌ PDF indirme sırasında bir hata oluştu.`
        : `❌ An error occurred while downloading PDF.`);
    } finally {
      setPdfDownloading(false);
    }
  };

  // Pazar Analizi Raporu Oluştur
  const handleGenerateAnalysis = async () => {
    // Validasyon
    if (!analysisFormData.hsCode.trim()) {
      setAnalysisError(language === 'tr' ? 'Lütfen HS Code girin!' : 'Please enter HS Code!');
      return;
    }
    if (!analysisFormData.productName.trim()) {
      setAnalysisError(language === 'tr' ? 'Lütfen ürün ismi girin!' : 'Please enter product name!');
      return;
    }
    if (!analysisFormData.targetCountry) {
      setAnalysisError(language === 'tr' ? 'Lütfen hedef ülke seçin!' : 'Please select target country!');
      return;
    }

    setAnalysisError('');
    setAnalysisLoading(true);
    setAnalysisResult(null);

    try {
      // Backend API'ye istek at
      const response = await apiClient.post('/api/tradeintelligence/generate-report', {
        hsCode: analysisFormData.hsCode,
        productName: analysisFormData.productName,
        targetCountry: analysisFormData.targetCountry,
        originCountry: analysisFormData.originCountry || 'Türkiye'
      });

      if (response.data && response.data.reportContent) {
        setAnalysisResult(response.data.reportContent);
      } else if (response.data && response.data.report) {
        setAnalysisResult(response.data.report);
      } else {
        setAnalysisError(language === 'tr' 
          ? '❌ Rapor içeriği alınamadı. Lütfen tekrar deneyin.'
          : '❌ Could not retrieve report content. Please try again.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      const errorMessage = err.response?.data?.message || (language === 'tr' 
        ? '❌ Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
        : '❌ An error occurred while generating the report. Please try again.');
      setAnalysisError(errorMessage);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Tab değişim handler'ı
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <PageContainer>
      {/* --- HEADER (Navbar) --- */}
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
            {/* Logo ve Başlık */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src={logoImage}
                alt="FGS Logo"
                sx={{
                  height: { xs: 60, sm: 65, md: 70 },
                  width: 'auto',
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
              <Typography
                variant="h5"
                fontWeight="800"
                sx={{
                  color: '#1565C0',
                  textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' }
                }}
              >
                FGS Trade
              </Typography>
            </Box>

            {/* Sağ Taraf: Kredi ve Profil */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {/* Kredi Göstergesi / Admin Badge */}
              {user?.role?.toLowerCase() === 'admin' ? (
                <Chip
                  icon={<BoltIcon sx={{ color: '#FFD700 !important' }} />}
                  label="🔑 Admin"
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'rgba(255, 215, 0, 0.3)',
                    color: '#FFD700',
                    border: '2px solid rgba(255, 215, 0, 0.6)',
                    height: { xs: 32, sm: 40 },
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover': {
                      bgcolor: 'rgba(255, 215, 0, 0.4)',
                    }
                  }}
                />
              ) : (
                <Chip
                  icon={<BoltIcon sx={{ color: '#FFC107 !important' }} />}
                  label={`${user?.credits || 0} ${t('dashboard.credits')}`}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    height: { xs: 32, sm: 40 },
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                />
              )}

              {/* Profil Menüsü */}
              <Tooltip title="Hesap Ayarları">
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: BRAND_COLORS.primary, width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleOpenHistoryModal}>
                  <HistoryIcon fontSize="small" sx={{ mr: 1, color: BRAND_COLORS.primary }} />
                  {t('dashboard.history.title')}
                </MenuItem>
                <MenuItem onClick={handleClose}>{t('dashboard.profile')}</MenuItem>
                <MenuItem onClick={handleClose}>{t('dashboard.upgrade')}</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> {t('dashboard.logout')}
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* --- ANA İÇERİK --- */}
      <Container maxWidth="lg" sx={{ mt: { xs: 3, sm: 4, md: 6 }, pb: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>

        {/* Karşılama Başlığı */}
        <Box mb={{ xs: 2, sm: 3, md: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
            {t('dashboard.greeting')}, {user?.fullName?.split(' ')[0] || 'Gezgin'} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {t('dashboard.subtitle')}
          </Typography>
        </Box>

        {/* Yapım Aşaması & Erken Yatırım Bildirimi */}
        <Alert
          severity="info"
          icon={<ConstructionIcon fontSize="large" />}
          sx={{
            mb: 3,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #42A5F5',
            boxShadow: '0 8px 24px rgba(21, 101, 192, 0.2)',
            '& .MuiAlert-icon': {
              color: BRAND_COLORS.primary,
              fontSize: '2rem'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' }, color: BRAND_COLORS.primary }}>
            {t('dashboard.notification.betaTitle')}
          </AlertTitle>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="body1" sx={{ mb: 2, color: '#333', lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {t('dashboard.notification.betaDesc')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1.5,
                bgcolor: 'rgba(255, 193, 7, 0.15)',
                p: { xs: 2, sm: 2.5 },
                borderRadius: '12px',
                border: '2px solid #FFC107',
                mt: 2
              }}
            >
              <CardGiftcardIcon sx={{ color: '#F57C00', fontSize: { xs: 32, sm: 36 }, flexShrink: 0 }} />
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#E65100', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                  🎁 {t('dashboard.notification.bonusTitle')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontSize: { xs: '0.85rem', sm: '0.9rem' }, lineHeight: 1.5 }}>
                  {t('dashboard.notification.bonusDesc')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Alert>

        {/* Tab Navigasyonu */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3, 
            borderRadius: '16px', 
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(21, 101, 192, 0.1)',
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                fontSize: { xs: '0.85rem', sm: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                color: '#666',
                '&.Mui-selected': {
                  color: BRAND_COLORS.primary,
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: BRAND_COLORS.primary,
              }
            }}
          >
            <Tab 
              icon={<SearchIcon sx={{ fontSize: 20 }} />} 
              iconPosition="start" 
              label={language === 'tr' ? '🔍 Firma Arama' : '🔍 Company Search'} 
            />
            <Tab 
              icon={<TrendingUpIcon sx={{ fontSize: 20 }} />} 
              iconPosition="start" 
              label={language === 'tr' ? '📊 Pazar Analizi' : '📊 Market Analysis'} 
            />
          </Tabs>
        </Paper>

        {/* TAB 0: Firma Arama Paneli */}
        {activeTab === 0 && (
        <Box>
        <SearchCard elevation={3}>
          <Typography variant="h6" fontWeight="bold" mb={3} sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            <SearchIcon sx={{ mr: 1, color: BRAND_COLORS.primary }} />
            {t('dashboard.search.title')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
            {/* 1. Ürün İsmi (En önemlisi, geniş olsun) - Autocomplete ile son aramalar */}
            <Box sx={{ width: '100%' }}>
              <Autocomplete
                freeSolo
                options={getRecentProducts()}
                value={searchParams.product}
                onChange={(event, newValue) => {
                  setSearchParams({ ...searchParams, product: newValue || '' });
                }}
                onInputChange={(event, newInputValue) => {
                  setSearchParams({ ...searchParams, product: newInputValue });
                }}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    fullWidth
                    label={t('dashboard.search.product')}
                    placeholder={t('dashboard.search.productPlaceholder')}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <ShoppingBagIcon color="primary" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <HistoryIcon sx={{ color: '#9E9E9E', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={option}
                      primaryTypographyProps={{ fontSize: '0.95rem' }}
                    />
                  </ListItem>
                )}
                ListboxProps={{
                  sx: {
                    '& .MuiAutocomplete-option': {
                      py: 1,
                      borderBottom: '1px solid #F0F0F0',
                      '&:last-child': { borderBottom: 'none' }
                    }
                  }
                }}
                noOptionsText={language === 'tr' ? 'Henüz arama geçmişi yok' : 'No search history yet'}
              />
            </Box>

            {/* 2-4. Ülke, Şehir */}
            <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
              {/* 2. Ülke - Autocomplete ile arama yapılabilir */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <Autocomplete
                  options={countries}
                  value={searchParams.country || null}
                  onChange={(event, newValue) => {
                    setSearchParams({ ...searchParams, country: newValue || '', city: '', district: '', neighborhood: '' });
                    setShowRegionDetails(false);
                  }}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      label={t('dashboard.search.country')}
                      placeholder={t('dashboard.search.countryPlaceholder')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <PublicIcon color="primary" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={language === 'tr' ? 'Ülke bulunamadı' : 'Country not found'}
                  ListboxProps={{
                    sx: { maxHeight: 250 }
                  }}
                />
              </Box>

              {/* 3. Şehir - Autocomplete ile arama yapılabilir (Ülke seçildikten sonra aktif) */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <Autocomplete
                  options={cities}
                  value={searchParams.city || null}
                  onChange={(event, newValue) => {
                    setSearchParams({ ...searchParams, city: newValue || '', district: '', neighborhood: '' });
                    setShowRegionDetails(false);
                  }}
                  disabled={!searchParams.country}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      label={t('dashboard.search.city')}
                      placeholder={searchParams.country ? t('dashboard.search.cityPlaceholder') : (language === 'tr' ? 'Önce ülke seçin' : 'Select country first')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocationOnIcon color={searchParams.country ? "primary" : "disabled"} />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={language === 'tr' ? 'Şehir bulunamadı' : 'City not found'}
                  ListboxProps={{
                    sx: { maxHeight: 250 }
                  }}
                />
              </Box>
            </Box>

            {/* Bölge Detayları Seçeneği - Şehir seçildiyse görünür */}
            {searchParams.city && (
              <Box sx={{ mt: -1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showRegionDetails}
                      onChange={(e) => {
                        setShowRegionDetails(e.target.checked);
                        if (!e.target.checked) {
                          setSearchParams({ ...searchParams, district: '', neighborhood: '' });
                        }
                      }}
                      sx={{
                        color: BRAND_COLORS.primary,
                        '&.Mui-checked': { color: BRAND_COLORS.primary },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PlaceIcon sx={{ fontSize: 18, color: BRAND_COLORS.primary }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {t('dashboard.search.addRegionDetails')}
                      </Typography>
                    </Box>
                  }
                />

                {/* Bölge Detayları Alanları */}
                <Collapse in={showRegionDetails}>
                  <Box sx={{
                    display: 'flex',
                    gap: { xs: 2, sm: 3 },
                    flexWrap: 'wrap',
                    mt: 2,
                    p: 2,
                    bgcolor: 'rgba(21, 101, 192, 0.03)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(21, 101, 192, 0.2)'
                  }}>
                    {/* İlçe */}
                    <Box sx={{ flex: '1 1 100%', minWidth: { sm: '200px', md: '250px' } }}>
                      <StyledTextField
                        fullWidth
                        label={t('dashboard.search.district')}
                        placeholder={t('dashboard.search.districtPlaceholder')}
                        value={searchParams.district}
                        onChange={(e) => setSearchParams({ ...searchParams, district: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon sx={{ color: BRAND_COLORS.primary }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    {/* Mahalle/Bölge */}
                    <Box sx={{ flex: '1 1 100%', minWidth: { sm: '200px', md: '250px' } }}>
                      <StyledTextField
                        fullWidth
                        label={t('dashboard.search.neighborhood')}
                        placeholder={t('dashboard.search.neighborhoodPlaceholder')}
                        value={searchParams.neighborhood}
                        onChange={(e) => setSearchParams({ ...searchParams, neighborhood: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PlaceIcon sx={{ color: BRAND_COLORS.secondary }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            )}

            {/* 4. Dil ve Firma Sayısı */}
            <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <StyledFormControl fullWidth>
                  <InputLabel>{t('dashboard.search.language')}</InputLabel>
                  <Select
                    label={t('dashboard.search.language')}
                    value={searchParams.language}
                    onChange={(e) => setSearchParams({ ...searchParams, language: e.target.value })}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1 }}>
                        <LanguageIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {ALL_LANGUAGES.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.native} ({lang.name})
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Box>

              {/* 5. Firma Sayısı */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <StyledTextField
                  fullWidth
                  type="number"
                  label={t('dashboard.search.companyCount')}
                  placeholder={user?.role?.toLowerCase() === 'admin' ? "E.g: 50, 100, 500..." : "Maximum 10 companies"}
                  value={searchParams.companyCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const isAdmin = user?.role?.toLowerCase() === 'admin';

                    // Admin değilse 10'a sınırla ve uyar
                    if (!isAdmin && value > 10) {
                      setError(`⚠️ ${language === 'tr' ? 'Free pakette maksimum 10 firma aranabilir.' : 'Maximum 10 companies per search in free plan.'} ${language === 'tr' ? 'Daha fazla arama için paket yükseltin!' : 'Upgrade your package to search more!'}`);
                      setTimeout(() => setError(''), 5000);
                      setSearchParams({ ...searchParams, companyCount: '10' });
                    } else {
                      // Admin ise sınır yok, değeri direkt kaydet
                      setSearchParams({ ...searchParams, companyCount: value.toString() });
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: 1,
                      max: user?.role?.toLowerCase() === 'admin' ? 1000 : 10
                    }
                  }}
                  helperText={user?.role?.toLowerCase() === 'admin' ? "Admin: No limit" : "Min 1, max 10 companies"}
                />
              </Box>
            </Box>



            {/* Hata Mesajı */}
            {error && (
              <Box
                id="error-message"
                sx={{
                  mt: 2,
                  p: 2.5,
                  bgcolor: '#ffebee',
                  borderRadius: '12px',
                  border: '2px solid #ef5350',
                  boxShadow: '0 4px 12px rgba(239, 83, 80, 0.3)',
                  animation: 'shake 0.5s',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-10px)' },
                    '75%': { transform: 'translateX(10px)' }
                  }
                }}
              >
                <Typography sx={{ color: '#c62828', fontWeight: 600, fontSize: '1rem' }}>
                  {error}
                </Typography>
              </Box>
            )}

            {/* Loading Mesajı - Modern Animasyon */}
            {isLoading && (
              <Box sx={{
                mt: 2,
                p: 3,
                bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #42A5F5',
                boxShadow: '0 4px 20px rgba(21, 101, 192, 0.2)'
              }}>
                {/* Animasyonlu Dönen Dünya */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  position: 'relative',
                  height: '120px'
                }}>
                  {/* Merkez Dönen Küre */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    animation: 'spinClockwise 2s linear infinite',
                    zIndex: 10,
                    '@keyframes spinClockwise': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    },
                    filter: 'drop-shadow(0 4px 10px rgba(21, 101, 192, 0.4))'
                  }}>
                    <Typography sx={{ fontSize: '4.5rem' }}>
                      🌍
                    </Typography>
                  </Box>

                  {/* Arka plan pulse efekti */}
                  <Box sx={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '2px solid #42A5F5',
                    opacity: 0.3,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: 0.3
                      },
                      '50%': {
                        transform: 'scale(1.1)',
                        opacity: 0.1
                      }
                    }
                  }} />
                </Box>

                {/* Metin */}
                <Typography sx={{ color: '#1565C0', fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
                  🔍 {t('dashboard.search.searching')}
                </Typography>
                <Typography sx={{ color: '#555', fontSize: '0.9rem', fontWeight: 500 }}>
                  Bu işlem birkaç dakika sürebilir. Lütfen bekleyiniz...
                </Typography>
              </Box>
            )}

            {/* BUTONLAR */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-end' }, flexWrap: 'wrap' }}>
              {/* Excel Butonu (Sadece sonuç varsa aktif) */}
              <ExcelButton
                variant="contained"
                onClick={handleExport}
                startIcon={<DownloadIcon />}
                disabled={!searchResults || isLoading}
              >
                {t('dashboard.search.exportExcel')}
              </ExcelButton>

              {/* Ara Butonu */}
              <ActionButton
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                disabled={isLoading}
                sx={{ px: { xs: 3, sm: 6 } }}
              >
                {isLoading ? t('dashboard.search.searching') : t('dashboard.search.searchButton')}
              </ActionButton>
            </Box>
          </Box>
        </SearchCard>

        {/* Sonuç Alanı */}
        {searchResults ? (
          <Box sx={{
            mt: { xs: 4, sm: 5, md: 6 },
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: '16px', sm: '20px' },
            p: { xs: 3, sm: 4 },
            border: '1px solid rgba(21, 101, 192, 0.2)',
            boxShadow: '0 8px 32px rgba(21, 101, 192, 0.15)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: BRAND_COLORS.primary }}>
                ✅ {searchResults.totalResults} Firma Bulundu!
              </Typography>
              <Chip
                label={`1 kredi kullanıldı`}
                sx={{
                  bgcolor: '#4caf50',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              />
            </Box>

            {/* Firma Tablosu - Profesyonel Responsive Data Table */}
            <Box sx={{
              overflowX: 'auto',
              borderRadius: { xs: '12px', sm: '16px' },
              border: `1px solid ${BRAND_COLORS.primary}20`,
              mb: 4,
              boxShadow: '0 2px 8px rgba(21, 101, 192, 0.08)',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(21, 101, 192, 0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: BRAND_COLORS.primary,
                borderRadius: '4px',
                '&:hover': {
                  background: BRAND_COLORS.primaryHover,
                }
              }
            }}>
              {/* Sabit Grid Sütun Yapısı - Header ve Satırlar İçin */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#FFFFFF',
                borderRadius: { xs: '12px', sm: '16px' },
                overflow: 'hidden',
                minWidth: '1530px',
              }}>
                {/* Tablo Header - Sticky & Fixed */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: '200px 250px 180px 160px 130px 130px 110px 110px 180px 180px',
                  gap: 0,
                  bgcolor: `${BRAND_COLORS.primary}15`,
                  borderBottom: `2px solid ${BRAND_COLORS.primary}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 20,
                  backdropFilter: 'blur(4px)',
                  width: '100%',
                }}>
                  {[
                    'Company Name',
                    'Address',
                    'Website',
                    'Email',
                    'Phone',
                    'Mobile',
                    'City',
                    'Country',
                    'Social Media',
                    'Notes'
                  ].map((label, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: '14px 12px',
                        fontWeight: 'bold',
                        color: BRAND_COLORS.primary,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'left',
                        borderRight: idx < 9 ? `1px solid ${BRAND_COLORS.primary}20` : 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        ...(idx === 0 && {
                          position: 'sticky',
                          left: 0,
                          zIndex: 21,
                          bgcolor: `${BRAND_COLORS.primary}15`,
                          boxShadow: '2px 0 4px rgba(21, 101, 192, 0.1)'
                        })
                      }}>
                      {label}
                    </Box>
                  ))}
                </Box>

                {/* Tablo Satırları */}
                {searchResults.businesses.map((business, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '200px 250px 180px 160px 130px 130px 110px 110px 180px 180px',
                      gap: 0,
                      borderBottom: `1px solid ${BRAND_COLORS.primary}15`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: `${BRAND_COLORS.primary}08`,
                        boxShadow: `inset 0 0 0 1px ${BRAND_COLORS.primary}20`,
                      },
                      '&:last-child': {
                        borderBottom: 'none',
                        borderRadius: '0 0 16px 16px'
                      }
                    }}
                  >
                    {/* Firma Adı */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px',
                      position: 'sticky',
                      left: 0,
                      zIndex: 15,
                      bgcolor: '#FFFFFF',
                      boxShadow: '2px 0 4px rgba(21, 101, 192, 0.08)'
                    }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: BRAND_COLORS.primary,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={business.businessName}
                      >
                        {business.businessName}
                      </Typography>
                    </Box>

                    {/* Adres */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      <Typography
                        sx={{
                          color: '#555',
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={business.address}
                      >
                        {business.address || 'Not Found'}
                      </Typography>
                    </Box>

                    {/* Website */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.website ? (
                        <Typography
                          component="a"
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          title={business.website}
                        >
                          {business.website}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* E-mail */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.email ? (
                        <Typography
                          component="a"
                          href={`mailto:${business.email}`}
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          title={business.email}
                        >
                          {business.email}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Telefon */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.phone ? (
                        <Typography
                          component="a"
                          href={`tel:${business.phone}`}
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                          title={business.phone}
                        >
                          {business.phone}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Mobil */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.mobile ? (
                        <Typography
                          component="a"
                          href={`tel:${business.mobile}`}
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                          title={business.mobile}
                        >
                          {business.mobile}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Şehir */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      <Typography sx={{ color: '#555', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                        {business.city || 'Not Found'}
                      </Typography>
                    </Box>

                    {/* Ülke */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      <Typography sx={{ color: '#555', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                        {business.country || 'Not Found'}
                      </Typography>
                    </Box>

                    {/* Sosyal Medya */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.socialMedia ? (
                        <Typography
                          component="a"
                          href={business.socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          title={business.socialMedia}
                        >
                          {business.socialMedia}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Notlar/Yorum */}
                    <Box sx={{
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '50px'
                    }}>
                      <Typography
                        sx={{
                          color: '#555',
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={business.comments || 'Not Found'}
                      >
                        {business.comments || 'Not Found'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bilgi Mesajı */}
            <Box sx={{
              bgcolor: 'rgba(21, 101, 192, 0.05)',
              border: `1px solid ${BRAND_COLORS.primary}30`,
              borderRadius: '12px',
              p: { xs: 2, sm: 2.5 },
              textAlign: 'center',
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                📊 Toplam <strong>{searchResults.businesses.length}</strong> firma listelendi. Tüm verileri Excel'e aktarmak için aşağıdaki butonu kullanın.
              </Typography>
            </Box>

            {/* Excel İndirme Butonu */}
            {/* Excel İndirme Butonu ve Alternatif Link */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <ExcelButton
                variant="contained"
                onClick={handleExport}
                startIcon={<DownloadIcon />}
                sx={{ fontSize: '1rem', py: 1.5, px: 4 }}
              >
                📥 Excel Dosyasını İndir
              </ExcelButton>

              {/* Alternatif İndirme Bağlantısı */}
              <Box sx={{ mt: 3, p: 2, borderTop: '1px dashed #ccc' }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  {language === 'tr'
                    ? "Buton çalışmıyor mu? Alternatif bağlantıyı deneyin:"
                    : "Button not working? Try the alternative link:"}
                </Typography>
                <Button
                  variant="text"
                  onClick={handleExport}
                  sx={{
                    textDecoration: 'underline',
                    color: BRAND_COLORS.primary,
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'none', bgcolor: 'transparent' }
                  }}
                >
                  {searchParams.product}_{searchParams.city}.xlsx
                </Button>
              </Box>

              <Typography variant="body2" sx={{ color: '#666', mt: 2, fontSize: '0.85rem', fontStyle: 'italic' }}>
                💡 Tüm firma bilgilerini detaylı şekilde Excel formatında indirebilirsiniz.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{
            mt: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: '16px', sm: '20px' },
            p: { xs: 3, sm: 4, md: 6 },
            border: '1px solid rgba(21, 101, 192, 0.1)',
            boxShadow: '0 4px 20px rgba(21, 101, 192, 0.08)',
            transition: 'all 0.3s ease',
          }}>
            <Box sx={{
              width: { xs: 80, sm: 100, md: 120 },
              height: { xs: 80, sm: 100, md: 120 },
              borderRadius: '50%',
              bgcolor: 'rgba(21, 101, 192, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: { xs: 2, sm: 3 },
            }}>
              <SearchIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: BRAND_COLORS.primary, opacity: 0.5 }} />
            </Box>

            <Typography variant="h5" fontWeight="600" sx={{ color: BRAND_COLORS.primary, mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Henüz Arama Yapılmadı
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '500px', margin: '0 auto', lineHeight: 1.8, fontSize: { xs: '0.9rem', sm: '1rem' }, px: { xs: 2, sm: 0 } }}>
              Kriterlerinizi yukarıdaki formu kullanarak girin ve <strong>"Firma Ara"</strong> butonuna basarak potansiyel müşterilerinizi listeleyin.
            </Typography>

            <Box sx={{ mt: { xs: 3, sm: 4 }, display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 1, sm: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
                <PublicIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Global Erişim</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
                <ShoppingBagIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Sektör Bazlı</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
                <DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Excel İndirme</Typography>
              </Box>
            </Box>
          </Box>
        )}
        </Box>
        )}

        {/* TAB 1: Pazar Analizi Paneli */}
        {activeTab === 1 && (
          <SearchCard elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(21, 101, 192, 0.1)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUpIcon sx={{ color: BRAND_COLORS.primary, fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#333', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                  {language === 'tr' ? 'Pazar Analizi' : 'Market Analysis'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                  {language === 'tr' 
                    ? 'Detaylı pazar raporu oluşturun'
                    : 'Generate detailed market reports'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {/* HS Code Girişi - Autocomplete ile örnek kodlar */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ color: '#555', mb: 1 }}>
                  {language === 'tr' ? 'HS Code (GTIP)' : 'HS Code'}
                </Typography>
                <Autocomplete
                  freeSolo
                  options={sampleHsCodes}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.code}
                  value={analysisFormData.hsCode}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setAnalysisFormData({...analysisFormData, hsCode: newValue});
                    } else if (newValue) {
                      setAnalysisFormData({...analysisFormData, hsCode: newValue.code});
                    } else {
                      setAnalysisFormData({...analysisFormData, hsCode: ''});
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setAnalysisFormData({...analysisFormData, hsCode: newInputValue});
                  }}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      fullWidth
                      placeholder={language === 'tr' ? 'Örn: 87116000' : 'E.g: 87116000'}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <DescriptionIcon color="primary" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <ListItem {...props} key={typeof option === 'string' ? option : option.code}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <DescriptionIcon sx={{ color: '#1565C0', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={typeof option === 'string' ? option : option.code}
                        secondary={typeof option === 'string' ? '' : `${option.description} (${option.category})`}
                        primaryTypographyProps={{ fontSize: '0.95rem', fontFamily: 'monospace', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.8rem', color: '#666' }}
                      />
                    </ListItem>
                  )}
                  noOptionsText={language === 'tr' ? 'HS Code girin' : 'Enter HS Code'}
                />
                <Typography variant="caption" sx={{ color: '#888', mt: 0.5, display: 'block' }}>
                  {language === 'tr' ? '💡 Örnek kodlardan seçebilir veya kendiniz girebilirsiniz' : '💡 Select from examples or enter your own'}
                </Typography>
              </Box>

              {/* Ürün İsmi */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ color: '#555', mb: 1 }}>
                  {language === 'tr' ? 'Ürün İsmi' : 'Product Name'}
                </Typography>
                <StyledTextField
                  fullWidth
                  placeholder={language === 'tr' ? 'Örn: Elektrikli Bisiklet' : 'E.g: Electric Bicycle'}
                  value={analysisFormData.productName}
                  onChange={(e) => setAnalysisFormData({...analysisFormData, productName: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ShoppingBagIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Hedef Ülke */}
              {/* Hedef Ülke - Popüler ülkeler öne çıkarılmış */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ color: '#555', mb: 1 }}>
                  {language === 'tr' ? 'Hedef Ülke' : 'Target Country'}
                </Typography>
                <Autocomplete
                  options={[...popularCountries, ...countries.filter(c => !popularCountries.includes(c))]}
                  groupBy={(option) => popularCountries.includes(option) 
                    ? (language === 'tr' ? '⭐ Popüler Ülkeler' : '⭐ Popular Countries')
                    : (language === 'tr' ? '🌍 Tüm Ülkeler' : '🌍 All Countries')}
                  value={analysisFormData.targetCountry || null}
                  onChange={(event, newValue) => {
                    setAnalysisFormData({...analysisFormData, targetCountry: newValue || ''});
                  }}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      placeholder={language === 'tr' ? 'Ülke seçin...' : 'Select country...'}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <PublicIcon color="primary" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderGroup={(params) => (
                    <Box key={params.key}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          color: '#1565C0',
                          bgcolor: '#E3F2FD',
                          px: 2,
                          py: 1,
                          position: 'sticky',
                          top: 0,
                          zIndex: 1
                        }}
                      >
                        {params.group}
                      </Typography>
                      {params.children}
                    </Box>
                  )}
                  noOptionsText={language === 'tr' ? 'Ülke bulunamadı' : 'Country not found'}
                />
              </Box>

              {/* Menşei Ülke */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ color: '#555', mb: 1 }}>
                  {language === 'tr' ? 'Menşei Ülke' : 'Origin Country'}
                </Typography>
                <StyledFormControl fullWidth>
                  <Select
                    value={analysisFormData.originCountry}
                    onChange={(e) => setAnalysisFormData({...analysisFormData, originCountry: e.target.value})}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1 }}>
                        <LocationOnIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="Türkiye">🇹🇷 Türkiye</MenuItem>
                    <MenuItem value="China">🇨🇳 China</MenuItem>
                    <MenuItem value="Germany">🇩🇪 Germany</MenuItem>
                    <MenuItem value="USA">🇺🇸 USA</MenuItem>
                    <MenuItem value="India">🇮🇳 India</MenuItem>
                    <MenuItem value="Japan">🇯🇵 Japan</MenuItem>
                    <MenuItem value="South Korea">🇰🇷 South Korea</MenuItem>
                    <MenuItem value="Italy">🇮🇹 Italy</MenuItem>
                    <MenuItem value="France">🇫🇷 France</MenuItem>
                    <MenuItem value="Spain">🇪🇸 Spain</MenuItem>
                  </Select>
                </StyledFormControl>
              </Box>
            </Box>

            {/* Hata Mesajı */}
            {analysisError && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  bgcolor: '#ffebee',
                  borderRadius: '12px',
                  border: '2px solid #ef5350',
                }}
              >
                <Typography sx={{ color: '#c62828', fontWeight: 600 }}>
                  {analysisError}
                </Typography>
              </Box>
            )}

            {/* Loading */}
            {analysisLoading && (
              <Box sx={{
                mt: 3,
                p: 3,
                bgcolor: 'rgba(21, 101, 192, 0.05)',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #42A5F5',
              }}>
                <CircularProgress size={40} sx={{ color: BRAND_COLORS.primary, mb: 2 }} />
                <Typography sx={{ color: BRAND_COLORS.primary, fontWeight: 600 }}>
                  {language === 'tr' ? '📊 Rapor Hazırlanıyor...' : '📊 Generating Report...'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                  {language === 'tr' 
                    ? 'Pazar verileri analiz ediliyor...'
                    : 'Analyzing market data...'}
                </Typography>
              </Box>
            )}

            {/* Sonuç - Detaylı Rapor Gösterimi */}
            {analysisResult && (
              <Box sx={{
                mt: 3,
                p: 3,
                bgcolor: 'rgba(46, 125, 50, 0.05)',
                borderRadius: '12px',
                border: '2px solid #4caf50',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: '#2E7D32', fontWeight: 700, fontSize: '1.1rem' }}>
                    ✅ {language === 'tr' ? 'Pazar Analizi Raporu Hazır' : 'Market Analysis Report Ready'}
                  </Typography>
                </Box>
                
                {/* Rapor İçeriği */}
                <Box 
                  sx={{ 
                    bgcolor: '#fff', 
                    borderRadius: 2, 
                    p: 3,
                    maxHeight: '500px',
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                    '& h1': { color: '#1565C0', borderBottom: '2px solid #e3f2fd', pb: 1, mb: 2, fontSize: '1.4rem' },
                    '& h2': { color: '#1976D2', borderBottom: '1px solid #e3f2fd', pb: 0.5, mb: 1.5, fontSize: '1.2rem', mt: 2 },
                    '& h3': { color: '#1E88E5', mb: 1, fontSize: '1rem', mt: 1.5 },
                    '& p': { mb: 1, lineHeight: 1.7 },
                    '& ul, & ol': { pl: 3, mb: 1 },
                    '& li': { mb: 0.5 },
                    '& strong': { color: '#1565C0' },
                    '& table': { 
                      width: '100%', 
                      borderCollapse: 'collapse', 
                      mb: 2,
                      '& th, & td': { 
                        border: '1px solid #e0e0e0', 
                        p: 1, 
                        textAlign: 'left',
                        fontSize: '0.9rem'
                      },
                      '& th': { bgcolor: '#f5f5f5', fontWeight: 600 },
                      '& tr:nth-of-type(even)': { bgcolor: '#fafafa' }
                    }
                  }}
                >
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: analysisResult
                        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^- (.+)$/gm, '<li>$1</li>')
                        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
                        .replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n/g, '<br/>')
                        .replace(/^(.+)$/gm, (match) => {
                          if (match.startsWith('<')) return match;
                          return `<p>${match}</p>`;
                        })
                    }} 
                  />
                </Box>

                {/* PDF İndirme Butonu */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={handleDownloadPDF}
                    disabled={pdfDownloading}
                    startIcon={pdfDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                    sx={{
                      bgcolor: '#D32F2F',
                      color: '#fff',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                      '&:hover': {
                        bgcolor: '#B71C1C',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {pdfDownloading 
                      ? (language === 'tr' ? 'PDF Hazırlanıyor...' : 'Preparing PDF...') 
                      : (language === 'tr' ? '📄 PDF Olarak İndir' : '📄 Download as PDF')}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Buton */}
            <Button
              onClick={handleGenerateAnalysis}
              disabled={analysisLoading}
              fullWidth
              sx={{
                mt: 4,
                py: 2,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(21, 101, 192, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(21, 101, 192, 0.5)',
                },
                '&:disabled': {
                  background: '#ccc',
                  color: '#999',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {analysisLoading ? (
                <>
                  <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
                  {language === 'tr' ? 'Rapor Hazırlanıyor...' : 'Generating Report...'}
                </>
              ) : (
                <>
                  <DescriptionIcon sx={{ mr: 1 }} />
                  {language === 'tr' ? 'Detaylı Pazar Analizi Oluştur (PDF)' : 'Generate Detailed Market Analysis (PDF)'}
                </>
              )}
            </Button>

            <Typography sx={{ mt: 3, textAlign: 'center', fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>
              * {language === 'tr' 
                ? 'Bu analiz güncel ticaret verileri kullanılarak hazırlanmaktadır.'
                : 'This analysis is prepared using current trade data.'}
            </Typography>
          </SearchCard>
        )}

      </Container>

      {/* Geçmiş Aramalarım Modal */}
      <Modal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backdropFilter: 'blur(4px)' }
        }}
      >
        <Fade in={historyModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '90%', md: '80%', lg: '900px' },
              maxHeight: '85vh',
              bgcolor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 24px 80px rgba(21, 101, 192, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
                color: '#FFFFFF',
                p: { xs: 2, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HistoryIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.4rem' } }}>
                  {t('dashboard.history.title')}
                </Typography>
              </Box>
              <IconButton
                onClick={() => setHistoryModalOpen(false)}
                sx={{
                  color: '#FFFFFF',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Modal Content */}
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                overflowY: 'auto',
                flex: 1,
                bgcolor: '#F8FAFC',
              }}
            >
              {historyLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={50} sx={{ color: BRAND_COLORS.primary }} />
                  <Typography sx={{ mt: 2, color: '#666' }}>{t('dashboard.history.loading')}</Typography>
                </Box>
              ) : historyError ? (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                  {historyError}
                </Alert>
              ) : historyData.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                  <HistoryIcon sx={{ fontSize: 64, color: '#BBDEFB', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#666', textAlign: 'center' }}>
                    {t('dashboard.history.noHistory')}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Özet Bilgi */}
                  <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    mb: 1
                  }}>
                    <Chip
                      icon={<SearchIcon />}
                      label={`${t('dashboard.history.totalSearches')}: ${historyData.length}`}
                      sx={{
                        bgcolor: '#E3F2FD',
                        color: BRAND_COLORS.primary,
                        fontWeight: 600,
                        px: 1,
                      }}
                    />
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`${t('dashboard.history.completedSearches')}: ${historyData.filter(j => j.status.toLowerCase() === 'completed').length}`}
                      sx={{
                        bgcolor: '#E8F5E9',
                        color: '#2E7D32',
                        fontWeight: 600,
                        px: 1,
                      }}
                    />
                  </Box>

                  {/* Arama Kartları */}
                  {historyData.map((job) => (
                    <Paper
                      key={job.jobId}
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: '14px',
                        border: '1px solid #E0E0E0',
                        bgcolor: '#FFFFFF',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(21, 101, 192, 0.12)',
                          borderColor: BRAND_COLORS.lightBlue,
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
                        {/* Sol: Arama Bilgileri */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Ürün ve Konum */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                            <ShoppingBagIcon sx={{ color: BRAND_COLORS.primary, fontSize: 20 }} />
                            <Typography fontWeight="bold" sx={{ color: '#333', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                              {job.category}
                            </Typography>
                            <Typography sx={{ color: '#999' }}>•</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PublicIcon sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                {job.city}, {job.country}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Alt Bilgiler */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            {/* Tarih */}
                            <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              📅 {formatDate(job.createdAt)}
                            </Typography>

                            {/* Sonuç Sayısı */}
                            {job.totalResults > 0 && (
                              <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <BusinessIcon sx={{ fontSize: 14 }} /> {job.totalResults} {t('dashboard.history.results')}
                              </Typography>
                            )}

                            {/* Dil */}
                            {job.language && (
                              <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LanguageIcon sx={{ fontSize: 14 }} /> {job.language.toUpperCase()}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Sağ: Durum ve İndir Butonu */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                          {/* Durum Badge */}
                          <Chip
                            icon={getStatusIcon(job.status)}
                            label={
                              job.status.toLowerCase() === 'completed'
                                ? t('dashboard.history.completed')
                                : job.status.toLowerCase() === 'pending' || job.status.toLowerCase() === 'processing'
                                  ? t('dashboard.history.pending')
                                  : t('dashboard.history.failed')
                            }
                            size="small"
                            sx={{
                              bgcolor: `${getStatusColor(job.status)}15`,
                              color: getStatusColor(job.status),
                              fontWeight: 600,
                              borderRadius: '8px',
                              '& .MuiChip-icon': {
                                color: getStatusColor(job.status),
                              }
                            }}
                          />

                          {/* İndir Butonu */}
                          {job.status.toLowerCase() === 'completed' && job.totalResults > 0 && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={downloadingJobId === job.jobId ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                              disabled={downloadingJobId === job.jobId}
                              onClick={() => handleDownloadFromHistory(job)}
                              sx={{
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                bgcolor: BRAND_COLORS.success,
                                boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
                                '&:hover': {
                                  bgcolor: '#1B5E20',
                                },
                                px: { xs: 1.5, sm: 2 },
                                py: 0.75,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                              }}
                            >
                              {downloadingJobId === job.jobId
                                ? (language === 'tr' ? 'İndiriliyor...' : 'Downloading...')
                                : t('dashboard.history.download')
                              }
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

    </PageContainer>
  );
};

export default Dashboard;