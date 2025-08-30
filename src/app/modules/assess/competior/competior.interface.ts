// src/types/index.ts

export interface Signal {
  _id?: string;
  companyId: string;
  source: string;
  title: string;
  description: string;
  url: string;
  data: Record<string, any>;
  priority: 'high' | 'medium' | 'low';
  capturedAt: Date;
}

export interface Insight {
  _id?: string;
  companyId: string;
  title: string;
  context: string;
  implication: string;
  urgency: 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low';
  category: 'hiring' | 'product' | 'financial' | 'strategic' | 'competitive' | 'operational';
  sources: Array<{
    type: string;
    url: string;
    capturedAt: string;
  }>;
  aiModel?: string;
  processingTime?: number;
  createdAt?: Date;
  isArchived?: boolean;
}

export interface Company {
  _id: string;
  name: string;
  domain?: string;
  ticker?: string;
  industry?: string;
  isActive?: boolean;
  signalCount?: number;
  updateLastFetched?: () => Promise<void>;
}

export interface SignalSummary {
  totalSignals: number;
  bySource: Record<string, {
    count: number;
    latest: Date;
    highPriorityCount: number;
  }>;
}

export interface EnrichmentResult {
  success: boolean;
  results: Array<{
    source: string;
    saved: number;
    updated: number;
    skipped: number;
    errors: Array<{
      signal: string;
      error: string;
    }>;
  }>;
  timestamp: Date;
  error?: string;
}

export interface CompetitiveIntelligenceResult {
  success: boolean;
  insights: Insight[];
  signalsSummary: SignalSummary;
  metadata: {
    signalsAnalyzed: number;
    processingTime: number;
    model: string;
  };
  error?: string;
}

interface ServiceContainer {
  apolloService: {
    enrichCompany: (domain: string) => Promise<any[]>;
  };
  stocksService: {
    fetchStockData: (ticker: string) => Promise<any[]>;
  };
  newsService: {
    fetchNews: (companyName: string, limit: number) => Promise<any[]>;
  };
  jobsService: {
    fetchJobs: (companyName: string, location: string, limit: number) => Promise<any[]>;
  };
  patentsService: {
    fetchPatents: (companyName: string, limit: number) => Promise<any[]>;
  };
  signalService: {
    saveSignals: (companyId: string, signals: any[]) => Promise<any>;
    getSignalsSummary: (companyId: string) => Promise<any>;
  };
  insightService: {
    generateInsights: (companyId: string) => Promise<{ insights: any[]; metadata: any }>;
    getInsightsTrends: (companyId: string) => Promise<any[]>;
  };
}

export class CompetitorAnalysisInterface {
  private services: ServiceContainer;

  constructor(services: ServiceContainer) {
    this.services = services;
  }

  async enrichCompanyProfile(companyId: string, company: any) {
    const results: any[] = [];

    try {
      if (company.domain) {
        const enrichmentData = await this.services.apolloService.enrichCompany(company.domain);
        if (enrichmentData.length > 0) {
          const saveResult = await this.services.signalService.saveSignals(companyId, enrichmentData);
          results.push({ source: 'apollo', ...saveResult });
        }
      }

      if (company.ticker) {
        const stockData = await this.services.stocksService.fetchStockData(company.ticker);
        if (stockData.length > 0) {
          const saveResult = await this.services.signalService.saveSignals(companyId, stockData);
          results.push({ source: 'stocks', ...saveResult });
        }
      }

      return {
        success: true,
        results,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        results
      };
    }
  }

  async fetchMarketSignals(companyId: string, company: any) {
    const results: any[] = [];
    try {
      const fetchPromises: Promise<{ source: string; data: any[] }>[] = [];

      if (company.name) {
        fetchPromises.push(
          this.services.newsService.fetchNews(company.name, 15).then(data => ({ source: 'news', data }))
        );
        fetchPromises.push(
          this.services.jobsService.fetchJobs(company.name, 'us', 30).then(data => ({ source: 'jobs', data }))
        );
        fetchPromises.push(
          this.services.patentsService.fetchPatents(company.name, 10).then(data => ({ source: 'patents', data }))
        );
      }

      const fetchResults = await Promise.allSettled(fetchPromises);

      for (const result of fetchResults) {
        if (result.status === 'fulfilled' && result.value.data.length > 0) {
          const saveResult = await this.services.signalService.saveSignals(companyId, result.value.data);
          results.push({ source: result.value.source, ...saveResult });
        }
      }

      return { success: true, results, timestamp: new Date() };
    } catch (error: any) {
      return { success: false, error: error.message, results };
    }
  }

  async generateCompetitiveIntelligence(companyId: string) {
    try {
      const insights = await this.services.insightService.generateInsights(companyId);
      const summary = await this.services.signalService.getSignalsSummary(companyId);

      return {
        success: true,
        insights: insights.insights,
        signalsSummary: summary,
        metadata: insights.metadata
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getCompetitiveMetrics(companyIds: string[]) {
    const metrics = await Promise.all(
      companyIds.map(async (companyId) => {
        const summary = await this.services.signalService.getSignalsSummary(companyId);
        const insights = await this.services.insightService.getInsightsTrends(companyId);
        return { companyId, signalsSummary: summary, insightsTrends: insights };
      })
    );

    return metrics;
  }
}