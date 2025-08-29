
import OpenAI from 'openai';
// import mongoose from "mongoose";
// import { EngagementPeriodModel, PlatformAccountModel, SentimentItemModel, SentimentWeeklyModel, SocialPostModel } from "./competior.model";

import axios from "axios";
import { SignalModel } from "./competior.model";

// export const upsertEngagement = async (competitorId: string, source: "x"|"instagram"|"linkedin", days: 30|90) => {
//   const period = days === 30 ? "L30D" : "L90D";
//   const startDate = new Date(Date.now() - days*24*60*60*1000);

//   const interactionsAgg = await SocialPostModel.aggregate([
//     { $match: { competitorId: new mongoose.Types.ObjectId(competitorId), platform: source, createdAt: { $gte: startDate } } },
//     { $group: { _id: null, total: { $sum: { $add: ["$likes","$comments","$shares","$quotes"].map(f => ({ $ifNull: [f,0] })) } } } }
//   ]);
//   const totalInteractions = interactionsAgg[0]?.total || 0;

//   const followersAgg = await PlatformAccountModel.aggregate([
//     { $match: { competitorId: new mongoose.Types.ObjectId(competitorId), platform: source, snapshotDate: { $gte: startDate } } },
//     { $group: { _id: null, avgFollowers: { $avg: "$followers" } } }
//   ]);
//   const avgFollowers = followersAgg[0]?.avgFollowers || 1;
//   const engagementRatio = totalInteractions / avgFollowers;

//   return EngagementPeriodModel.findOneAndUpdate(
//     { competitorId, source, period },
//     { competitorId, source, period, totalInteractions, avgFollowers, engagementRatio },
//     { upsert: true, new: true }
//   );
// };

// export const upsertWeeklySentiment = async (competitorId: string, source: "x"|"instagram"|"linkedin"|"glassdoor") => {
//   const items = await SentimentItemModel.aggregate([
//     { $match: { competitorId: new mongoose.Types.ObjectId(competitorId), source } },
//     { $project: { weekStart: { $dateTrunc: { date: "$createdAt", unit: "week" } }, score:1, label:1 } },
//     { $group: { _id: "$weekStart", avgScore: { $avg: "$score" }, posCount: { $sum: { $cond: [{ $eq: ["$label","positive"] },1,0] } }, negCount: { $sum: { $cond: [{ $eq: ["$label","negative"] },1,0] } }, neuCount: { $sum: { $cond: [{ $eq: ["$label","neutral"] },1,0] } } } }
//   ]);

//   for (const w of items) {
//     await SentimentWeeklyModel.findOneAndUpdate(
//       { competitorId, source, weekStart: w._id },
//       { avgScore: w.avgScore, posCount: w.posCount, negCount: w.negCount, neuCount: w.neuCount },
//       { upsert: true, new: true }
//     );
//   }
// };

// export const getNetSentimentScoreL30D = async (competitorId: string, source: "x"|"instagram"|"linkedin"|"glassdoor") => {
//   const startDate = new Date(Date.now() - 30*24*60*60*1000);
//   const agg = await SentimentItemModel.aggregate([
//     { $match: { competitorId: new mongoose.Types.ObjectId(competitorId), source, createdAt: { $gte: startDate } } },
//     { $group: { _id: null, pos: { $sum: { $cond: [{ $eq: ["$label","positive"] },1,0] } }, neg: { $sum: { $cond: [{ $eq: ["$label","negative"] },1,0] } }, total: { $sum:1 } } }
//   ]);
//   const row = agg[0];
//   return ((row?.pos||0) - (row?.neg||0)) * 100 / Math.max(row?.total||1,1);
// };

// export const getNetSentimentTrendSlope = async (competitorId: string, source: "x"|"instagram"|"linkedin"|"glassdoor") => {
//   const weekly = await SentimentWeeklyModel.find({ competitorId, source }).sort({ weekStart: -1 }).limit(8);
//   if (weekly.length < 2) return null;

//   const n = weekly.length;
//   const sumX = weekly.map((_,i)=>i+1).reduce((a,b)=>a+b,0);
//   const sumY = weekly.map(w=>w.avgScore||0).reduce((a,b)=>a+b,0);
//   const sumXY = weekly.map((w,i)=> (i+1)*(w.avgScore||0)).reduce((a,b)=>a+b,0);
//   const sumXX = weekly.map((_,i)=> (i+1)*(i+1)).reduce((a,b)=>a+b,0);

//   return (n*sumXY - sumX*sumY)/(n*sumXX - sumX*sumX);
// };

const logger = {
  error: console.error,
  info: console.log,
};

class ApolloService {
  baseURL: string;
  apiKey: string | undefined;

