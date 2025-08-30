// services.ts - All Services in One File
// ================================
import OpenAI from "openai";

import axios, { AxiosResponse } from 'axios';
import mongoose from 'mongoose';
import { SignalData, ProcessingResult, SignalsSummary, InsightGeneration, CompetitiveMetric, ICompany, IInsight } from './types';
import { Insight, Signal } from './models';


// Apollo Service
interface ApolloOrganization {
  name?: string;
  industry?: string;
  estimated_num_employees?: number;
  estimated_annual_revenue?: string;
  founded_year?: number;
  primary_city?: string;
  primary_state?: string;
  technologies?: string[];
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
}

interface ApolloResponse {
  organization?: ApolloOrganization;
}

class ApolloService {
  private readonly baseURL = 'https://api.apollo.io/v1';
  private readonly apiKey = process.env.APOLLO_API_KEY;

  async enrichCompany(domain: string): Promise<SignalData[]> {
    try {
      const response: AxiosResponse<ApolloResponse> = await axios.post(
        `${this.baseURL}/organizations/enrich`,
        { domain },
        { 
          headers: { 
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      const org = response.data.organization || {};
      
      return [{
        source: 'enrichment',
        title: org.name || 'Company Profile',
        description: this.formatCompanyDescription(org),
        url: org.linkedin_url || `https://${domain}`,
        data: {
          industry: org.industry,
          employeeCount: org.estimated_num_employees,
          revenue: org.estimated_annual_revenue,
          founded: org.founded_year,
          headquarters: org.primary_city && org.primary_state ? 
            `${org.primary_city}, ${org.primary_state}` : null,
          techStack: org.technologies || [],
          socialProfiles: {
            linkedin: org.linkedin_url,
            twitter: org.twitter_url,
            facebook: org.facebook_url
          }
        },
        priority: 'high' as const,
        capturedAt: new Date()
      }];
    } catch (error: any) {
      console.error('Apollo enrichment failed:', error.message);
      return [];
    }
  }

  private formatCompanyDescription(org: ApolloOrganization): string {
    const parts: string[] = [];
    if (org.industry) parts.push(org.industry);
    if (org.estimated_num_employees) parts.push(`${org.estimated_num_employees} employees`);
    if (org.estimated_annual_revenue) parts.push(`$${org.estimated_annual_revenue} revenue`);
    return parts.join(' • ') || 'Company profile data';
  }
}

export const apolloService = new ApolloService();

// News Service
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source?: {
    name: string;
    url: string;
  };
  image?: string;
  content?: string;
}

interface NewsResponse {
  articles?: NewsArticle[];
}

class NewsService {
  private readonly apiKey = process.env.GNEWS_API_KEY;
  private readonly baseURL = 'https://gnews.io/api/v4';

  async fetchNews(companyName: string, limit: number = 10): Promise<SignalData[]> {
    try {
      const response: AxiosResponse<NewsResponse> = await axios.get(`${this.baseURL}/search`, {
        params: {
          q: `"${companyName}"`,
          token: this.apiKey,
          lang: 'en',
          country: 'us',
          max: Math.min(limit, 50),
          sortby: 'publishedAt',
          in: 'title,description'
        },
        timeout: 15000
      });

      return response.data.articles?.map(article => ({
        source: 'news',
        title: article.title,
        description: article.description,
        url: article.url,
        data: {
          publishedAt: article.publishedAt,
          sourceName: article.source?.name,
          sourceUrl: article.source?.url,
          image: article.image,
          content: article.content
        },
        priority: this.calculateNewsPriority(article),
        capturedAt: new Date(article.publishedAt)
      })) || [];
    } catch (error: any) {
      console.error('News fetch failed:', error.message);
      return [];
    }
  }

  private calculateNewsPriority(article: NewsArticle): 'low' | 'medium' | 'high' {
    const title = article.title.toLowerCase();
    const highPriorityKeywords = ['acquisition', 'merger', 'funding', 'ipo', 'ceo', 'layoffs'];
    const mediumPriorityKeywords = ['partnership', 'product', 'launch', 'expansion'];
    
    if (highPriorityKeywords.some(keyword => title.includes(keyword))) {
      return 'high';
    }
    if (mediumPriorityKeywords.some(keyword => title.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }
}

export const newsService = new NewsService();

// Jobs Service
interface JobPosting {
  title: string;
  description?: string;
  redirect_url: string;
  location?: {
    display_name: string;
  };
  company?: {
    display_name: string;
  };
  salary_min?: number;
  salary_max?: number;
  category?: {
    label: string;
  };
  contract_type?: string;
  created: string;
}

interface JobsResponse {
  results?: JobPosting[];
}

class JobsService {
  private readonly baseURL = 'https://api.adzuna.com/v1/api/jobs';
  private readonly appId = process.env.ADZUNA_APP_ID;
  private readonly appKey = process.env.ADZUNA_APP_KEY;

  async fetchJobs(companyName: string, country: string = 'us', limit: number = 50): Promise<SignalData[]> {
    try {
      const response: AxiosResponse<JobsResponse> = await axios.get(`${this.baseURL}/${country}/search/1`, {
        params: {
          app_id: this.appId,
          app_key: this.appKey,
          what: `"${companyName}"`,
          results_per_page: Math.min(limit, 50),
          sort_by: 'date',
          content_type: 'application/json'
        },
        timeout: 15000
      });

      return response.data.results?.map(job => ({
        source: 'job_postings',
        title: job.title,
        description: job.description?.substring(0, 500),
        url: job.redirect_url,
        data: {
          location: job.location?.display_name,
          company: job.company?.display_name,
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,
          salaryFormatted: this.formatSalary(job.salary_min, job.salary_max),
          category: job.category?.label,
          contractType: job.contract_type,
          postedDate: job.created
        },
        priority: this.calculateJobPriority(job),
        capturedAt: new Date(job.created)
      })) || [];
    } catch (error: any) {
      console.error('Jobs fetch failed:', error.message);
      return [];
    }
  }

  private formatSalary(min?: number, max?: number): string | null {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  }

  private calculateJobPriority(job: JobPosting): 'low' | 'medium' | 'high' {
    const title = job.title.toLowerCase();
    const highPriorityRoles = ['cto', 'vp', 'director', 'head of', 'chief', 'senior director'];
    const mediumPriorityRoles = ['senior', 'lead', 'principal', 'staff', 'architect'];
    
    if (highPriorityRoles.some(role => title.includes(role))) {
      return 'high';
    }
    if (mediumPriorityRoles.some(role => title.includes(role))) {
      return 'medium';
    }
    return 'low';
  }
}

export const jobsService = new JobsService();

// Patents Service
interface Patent {
  patent_number: string;
  patent_title: string;
  patent_date: string;
  assignee_organization?: string;
  inventor_name_first?: string | string[];
  inventor_name_last?: string | string[];
  patent_abstract?: string;
}

interface PatentsResponse {
  patents?: Patent[];
}

class PatentsService {
  private readonly baseURL = 'https://api.patentsview.org/patents/query';

  async fetchPatents(companyName: string, limit: number = 20): Promise<SignalData[]> {
    try {
      const response: AxiosResponse<PatentsResponse> = await axios.post(this.baseURL, {
        q: {
          "_and": [
            { "_text_all": { "assignee_organization": companyName } },
            { "_gte": { "patent_date": "2022-01-01" } }
          ]
        },
        f: [
          "patent_number", 
          "patent_title", 
          "patent_date", 
          "assignee_organization",
          "inventor_name_first",
          "inventor_name_last",
          "patent_abstract"
        ],
        o: { 
          "per_page": Math.min(limit, 25), 
          "matched_subentities_only": true 
        }
      }, {
        timeout: 20000,
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data.patents?.map(patent => ({
        source: 'patents',
        title: patent.patent_title,
        description: patent.patent_abstract?.substring(0, 300),
        url: `https://patents.uspto.gov/patent/documents/${patent.patent_number}`,
        data: {
          patentNumber: patent.patent_number,
          assignee: patent.assignee_organization,
          inventors: this.formatInventors(patent),
          filingDate: patent.patent_date,
          abstract: patent.patent_abstract
        },
        priority: 'medium' as const,
        capturedAt: new Date(patent.patent_date)
      })) || [];
    } catch (error: any) {
      console.error('Patents fetch failed:', error.message);
      return [];
    }
  }

  private formatInventors(patent: Patent): string[] {
    if (!patent.inventor_name_first || !patent.inventor_name_last) return [];
    
    const firstNames = Array.isArray(patent.inventor_name_first) ? 
      patent.inventor_name_first : [patent.inventor_name_first];
    const lastNames = Array.isArray(patent.inventor_name_last) ? 
      patent.inventor_name_last : [patent.inventor_name_last];
    
    return firstNames.map((first, idx) => 
      `${first} ${lastNames[idx] || lastNames[0]}`
    );
  }
}

export const patentsService = new PatentsService();

// Stocks Service
interface StockQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

interface StockResponse {
  'Global Quote': StockQuote;
}

class StocksService {
  private readonly baseURL = 'https://www.alphavantage.co/query';
  private readonly apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  async fetchStockData(ticker: string): Promise<SignalData[]> {
    try {
      const response: AxiosResponse<StockResponse> = await axios.get(this.baseURL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: ticker,
          apikey: this.apiKey
        },
        timeout: 10000
      });

      const quote = response.data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error('No stock data available');
      }

      return [{
        source: 'stocks',
        title: `${ticker} Stock Quote`,
        description: this.formatStockDescription(quote),
        url: `https://finance.yahoo.com/quote/${ticker}`,
        data: {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: quote['10. change percent'],
          volume: parseInt(quote['06. volume']),
          previousClose: parseFloat(quote['08. previous close']),
          open: parseFloat(quote['02. open']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          latestTradingDay: quote['07. latest trading day']
        },
        priority: this.calculateStockPriority(quote),
        capturedAt: new Date()
      }];
    } catch (error: any) {
      console.error('Stock fetch failed:', error.message);
      return [];
    }
  }

  private formatStockDescription(quote: StockQuote): string {
    const price = parseFloat(quote['05. price']);
    const change = parseFloat(quote['09. change']);
    const changePercent = quote['10. change percent'];
    
    return `Price: $${price.toFixed(2)} | Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent})`;
  }

  private calculateStockPriority(quote: StockQuote): 'low' | 'medium' | 'high' {
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
    
    if (Math.abs(changePercent) > 5) return 'high';
    if (Math.abs(changePercent) > 2) return 'medium';
    return 'low';
  }
}

export const stocksService = new StocksService();

// Signal Processing Service
class SignalService {
  async saveSignals(companyId: string, signals: SignalData[]): Promise<ProcessingResult> {
    const results: ProcessingResult = {
      saved: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    for (const signalData of signals) {
      try {
        const query = {
          companyId,
          source: signalData.source,
          url: signalData.url || `${signalData.source}:${signalData.title}:${signalData.capturedAt}`
        };

        const existingSignal = await Signal.findOne(query);
        
        if (existingSignal) {
          if (this.hasSignalChanged(existingSignal, signalData)) {
            await Signal.updateOne(query, { $set: signalData });
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          await Signal.create({ ...signalData, companyId });
          results.saved++;
        }
      } catch (error: any) {
        results.errors.push({
          signal: signalData.title,
          error: error.message
        });
        console.error('Error processing signal:', error.message);
      }
    }

    console.log('Signal processing completed:', { companyId, results });
    return results;
  }

private hasSignalChanged(existing: SignalData, newData: SignalData): boolean {
  const fieldsToCompare: (keyof SignalData)[] = ['title', 'description', 'data'];

  return fieldsToCompare.some((field) => {
    if (field === 'data') {
      return JSON.stringify(existing.data) !== JSON.stringify(newData.data);
    }
    return existing[field] !== newData[field];
  });
}

  async getSignalsSummary(companyId: string): Promise<SignalsSummary> {
    try {
      const pipeline = [
        { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
            latest: { $max: '$capturedAt' },
            priorities: { $push: '$priority' }
          }
        },
        {
          $project: {
            source: '$_id',
            count: 1,
            latest: 1,
            highPriorityCount: {
              $size: {
                $filter: {
                  input: '$priorities',
                  cond: { $eq: ['$$this', 'high'] }
                }
              }
            }
          }
        }
      ];

      const summary = await Signal.aggregate(pipeline);
      
      return {
        totalSignals: summary.reduce((sum, item) => sum + item.count, 0),
        bySource: summary.reduce((acc, item) => {
          acc[item.source] = {
            count: item.count,
            latest: item.latest,
            highPriorityCount: item.highPriorityCount
          };
          return acc;
        }, {} as Record<string, any>)
      };
    } catch (error: any) {
      console.error('Failed to get signals summary:', error);
      throw error;
    }
  }
}

export const signalService = new SignalService();

// AI Insights Service
interface AIInsightResponse {
  insights: Array<{
    title: string;
    context: string;
    implication: string;
    urgency: 'low' | 'medium' | 'high';
    confidence: 'low' | 'medium' | 'high';
    category: 'hiring' | 'product' | 'financial' | 'strategic' | 'competitive' | 'operational';
    sources: Array<{
      type: string;
      url?: string;
      capturedAt?: string;
    }>;
  }>;
}

class InsightService {
  private readonly openai: OpenAI;
  private readonly model = 'gpt-4-turbo-preview';

  constructor() {
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
  }

  async generateInsights(companyId: string): Promise<InsightGeneration> {
    const startTime = Date.now();
    
    try {
      const signals = await this.getRecentSignals(companyId);
      
      if (signals.length === 0) {
        return { insights: [], message: 'No signals available for analysis' };
      }

      const processedSignals = this.prepareSignalsForAnalysis(signals);
      const aiInsights = await this.callOpenAI(processedSignals);
      const savedInsights = await this.saveInsights(companyId, aiInsights, startTime);
      
      console.log('Insights generation completed:', {
        companyId,
        insightsCount: savedInsights.length,
        signalsAnalyzed: signals.length,
        processingTime: Date.now() - startTime
      });

      return {
        insights: savedInsights,
        metadata: {
          signalsAnalyzed: signals.length,
          processingTime: Date.now() - startTime,
          model: this.model
        }
      };
    } catch (error: any) {
      console.error('Insight generation failed:', error.message);
      return { insights: [], error: error.message };
    }
  }

  private async getRecentSignals(companyId: string, limit: number = 80): Promise<any[]> {
    return await Signal.find({ companyId })
      .sort({ capturedAt: -1, priority: -1 })
      .limit(limit)
      .lean();
  }

  private prepareSignalsForAnalysis(signals: any[]): Record<string, any[]> {
    const groupedSignals: Record<string, any[]> = {};
    const sourceLimits: Record<string, number> = {
      job_postings: 20,
      news: 15,
      patents: 12,
      filings: 8,
      stocks: 5,
      enrichment: 3,
      reviews: 5
    };

    signals.forEach(signal => {
      if (!groupedSignals[signal.source]) {
        groupedSignals[signal.source] = [];
      }
      
      const limit = sourceLimits[signal.source] || 10;
      if (groupedSignals[signal.source].length < limit) {
        groupedSignals[signal.source].push({
          source: signal.source,
          title: signal.title,
          description: signal.description,
          capturedAt: signal.capturedAt,
          priority: signal.priority,
          data: this.sanitizeDataForAI(signal.data)
        });
      }
    });

    return groupedSignals;
  }

  private sanitizeDataForAI(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sanitized = { ...data };
    const fieldsToLimit = ['content', 'abstract', 'description'];
    
    fieldsToLimit.forEach(field => {
      if (sanitized[field] && typeof sanitized[field] === 'string') {
        sanitized[field] = sanitized[field].substring(0, 200);
      }
    });
    
    return sanitized;
  }

  private async callOpenAI(signals: Record<string, any[]>): Promise<AIInsightResponse> {
    const prompt = `Analyze the following competitive intelligence signals and generate strategic insights.

SIGNALS DATA:
${JSON.stringify(signals, null, 2)}

ANALYSIS REQUIREMENTS:
1. Identify patterns, trends, and strategic implications
2. Focus on competitive threats, opportunities, and market movements
3. Prioritize insights by business urgency and confidence level
4. Consider timing, market context, and competitive positioning

OUTPUT FORMAT (JSON):
{
  "insights": [
    {
      "title": "Clear, actionable insight title (max 100 chars)",
      "context": "What is happening - factual observation (max 300 chars)",
      "implication": "Strategic meaning and business impact (max 300 chars)",
      "urgency": "high|medium|low",
      "confidence": "high|medium|low",
      "category": "hiring|product|financial|strategic|competitive|operational",
      "sources": [{"type": "source_type", "url": "source_url", "capturedAt": "ISO_date"}]
    }
  ]
}

URGENCY LEVELS:
- HIGH: Immediate competitive threat or time-sensitive opportunity
- MEDIUM: Important trend requiring attention within weeks
- LOW: General market movement for awareness

CONFIDENCE LEVELS:
- HIGH: Multiple independent sources, clear pattern
- MEDIUM: Single strong source or emerging pattern
- LOW: Weak signals, requires validation

Generate 3-6 insights maximum, prioritizing quality over quantity.`;

    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert business intelligence analyst specializing in competitive intelligence. Analyze signals and generate strategic insights that are actionable, specific, and prioritized by business impact.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response!) as AIInsightResponse;
  }

  private async saveInsights(companyId: string, aiResponse: AIInsightResponse, startTime: number): Promise<IInsight[]> {
    const insights = aiResponse.insights || [];
    const savedInsights: IInsight[] = [];
    
    for (const insight of insights) {
      try {
        const insightDoc = new Insight({
          companyId,
          ...insight,
          aiModel: this.model,
          processingTime: Date.now() - startTime
        });
        
        const saved = await insightDoc.save();
        savedInsights.push(saved);
      } catch (error: any) {
        console.error('Failed to save insight:', error.message);
      }
    }
    
    return savedInsights;
  }

  async getInsightsTrends(companyId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return await Insight.aggregate([
      { 
        $match: { 
          companyId: new mongoose.Types.ObjectId(companyId),
          createdAt: { $gte: startDate },
          isArchived: false
        }
      },
      {
        $group: {
          _id: {
            category: '$category',
            urgency: '$urgency'
          },
          count: { $sum: 1 },
          avgConfidence: {
            $avg: {
              $switch: {
                branches: [
                  { case: { $eq: ['$confidence', 'high'] }, then: 3 },
                  { case: { $eq: ['$confidence', 'medium'] }, then: 2 },
                  { case: { $eq: ['$confidence', 'low'] }, then: 1 }
                ],
                default: 2
              }
            }
          }
        }
      }
    ]);
  }
}

export const insightService = new InsightService();

// Business Logic Interface
interface BusinessResult {
  success: boolean;
  results?: any[];
  timestamp?: Date;
  error?: string;
}

interface IntelligenceResult {
  success: boolean;
  insights?: IInsight[];
  signalsSummary?: SignalsSummary;
  metadata?: any;
  error?: string;
}

class CompetitorInterface {
  async enrichCompanyProfile(companyId: string, company: ICompany): Promise<BusinessResult> {
    const results: any[] = [];
    
    try {
      if (company.domain) {
        const enrichmentData = await apolloService.enrichCompany(company.domain);
        if (enrichmentData.length > 0) {
          const saveResult = await signalService.saveSignals(companyId, enrichmentData);
          results.push({ source: 'apollo', ...saveResult });
        }
      }

      if (company.ticker) {
        const stockData = await stocksService.fetchStockData(company.ticker);
        if (stockData.length > 0) {
          const saveResult = await signalService.saveSignals(companyId, stockData);
          results.push({ source: 'stocks', ...saveResult });
        }
      }

      return { success: true, results, timestamp: new Date() };
    } catch (error: any) {
      return { success: false, error: error.message, results };
    }
  }

  async fetchMarketSignals(companyId: string, company: ICompany): Promise<BusinessResult> {
    const results: any[] = [];
    
    try {
      const fetchPromises: Promise<{source: string; data: SignalData[]}>[] = [];

      if (company.name) {
        fetchPromises.push(
          newsService.fetchNews(company.name, 15).then(data => ({ source: 'news', data }))
        );
        
        fetchPromises.push(
          jobsService.fetchJobs(company.name, 'us', 30).then(data => ({ source: 'jobs', data }))
        );
        
        fetchPromises.push(
          patentsService.fetchPatents(company.name, 10).then(data => ({ source: 'patents', data }))
        );
      }

      const fetchResults = await Promise.allSettled(fetchPromises);
      
      for (const result of fetchResults) {
        if (result.status === 'fulfilled' && result.value.data.length > 0) {
          const saveResult = await signalService.saveSignals(companyId, result.value.data);
          results.push({ source: result.value.source, ...saveResult });
        }
      }

      return { success: true, results, timestamp: new Date() };
    } catch (error: any) {
      return { success: false, error: error.message, results };
    }
  }

  async generateCompetitiveIntelligence(companyId: string): Promise<IntelligenceResult> {
    try {
      const insights = await insightService.generateInsights(companyId);
      const summary = await signalService.getSignalsSummary(companyId);
      
      return {
        success: true,
        insights: insights.insights,
        signalsSummary: summary,
        metadata: insights.metadata
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCompetitiveMetrics(companyIds: string[]): Promise<CompetitiveMetric[]> {
    const metrics = await Promise.all(companyIds.map(async (companyId) => {
      const summary = await signalService.getSignalsSummary(companyId);
      const insights = await insightService.getInsightsTrends(companyId);
      
      return {
        companyId,
        signalsSummary: summary,
        insightsTrends: insights
      };
    }));

    return metrics;
  }
}

export const competitorInterface = new CompetitorInterface();