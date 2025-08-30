// controllers.ts - All Controllers & Routes in One File
// ================================

import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Company, Insight, Signal } from './models';
import { competitorInterface, signalService } from './services';
import { CompetitiveMetric } from './types';

// Request interfaces
interface CompanyQuery {
  page?: string;
  limit?: string;
  search?: string;
  industry?: string;
}

interface SignalQuery {
  source?: string;
  limit?: string;
  page?: string;
}

interface InsightQuery {
  limit?: string;
  urgency?: string;
  category?: string;
}

interface CompareQuery {
  ids?: string;
}

interface FetchBody {
  sources?: string[];
}

// Controllers
class CompetitorController {
  async getCompanies(req: Request<{}, {}, {}, CompanyQuery>, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '20', search, industry } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      let query: any = { isActive: true };
      
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { domain: new RegExp(search, 'i') },
          { ticker: new RegExp(search, 'i') }
        ];
      }
      
      if (industry) {
        query.industry = industry;
      }

      const companies = await Company.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: 1 });

      const total = await Company.countDocuments(query);

      res.json({
        companies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error: any) {
      console.error('Get companies failed:', error);
      res.status(500).json({ 
        error: 'Failed to fetch companies',
        message: error.message 
      });
    }
  }

  async createCompany(req: Request, res: Response): Promise<void> {
    try {
      const companyData = req.body;
      const company = await Company.create(companyData);
      
      // Trigger initial data fetch
      const enrichResult = await competitorInterface.enrichCompanyProfile(
        company?._id as string, 
        company
      );
      
      console.log('Company created:', {
        companyId: company._id,
        name: company.name,
        enrichmentResult: enrichResult.success
      });

      res.status(201).json({ 
        company,
        enrichment: enrichResult
      });
    } catch (error: any) {
      console.error('Create company failed:', error);
      res.status(500).json({ 
        error: 'Failed to create company',
        message: error.message 
      });
    }
  }

  async getCompany(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const company = await Company.findById(id);
      if (!company) {
        res.status(404).json({ error: 'Company not found' });
        return;
      }

      const signalsSummary = await signalService.getSignalsSummary(id);
      
      res.json({
        company,
        signalsSummary
      });
    } catch (error: any) {
      console.error('Get company failed:', error);
      res.status(500).json({ 
        error: 'Failed to fetch company',
        message: error.message 
      });
    }
  }

  async getCompanySignals(req: Request<{ id: string }, {}, {}, SignalQuery>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { source, limit = '50', page = '1' } = req.query;
      
      let query: any = { companyId: id };
      if (source) {
        query.source = source;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const signals = await Signal.find(query)
        .sort({ capturedAt: -1, priority: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Group by source
      const grouped: Record<string, any[]> = {};
      const freshness: Record<string, Date> = {};
      
      for (const signal of signals) {
        if (!grouped[signal.source]) {
          grouped[signal.source] = [];
        }
        grouped[signal.source].push(signal);
        
        if (!freshness[signal.source] || signal.capturedAt > freshness[signal.source]) {
          freshness[signal.source] = signal.capturedAt;
        }
      }

      res.json({
        competitorId: id,
        signals: grouped,
        freshness,
        totalSignals: signals.length
      });
    } catch (error: any) {
      console.error('Get company signals failed:', error);
      res.status(500).json({ 
        error: 'Failed to fetch signals',
        message: error.message 
      });
    }
  }

  async getCompanyInsights(req: Request<{ id: string }, {}, {}, InsightQuery>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { limit = '10', urgency, category } = req.query;
      
      let query: any = { companyId: id, isArchived: false };
      
      if (urgency) {
        query.urgency = urgency;
      }
      
      if (category) {
        query.category = category;
      }

      const insights = await Insight.find(query)
        .sort({ urgency: -1, createdAt: -1 })
        .limit(parseInt(limit));

      res.json({
        competitorId: id,
        insights,
        count: insights.length
      });
    } catch (error: any) {
      console.error('Get company insights failed:', error);
      res.status(500).json({ 
        error: 'Failed to fetch insights',
        message: error.message 
      });
    }
  }

  async generateInsights(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await competitorInterface.generateCompetitiveIntelligence(id);
      
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('Generate insights failed:', error);
      res.status(500).json({ 
        error: 'Failed to generate insights',
        message: error.message 
      });
    }
  }

  async fetchCompanyData(req: Request<{ id: string }, {}, FetchBody>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { sources } = req.body;
      
      const company = await Company.findById(id);
      if (!company) {
        res.status(404).json({ error: 'Company not found' });
        return;
      }

      let results: any = {};
      
      // Fetch based on requested sources or all
      if (!sources || sources.includes('profile')) {
        const profileResult = await competitorInterface.enrichCompanyProfile(id, company);
        results.profile = profileResult;
      }
      
      if (!sources || sources.includes('market')) {
        const marketResult = await competitorInterface.fetchMarketSignals(id, company);
        results.market = marketResult;
      }

      // Update company metadata
      await company.updateLastFetched();

      res.json({
        message: 'Data fetch completed',
        results,
        timestamp: new Date()
      });
    } catch (error: any) {
      console.error('Fetch company data failed:', error);
      res.status(500).json({ 
        error: 'Failed to fetch data',
        message: error.message 
      });
    }
  }

  async compareCompetitors(req: Request<{}, {}, {}, CompareQuery>, res: Response): Promise<void> {
    try {
      const { ids } = req.query;
      
      if (!ids) {
        res.status(400).json({ error: 'Missing company IDs' });
        return;
      }

      const companyIds = ids.split(',').slice(0, 5); // Limit to 5 companies
      
      const metrics = await competitorInterface.getCompetitiveMetrics(companyIds);
      
      // Build comparison matrix
      const comparisonMatrix = this.buildComparisonMatrix(metrics);
      
      res.json({
        metrics: comparisonMatrix,
        comparedAt: new Date(),
        companiesCount: companyIds.length
      });
    } catch (error: any) {
      console.error('Compare competitors failed:', error);
      res.status(500).json({ 
        error: 'Failed to compare competitors',
        message: error.message 
      });
    }
  }

  private buildComparisonMatrix(metrics: CompetitiveMetric[]): any[] {
    const matrix = [
      { metric: 'hiring_activity_30d' },
      { metric: 'news_mentions_30d' },
      { metric: 'patent_activity_60d' },
      { metric: 'insight_urgency_score' },
      { metric: 'total_signals_count' }
    ];

    // Initialize with default values
    for (const row of matrix) {
      for (const metric of metrics) {
        (row as any)[metric.companyId] = '—';
      }
    }

    // Fill in actual data
    for (const metric of metrics) {
      const { companyId, signalsSummary, insightsTrends } = metric;
      
      // Hiring activity
      const jobsData = signalsSummary.bySource?.job_postings;
      if (jobsData) {
        (matrix[0] as any)[companyId] = `${jobsData.count} roles`;
      }
      
      // News mentions
      const newsData = signalsSummary.bySource?.news;
      if (newsData) {
        (matrix[1] as any)[companyId] = `${newsData.count} mentions`;
      }
      
      // Patent activity
      const patentsData = signalsSummary.bySource?.patents;
      if (patentsData) {
        (matrix[2] as any)[companyId] = patentsData.count || 0;
      }
      
      // Insight urgency score
      const urgencyScore = this.calculateUrgencyScore(insightsTrends);
      (matrix[3] as any)[companyId] = urgencyScore;
      
      // Total signals
      (matrix[4] as any)[companyId] = signalsSummary.totalSignals || 0;
    }

    return matrix;
  }

  private calculateUrgencyScore(trends: any[]): number | string {
    if (!trends || trends.length === 0) return 0;
    
    const weights: Record<string, number> = { high: 3, medium: 2, low: 1 };
    let totalScore = 0;
    let totalCount = 0;
    
    for (const trend of trends) {
      const urgencyWeight = weights[trend._id.urgency] || 1;
      totalScore += trend.count * urgencyWeight;
      totalCount += trend.count;
    }
    
    return totalCount > 0 ? parseFloat((totalScore / totalCount).toFixed(1)) : 0;
  }
}

// Initialize controller
const controller = new CompetitorController();



// Routes
const router = express.Router();

// Company management
router.get('/', controller.getCompanies.bind(controller));
router.post('/', controller.createCompany.bind(controller));
router.get('/:id', controller.getCompany.bind(controller));

// Signals and data
router.get('/:id/signals', controller.getCompanySignals.bind(controller));
router.post('/:id/fetch', controller.fetchCompanyData.bind(controller));

// Insights
router.get('/:id/insights', controller.getCompanyInsights.bind(controller));
router.post('/:id/insights/generate', controller.generateInsights.bind(controller));

// Comparison
router.get('/compare', controller.compareCompetitors.bind(controller));

export const CompetitorAnalysisRoute=router