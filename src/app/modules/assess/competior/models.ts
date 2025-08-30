
// ================================

import mongoose, { Schema, Model } from 'mongoose';
import { ICompany, ISignal, IInsight } from './types';

// Company Model
const CompanySchema = new Schema<ICompany>({
  name: { 
    type: String, 
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  domain: { 
    type: String, 
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Invalid domain format']
  },
  ticker: { 
    type: String, 
    uppercase: true,
    trim: true,
    maxlength: [10, 'Ticker cannot exceed 10 characters']
  },
  industry: String,
  description: String,
  headquarters: String,
  employeeCount: Number,
  founded: Date,
  isActive: { type: Boolean, default: true },
  metadata: {
    lastFetched: Date,
    fetchCount: { type: Number, default: 0 },
    sources: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

CompanySchema.methods.updateLastFetched = function(this: ICompany): Promise<ICompany> {
  this.metadata.lastFetched = new Date();
  this.metadata.fetchCount += 1;
  return this.save();
};

CompanySchema.statics.findByDomainOrTicker = function(query: string) {
  return this.find({
    $or: [
      { domain: new RegExp(query, 'i') },
      { ticker: query.toUpperCase() },
      { name: new RegExp(query, 'i') }
    ]
  });
};

// Signal Model
const SignalSchema = new Schema<ISignal>({
  companyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true
  },
  source: { 
    type: String, 
    required: true,
    enum: {
      values: ['job_postings', 'patents', 'filings', 'reviews', 'news', 'enrichment', 'stocks'],
      message: '{VALUE} is not a valid source'
    },
    index: true
  },
  title: { 
    type: String, 
    required: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  url: { 
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid URL format'
    }
  },
  data: Schema.Types.Mixed,
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  processed: { type: Boolean, default: false },
  capturedAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

SignalSchema.index({ companyId: 1, source: 1, url: 1 }, { unique: true });

SignalSchema.methods.markProcessed = function(this: ISignal): Promise<ISignal> {
  this.processed = true;
  return this.save();
};

SignalSchema.statics.getRecentByCompany = function(companyId: string, limit: number = 50) {
  return this.find({ companyId })
    .sort({ capturedAt: -1 })
    .limit(limit)
    .lean();
};

// Insight Model
const InsightSchema = new Schema<IInsight>({
  companyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true
  },
  title: { 
    type: String, 
    required: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  context: { 
    type: String, 
    required: true,
    maxlength: [500, 'Context cannot exceed 500 characters']
  },
  implication: { 
    type: String, 
    required: true,
    maxlength: [500, 'Implication cannot exceed 500 characters']
  },
  urgency: { 
    type: String, 
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid urgency level'
    }, 
    required: true,
    index: true
  },
  confidence: { 
    type: String, 
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid confidence level'
    }, 
    required: true 
  },
  category: {
    type: String,
    enum: ['hiring', 'product', 'financial', 'strategic', 'competitive', 'operational'],
    default: 'strategic'
  },
  sources: [{
    type: { type: String, required: true },
    url: String,
    capturedAt: Date,
    _id: false
  }],
  isArchived: { type: Boolean, default: false },
  aiModel: { type: String, default: 'gpt-4' },
  processingTime: Number
}, {
  timestamps: true
});

InsightSchema.methods.archive = function(this: IInsight): Promise<IInsight> {
  this.isArchived = true;
  return this.save();
};

InsightSchema.statics.getActiveInsights = function(companyId: string, limit: number = 10) {
  return this.find({ companyId, isArchived: false })
    .sort({ urgency: -1, createdAt: -1 })
    .limit(limit);
};

// Export Models
export const Company: Model<ICompany> = mongoose.model<ICompany>('Companys', CompanySchema);
export const Signal: Model<ISignal> = mongoose.model<ISignal>('Signal', SignalSchema);
export const Insight: Model<IInsight> = mongoose.model<IInsight>('Insight', InsightSchema);