  constructor() {
    this.baseURL = 'https://api.apollo.io/v1'; // Corrected property name
    this.apiKey = process.env.APOLLO_API_KEY;
  }

  // Company domain diye enrichment fetch korar method
  async enrichCompany(domain: string) {
    try {
      const response = await axios.post(
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
          headquarters: org.primary_city && org.primary_state
            ? `${org.primary_city}, ${org.primary_state}`
            : null,
          techStack: org.technologies || [],
          socialProfiles: {
            linkedin: org.linkedin_url,
            twitter: org.twitter_url,
            facebook: org.facebook_url
          }
        },
        priority: 'high',
        capturedAt: new Date()
      }];
    } catch (error: any) {
      logger.error('Apollo enrichment failed:', {
        domain,
        error: error.message,
        status: error.response?.status
      });
      return [];
    }
  }

  // Helper method for company description
  formatCompanyDescription(org: any) {
    const parts = [];
    if (org.industry) parts.push(org.industry);
    if (org.estimated_num_employees) parts.push(`${org.estimated_num_employees} employees`);
    if (org.estimated_annual_revenue) parts.push(`$${org.estimated_annual_revenue} revenue`);
    return parts.join(' • ') || 'Company profile data';
  }
}

export const apolloService= new ApolloService();


class NewsService {
  apiKey: string | undefined;
  baseURL: string;

  constructor() {
    this.apiKey = process.env.GNEWS_API_KEY;
    this.baseURL = 'https://gnews.io/api/v4';
  }

