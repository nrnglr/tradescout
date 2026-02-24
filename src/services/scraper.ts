// Scraper API Service
import { apiClient } from './api';

export interface ScrapeRequest {
  category: string;
  city: string;
  country?: string;
  language?: string;
  maxResults: number;
}

export interface Business {
  businessName: string;
  address: string;
  phone?: string;
  mobile?: string;
  website?: string;
  email?: string;
  rating?: number;
  reviewCount?: number;
  workingHours?: string;
  category?: string;
  city: string;
  country: string;
  socialMedia?: string;
  comments?: string;
}

export interface ScrapeResponse {
  jobId: number;
  status: string;
  message: string;
  totalResults: number;
  creditsUsed: number;
  businesses: Business[];
  downloadUrl: string;
}

export interface CreditsResponse {
  credits: number;
}

export interface JobStatusResponse {
  jobId: number;
  status: string;
  processed: number;
  total: number;
  businesses: Business[];
}

class ScraperService {
  /**
   * 🔍 Varsayılan scraping endpoint (ChromeDriver destekli)
   * Backend'de istediğiniz yöntemi kullanabilirsiniz (Gemini AI, Selenium, vb.)
   * Frontend kullanıcısı bu detayları görmez, sadece "arama yapılıyor" mesajı alır.
   * @param data - Scraping parametreleri
   * @returns Scraping sonucu
   */
  async scrape(data: ScrapeRequest): Promise<ScrapeResponse> {
    const response = await apiClient.post<ScrapeResponse>('/api/scraper/scrape-gemini', data);
    return response.data;
  }

  /**
   * 🐌 Selenium ile detaylı scraping (yavaş ama kesin)
   * @param data - Scraping parametreleri
   * @returns Scraping sonucu
   */
  async scrapeWithSelenium(data: ScrapeRequest): Promise<ScrapeResponse> {
    const response = await apiClient.post<ScrapeResponse>('/api/scraper/scrape', data);
    return response.data;
  }

  /**
   * 🚀 10 proxy ile paralel scraping (hızlı ve detaylı)
   * @param data - Scraping parametreleri
   * @returns Scraping sonucu
   */
  async scrapeWithParallel(data: ScrapeRequest): Promise<ScrapeResponse> {
    const response = await apiClient.post<ScrapeResponse>('/api/scraper/scrape-parallel', data);
    return response.data;
  }

  /**
   * Mevcut kredi bakiyesini getir
   */
  async getCredits(): Promise<number> {
    const response = await apiClient.get<CreditsResponse>('/api/scraper/credits');
    return response.data.credits;
  }

  /**
   * İş durumunu sorgula
   * @param jobId - İş ID'si
   */
  async getJobStatus(jobId: number): Promise<JobStatusResponse> {
    const response = await apiClient.get<JobStatusResponse>(`/api/scraper/job/${jobId}`);
    return response.data;
  }

  /**
   * Excel download URL'ini al
   * @param jobId - İş ID'si
   */
  getDownloadUrl(jobId: number): string {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || '';
    return `${baseUrl}/api/scraper/download/${jobId}?token=${token}`;
  }

  /**
   * Excel dosyasını indir
   * @param jobId - İş ID'si
   * @param productName - Ürün ismi
   */
  async downloadExcel(jobId: number, productName: string = 'Export'): Promise<void> {
    try {
      const response = await apiClient.get(`/api/scraper/download/${jobId}`, {
        responseType: 'blob',
      });

      // Dosyayı indir
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `FGStrade_${productName}_${jobId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel indirme hatası:', error);
      throw new Error('Excel dosyası indirilemedi');
    }
  }
}

export const scraperService = new ScraperService();
