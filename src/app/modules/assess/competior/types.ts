import { Document, Types } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  domain?: string;
  ticker?: string;
  industry?: string;
  description?: string;
  headquarters?: string;
  employeeCount?: number;
  founded?: Date;
  isActive: boolean;
  metadata: {
    lastFetched?: Date;
    fetchCount: number;
    sources: string[];
  };
  updateLastFetched(): Promise<ICompany>;
}

export interface ISignal extends Document {
  companyId: Types.ObjectId;
  source: 'job_postings' | 'patents' | 'filings' | 'reviews' | 'news' | 'enrichment' | 'stocks';
  title: string;
  description?: string;
  url?: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
  processed: boolean;
  capturedAt: Date;
  markProcessed(): Promise<ISignal>;
}

export interface IInsight extends Document {
  companyId: Types.ObjectId;
  title: string;
  context: string;
  implication: string;
  urgency: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  category: 'hiring' | 'product' | 'financial' | 'strategic' | 'competitive' | 'operational';
  sources: Array<{
    type: string;
    url?: string;
    capturedAt?: Date;
  }>;
  isArchived: boolean;
  aiModel: string;
  processingTime?: number;
  archive(): Promise<IInsight>;
}

export interface SignalData {
  source: string;
  title: string;
  description?: string;
  url?: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
  capturedAt: Date;
}

export interface ProcessingResult {
  saved: number;
  updated: number;
  skipped: number;
  errors: Array<{
    signal: string;
    error: string;
  }>;
}

export interface SignalsSummary {
  totalSignals: number;
  bySource: Record<string, {
    count: number;
    latest: Date;
    highPriorityCount: number;
  }>;
}

export interface InsightGeneration {
  insights: IInsight[];
  metadata?: {
    signalsAnalyzed: number;
    processingTime: number;
    model: string;
  };
  message?: string;
  error?: string;
}

export interface CompetitiveMetric {
  companyId: string;
  signalsSummary: SignalsSummary;
  insightsTrends: any[];
}