  async fetchNews(companyName: string, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
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

      return response.data.articles?.map((article: any) => ({
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
      logger.error('News fetch failed:', {
        companyName,
        error: error.message,
        status: error.response?.status
      });
      return [];
    }
  }

  calculateNewsPriority(article: any) {
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

export const newsService =new NewsService()


class JobsService {
  baseURL: string;
  appId: string | undefined;
  appKey: string | undefined;

  constructor() {
    this.baseURL = 'https://api.adzuna.com/v1/api/jobs';
    this.appId = process.env.ADZUNA_APP_ID;
    this.appKey = process.env.ADZUNA_APP_KEY;
  }

  async fetchJobs(companyName: string, country = 'us', limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/${country}/search/1`, {
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

      return response.data.results?.map((job: any) => ({
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
      logger.error('Jobs fetch failed:', {
        companyName,
        error: error.message,
        status: error.response?.status
      });
      return [];
    }
  }

  formatSalary(min?: number, max?: number) {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  }

  calculateJobPriority(job: any) {
    const title = job.title.toLowerCase();
    const highPriorityRoles = ['cto', 'vp', 'director', 'head of', 'chief', 'senior director'];
    const mediumPriorityRoles = ['senior', 'lead', 'principal', 'staff', 'architect'];

    if (highPriorityRoles.some(role => title.includes(role))) return 'high';
    if (mediumPriorityRoles.some(role => title.includes(role))) return 'medium';
    return 'low';
  }
}

export const jobsService = new JobsService();

// ========================
// PatentsService
// ========================
class PatentsService {
  baseURL: string;

  constructor() {
    this.baseURL = 'https://api.patentsview.org/patents/query';
  }

  async fetchPatents(companyName: string, limit = 20) {
    try {
      const response = await axios.post(this.baseURL, {
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

      return response.data.patents?.map((patent: any) => ({
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
        priority: 'medium',
        capturedAt: new Date(patent.patent_date)
      })) || [];
    } catch (error: any) {
      logger.error('Patents fetch failed:', {
        companyName,
        error: error.message,
        status: error.response?.status
      });
      return [];
    }
  }

  formatInventors(patent: any) {
    if (!patent.inventor_name_first || !patent.inventor_name_last) return [];

    const firstNames = Array.isArray(patent.inventor_name_first) ? patent.inventor_name_first : [patent.inventor_name_first];
    const lastNames = Array.isArray(patent.inventor_name_last) ? patent.inventor_name_last : [patent.inventor_name_last];

    return firstNames.map((first:any, idx:any) => `${first} ${lastNames[idx] || lastNames[0]}`);
  }
}

export const patentsService=new PatentsService


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

class StocksService {
  private baseURL: string;
  private apiKey: string | undefined;

  constructor() {
    this.baseURL = 'https://www.alphavantage.co/query';
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  }

  async fetchStockData(ticker: string) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: ticker,
          apikey: this.apiKey
        },
        timeout: 10000
      });

      const quote: StockQuote = response.data['Global Quote'];
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
      logger.error('Stock fetch failed:', {
        ticker,
        error: error.message,
        status: error.response?.status
      });
      return [];
    }
  }

  formatStockDescription(quote: StockQuote) {
    const price = parseFloat(quote['05. price']);
    const change = parseFloat(quote['09. change']);
    const changePercent = quote['10. change percent'];
    
    return `Price: $${price.toFixed(2)} | Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent})`;
  }

  calculateStockPriority(quote: StockQuote) {
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
    
    if (Math.abs(changePercent) > 5) return 'high';
    if (Math.abs(changePercent) > 2) return 'medium';
    return 'low';
  }
}

export const  stocksService=  new StocksService();


interface SignalData {
  source: string;
  title: string;
  description?: string;
  url?: string;
  data?: Record<string, any>;
  priority?: 'high' | 'medium' | 'low';
  capturedAt: Date | string;
}

interface SignalResults {
  saved: number;
  updated: number;
  skipped: number;
  errors: { signal: string; error: string }[];
}

class SignalService {
  async saveSignals(companyId: string, signals: SignalData[]): Promise<SignalResults> {
    const results: SignalResults = {
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

        const existingSignal = await SignalModel.findOne(query);
        
        if (existingSignal) {
          if (this.hasSignalChanged(existingSignal, signalData)) {
            await SignalModel.updateOne(query, { $set: signalData });
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          await SignalModel.create({ ...signalData, companyId });
          results.saved++;
        }
      } catch (error: any) {
        results.errors.push({
          signal: signalData.title,
          error: error.message
        });
        logger.error('Error processing signal:', {
          companyId,
          signal: signalData.title,
          error: error.message
        });
      }
    }

    logger.info('Signal processing completed:', {
      companyId,
      results
    });

    return results;
  }

hasSignalChanged(existing: any, newData: SignalData) {
  const fieldsToCompare: (keyof SignalData)[] = ['title', 'description', 'data'];
  return fieldsToCompare.some(field => {
    if (field === 'data') {
      return JSON.stringify(existing[field]) !== JSON.stringify(newData[field]);
    }
    return existing[field] !== newData[field];
  });
}

  async getSignalsSummary(companyId: string) {
    try {
      const pipeline = [
        { $match: { companyId } },
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

      const summary = await SignalModel.aggregate(pipeline);

      return {
        totalSignals: summary.reduce((sum, item) => sum + item.count, 0),
        bySource: summary.reduce((acc: Record<string, any>, item) => {
          acc[item.source] = {
            count: item.count,
            latest: item.latest,
            highPriorityCount: item.highPriorityCount
          };
          return acc;
        }, {})
      };
    } catch (error: any) {
      logger.error('Failed to get signals summary:', error);
      throw error;
    }
  }
}

export const signalService= new SignalService();
interface SignalData {
  source: string;
  title: string;
  description?: string;
  capturedAt: Date | string;
  priority?: 'high' | 'medium' | 'low';
  data?: Record<string, any>;
}

interface InsightData {
  title: string;
  context: string;
  implication: string;
  urgency: 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low';
  category: 'hiring' | 'product' | 'financial' | 'strategic' | 'competitive' | 'operational';
  sources: { type: string; url: string; capturedAt: string }[];
}

type GroupedSignals = Record<string, SignalData[]>;

// class InsightService {
//   private openai: OpenAI;
//   private model: string;

//   constructor() {
//     this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     this.model = 'gpt-4-turbo-preview';
//   }

//   async generateInsights(companyId: string) {
//     const startTime = Date.now();

//     try {
//       const signals = await this.getRecentSignals(companyId);
//       if (signals.length === 0) {
//         return { insights: [], message: 'No signals available for analysis' };
//       }

//       const processedSignals = this.prepareSignalsForAnalysis(signals);
//       const aiInsights = await this.callOpenAI(processedSignals);
//       const savedInsights = await this.saveInsights(companyId, aiInsights, startTime);

//       logger.info('Insights generation completed:', {
//         companyId,
//         insightsCount: savedInsights.length,
//         signalsAnalyzed: signals.length,
//         processingTime: Date.now() - startTime
//       });

//       return {
//         insights: savedInsights,
//         metadata: {
//           signalsAnalyzed: signals.length,
//           processingTime: Date.now() - startTime,
//           model: this.model
//         }
//       };
//     } catch (error: any) {
//       logger.error('Insight generation failed:', {
//         companyId,
//         error: error.message,
//         processingTime: Date.now() - startTime
//       });
//       throw error;
//     }
//   }

//   async getRecentSignals(companyId: string, limit = 80): Promise<SignalData[]> {
//     const signals = await SignalModel.find({ companyId })
//       .sort({ capturedAt: -1, priority: -1 })
//       .limit(limit)
//       .lean();
//     return signals;
//   }

//   prepareSignalsForAnalysis(signals: SignalData[]): GroupedSignals {
//     const groupedSignals: GroupedSignals = {};
//     const sourceLimits: Record<string, number> = {
//       job_postings: 20,
//       news: 15,
//       patents: 12,
//       filings: 8,
//       stocks: 5,
//       enrichment: 3,
//       reviews: 5
//     };

//     signals.forEach(signal => {
//       if (!groupedSignals[signal.source]) groupedSignals[signal.source] = [];
//       const limit = sourceLimits[signal.source] || 10;

//       if (groupedSignals[signal.source].length < limit) {
//         groupedSignals[signal.source].push({
//           source: signal.source,
//           title: signal.title,
//           description: signal.description,
//           capturedAt: signal.capturedAt,
//           priority: signal.priority,
//           data: this.sanitizeDataForAI(signal.data)
//         });
//       }
//     });

//     return groupedSignals;
//   }

//   sanitizeDataForAI(data?: Record<string, any>): Record<string, any> | undefined {
//     if (!data || typeof data !== 'object') return data;
//     const sanitized: Record<string, any> = { ...data };
//     const fieldsToLimit = ['content', 'abstract', 'description'];

//     fieldsToLimit.forEach(field => {
//       if (sanitized[field] && typeof sanitized[field] === 'string') {
//         sanitized[field] = sanitized[field].substring(0, 200);
//       }
//     });

//     return sanitized;
//   }

//   async callOpenAI(signals: GroupedSignals): Promise<{ insights: InsightData[] }> {
//     const prompt = this.buildAnalysisPrompt(signals);

//     const completion = await this.openai.chat.completions.create({
//       model: this.model,
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an expert business intelligence analyst specializing in competitive intelligence. Analyze signals and generate strategic insights that are actionable, specific, and prioritized by business impact.'
//         },
//         { role: 'user', content: prompt }
//       ],
//       temperature: 0.1,
//       max_tokens: 2000,
//       response_format: { type: 'json_object' }
//     });

//     const response: string = completion.choices[0].message.content;
//     try {
//       return JSON.parse(response);
//     } catch (err) {
//       logger.error('Failed to parse OpenAI response', { error: err });
//       return { insights: [] };
//     }
//   }

//   buildAnalysisPrompt(signals: GroupedSignals): string {
//     return `Analyze the following competitive intelligence signals and generate strategic insights.

// SIGNALS DATA:
// ${JSON.stringify(signals, null, 2)}

// ANALYSIS REQUIREMENTS:
// 1. Identify patterns, trends, and strategic implications
// 2. Focus on competitive threats, opportunities, and market movements
// 3. Prioritize insights by business urgency and confidence level
// 4. Consider timing, market context, and competitive positioning

// OUTPUT FORMAT (JSON):
// {
//   "insights": [
//     {
//       "title": "Clear, actionable insight title (max 100 chars)",
//       "context": "What is happening - factual observation (max 300 chars)",
//       "implication": "Strategic meaning and business impact (max 300 chars)",
//       "urgency": "high|medium|low",
//       "confidence": "high|medium|low",
//       "category": "hiring|product|financial|strategic|competitive|operational",
//       "sources": [{"type": "source_type", "url": "source_url", "capturedAt": "ISO_date"}]
//     }
//   ]
// }

// Generate 3-6 insights maximum, prioritizing quality over quantity.`;
//   }

//   async saveInsights(companyId: string, aiResponse: { insights: InsightData[] }, startTime: number) {
//     const insights = aiResponse.insights || [];
//     const savedInsights: typeof Insight[] = [];

//     for (const insight of insights) {
//       try {
//         const insightDoc = new Insight({
//           companyId,
//           ...insight,
//           aiModel: this.model,
//           processingTime: Date.now() - startTime
//         });

//         const saved = await insightDoc.save();
//         savedInsights.push(saved);
//       } catch (error: any) {
//         logger.error('Failed to save insight:', {
//           companyId,
//           insight: insight.title,
//           error: error.message
//         });
//       }
//     }

//     return savedInsights;
//   }

//   async getInsightsTrends(companyId: string, days = 30) {
//     const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

//     const trends = await Insight.aggregate([
//       {
//         $match: {
//           companyId,
//           createdAt: { $gte: startDate },
//           isArchived: false
//         }
//       },
//       {
//         $group: {
//           _id: { category: '$category', urgency: '$urgency' },
//           count: { $sum: 1 },
//           avgConfidence: {
//             $avg: {
//               $switch: {
//                 branches: [
//                   { case: { $eq: ['$confidence', 'high'] }, then: 3 },
//                   { case: { $eq: ['$confidence', 'medium'] }, then: 2 },
//                   { case: { $eq: ['$confidence', 'low'] }, then: 1 }
//                 ],
//                 default: 2
//               }
//             }
//           }
//         }
//       }
//     ]);

//     return trends;
//   }
// }

// export default new InsightService();