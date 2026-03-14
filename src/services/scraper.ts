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
  remainingCredits?: number; // Backend'den dönen güncel kredi bilgisi
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

// Kullanıcının geçmiş aramaları için tip
export interface UserJob {
  jobId: number;
  category: string;
  city: string;
  country: string;
  language: string;
  status: string;
  totalResults: number;
  creditsUsed: number;
  createdAt: string;
  completedAt: string | null;
}

export interface UserJobsCountResponse {
  total: number;
  completed: number;
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
   * @param country - Ülke
   * @param city - Şehir
   */
  async downloadExcel(jobId: number, productName: string = 'Export', country: string = '', city: string = ''): Promise<void> {
    try {
      const response = await apiClient.get(`/api/scraper/download/${jobId}`, {
        responseType: 'blob',
      });

      // Dosya adı oluştur: FGStrade_UrunIsmi_Ulke_Sehir_jobId.xlsx
      const sanitize = (str: string) => str.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_çğıöşüÇĞİÖŞÜ]/g, '');
      const parts = ['FGStrade', sanitize(productName)];
      if (country) parts.push(sanitize(country));
      if (city) parts.push(sanitize(city));
      parts.push(jobId.toString());
      const fileName = `${parts.join('_')}.xlsx`;

      // Dosyayı indir
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Excel dosyası indirilemedi');
    }
  }

  /**
   * Kullanıcının geçmiş aramalarını getir
   * @param page - Sayfa numarası
   * @param pageSize - Sayfa başına kayıt sayısı
   */
  async getMyJobs(page: number = 1, pageSize: number = 20): Promise<UserJob[]> {
    const response = await apiClient.get<UserJob[]>(`/api/scraper/my-jobs?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  /**
   * Kullanıcının toplam arama sayısını getir
   */
  async getMyJobsCount(): Promise<UserJobsCountResponse> {
    const response = await apiClient.get<UserJobsCountResponse>('/api/scraper/my-jobs/count');
    return response.data;
  }

  /**
   * Geçmiş aramadan Excel indir
   * @param job - Geçmiş arama bilgisi
   */
  async downloadExcelFromJob(job: UserJob): Promise<void> {
    return this.downloadExcel(job.jobId, job.category, job.country, job.city);
  }
}

export const scraperService = new ScraperService();
