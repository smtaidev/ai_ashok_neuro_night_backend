// import mongoose, { Schema, Document, Types } from "mongoose";

import { model, Schema } from "mongoose";
import { Company, Insight, Signal } from "./competior.interface";

// /** ==============================
//  * Types
//  * ============================== */
// export type Platform = "x" | "instagram" | "linkedin" | "glassdoor";
// export type SocialPlatform = "x" | "instagram" | "linkedin";
// export type SentimentLabel = "positive" | "neutral" | "negative";
// export type EngagementPeriodType = "L30D" | "L90D";

// /** ==============================
//  * Competitor
//  * ============================== */
// export interface ICompetitor extends Document {
//   name: string;
//   domain?: string;
//   createdAt: Date;
// }

// const CompetitorSchema = new Schema<ICompetitor>({
//   name: { type: String, required: true },
//   domain: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// export const CompetitorModel = mongoose.model<ICompetitor>("Competitor", CompetitorSchema);

// /** ==============================
//  * PlatformAccount
//  * ============================== */
// export interface IPlatformAccount extends Document {
//   competitorId: Types.ObjectId;
//   platform: Platform;
//   handle?: string;
//   followers?: number;
//   snapshotDate: Date;
// }

// const PlatformAccountSchema = new Schema<IPlatformAccount>({
//   competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
//   platform: { type: String, enum: ["x", "instagram", "linkedin"], required: true },
//   handle: { type: String },
//   followers: { type: Number },
//   snapshotDate: { type: Date, required: true },
// });

// PlatformAccountSchema.index({ competitorId: 1, platform: 1, snapshotDate: 1 }, { unique: true });

// export const PlatformAccountModel = mongoose.model<IPlatformAccount>("PlatformAccount", PlatformAccountSchema);

// /** ==============================
//  * SocialPost
//  * ============================== */
// export interface ISocialPost extends Document {
//   competitorId: Types.ObjectId;
//   platform: SocialPlatform;
//   authorHandle?: string;
//   createdAt: Date;
//   text?: string;
//   likes?: number;
//   comments?: number;
//   shares?: number;
//   quotes?: number;
// }

// const SocialPostSchema = new Schema<ISocialPost>({
//   competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
//   platform: { type: String, enum: ["x", "instagram", "linkedin"], required: true },
//   authorHandle: { type: String },
//   createdAt: { type: Date, required: true },
//   text: { type: String },
//   likes: { type: Number },
//   comments: { type: Number },
//   shares: { type: Number },
//   quotes: { type: Number },
// });

// SocialPostSchema.index({ competitorId: 1, platform: 1, createdAt: 1 });

// export const SocialPostModel = mongoose.model<ISocialPost>("SocialPost", SocialPostSchema);

// /** ==============================
//  * EngagementPeriod
//  * ============================== */
// export interface IEngagementPeriod extends Document {
//   competitorId: Types.ObjectId;
//   source: SocialPlatform;
//   period: EngagementPeriodType;
//   totalInteractions: number;
//   avgFollowers: number;
//   engagementRatio: number;
// }

// const EngagementPeriodSchema = new Schema<IEngagementPeriod>({
//   competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
//   source: { type: String, enum: ["x", "instagram", "linkedin"], required: true },
//   period: { type: String, enum: ["L30D", "L90D"], required: true },
//   totalInteractions: { type: Number, default: 0 },
//   avgFollowers: { type: Number, default: 0 },
//   engagementRatio: { type: Number, default: 0 },
// });

// EngagementPeriodSchema.index({ competitorId: 1, source: 1, period: 1 }, { unique: true });

// export const EngagementPeriodModel = mongoose.model<IEngagementPeriod>("EngagementPeriod", EngagementPeriodSchema);

// /** ==============================
//  * SentimentItem
//  * ============================== */
// export interface ISentimentItem extends Document {
//   itemId: string;
//   source: Platform;
//   competitorId: Types.ObjectId;
//   createdAt: Date;
//   score: number;
//   label: SentimentLabel;
// }

// const SentimentItemSchema = new Schema<ISentimentItem>({
//   itemId: { type: String, required: true, unique: true },
//   source: { type: String, enum: ["x", "instagram", "linkedin", "glassdoor"], required: true },
//   competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
//   createdAt: { type: Date, required: true },
//   score: { type: Number, required: true },
//   label: { type: String, enum: ["positive", "neutral", "negative"], required: true },
// });

// SentimentItemSchema.index({ competitorId: 1, source: 1, createdAt: 1 });

// export const SentimentItemModel = mongoose.model<ISentimentItem>("SentimentItem", SentimentItemSchema);

// /** ==============================
//  * SentimentWeekly
//  * ============================== */
// export interface ISentimentWeekly extends Document {
//   competitorId: Types.ObjectId;
//   source: Platform;
//   weekStart: Date;
//   avgScore?: number;
//   posCount?: number;
//   negCount?: number;
//   neuCount?: number;
// }

// const SentimentWeeklySchema = new Schema<ISentimentWeekly>({
//   competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
//   source: { type: String, enum: ["x", "instagram", "linkedin", "glassdoor"], required: true },
//   weekStart: { type: Date, required: true },
//   avgScore: { type: Number },
//   posCount: { type: Number },
//   negCount: { type: Number },
//   neuCount: { type: Number },
// });

// SentimentWeeklySchema.index({ competitorId: 1, source: 1, weekStart: 1 }, { unique: true });

// export const SentimentWeeklyModel = mongoose.model<ISentimentWeekly>("SentimentWeekly", SentimentWeeklySchema);

// const SignalSchema = new mongoose.Schema({
//   companyId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Company', 
//     required: true,
//     index: true
//   },
//   source: { 
//     type: String, 
//     required: true,
//     enum: {
//       values: ['job_postings', 'patents', 'filings', 'reviews', 'news', 'enrichment', 'stocks'],
//       message: '{VALUE} is not a valid source'
//     },
//     index: true
//   },
//   title: { 
//     type: String, 
//     required: true,
//     maxlength: [200, 'Title cannot exceed 200 characters']
//   },
//   description: { 
//     type: String,
//     maxlength: [1000, 'Description cannot exceed 1000 characters']
//   },
//   url: { 
//     type: String,
//     validate: {
//       validator: function(v:any) {
//         return !v || /^https?:\/\/.+/.test(v);
//       },
//       message: 'Invalid URL format'
//     }
//   },
//   data: mongoose.Schema.Types.Mixed,
//   priority: { 
//     type: String, 
//     enum: ['low', 'medium', 'high'], 
//     default: 'medium' 
//   },
//   processed: { type: Boolean, default: false },
//   capturedAt: { type: Date, default: Date.now, index: true }
// }, {
//   timestamps: true
// });

// // Compound unique index
// SignalSchema.index({ companyId: 1, source: 1, url: 1 }, { unique: true });

// // Methods
// SignalSchema.methods.markProcessed = function() {
//   this.processed = true;
//   return this.save();
// };

// SignalSchema.statics.getRecentByCompany = function(companyId, limit = 50) {
//   return this.find({ companyId })
//     .sort({ capturedAt: -1 })
//     .limit(limit)
//     .lean();
// };

// SignalSchema.statics.getGroupedSignals = function(companyId) {
//   return this.aggregate([
//     { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
//     { $sort: { capturedAt: -1 } },
//     { 
//       $group: { 
//         _id: '$source', 
//         signals: { $push: '$$ROOT' },
//         count: { $sum: 1 },
//         latest: { $first: '$capturedAt' }
//       } 
//     }
//   ]);
// };

// export const  SignalModel= mongoose.model('Signal', SignalSchema);

// // src/models/Insight.js
// import mongoose from 'mongoose';

// const InsightSchema = new mongoose.Schema({
//   companyId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Company', 
//     required: true,
//     index: true
//   },
//   title: { 
//     type: String, 
//     required: true,
//     maxlength: [150, 'Title cannot exceed 150 characters']
//   },
//   context: { 
//     type: String, 
//     required: true,
//     maxlength: [500, 'Context cannot exceed 500 characters']
//   },
//   implication: { 
//     type: String, 
//     required: true,
//     maxlength: [500, 'Implication cannot exceed 500 characters']
//   },
//   urgency: { 
//     type: String, 
//     enum: {
//       values: ['low', 'medium', 'high'],
//       message: '{VALUE} is not a valid urgency level'
//     }, 
//     required: true,
//     index: true
//   },
//   confidence: { 
//     type: String, 
//     enum: {
//       values: ['low', 'medium', 'high'],
//       message: '{VALUE} is not a valid confidence level'
//     }, 
//     required: true 
//   },
//   category: {
//     type: String,
//     enum: ['hiring', 'product', 'financial', 'strategic', 'competitive', 'operational'],
//     default: 'strategic'
//   },
//   sources: [{
//     type: { type: String, required: true },
//     url: String,
//     capturedAt: Date,
//     _id: false
//   }],
//   isArchived: { type: Boolean, default: false },
//   aiModel: { type: String, default: 'gpt-4' },
//   processingTime: Number
// }, {
//   timestamps: true
// });

// // Methods
// InsightSchema.methods.archive = function() {
//   this.isArchived = true;
//   return this.save();
// };

// InsightSchema.statics.getActiveInsights = function(companyId, limit = 10) {
//   return this.find({ companyId, isArchived: false })
//     .sort({ urgency: -1, createdAt: -1 })
//     .limit(limit);
// };

// export const InsightModel = mongoose.model('Insight', InsightSchema);

interface SignalDocument extends Signal, Document {}
interface InsightDocument extends Insight, Document {}


const signalSchema = new Schema<SignalDocument>({
  companyId: { type: String, required: true },
  source: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  capturedAt: { type: Date, required: true },
});

const insightSchema = new Schema<InsightDocument>({
  companyId: { type: String, required: true },
  title: { type: String, required: true },
  context: { type: String, required: true },
  implication: { type: String, required: true },
  urgency: { type: String, enum: ['high', 'medium', 'low'], required: true },
  confidence: { type: String, enum: ['high', 'medium', 'low'], required: true },
  category: { type: String, enum: ['hiring', 'product', 'financial', 'strategic', 'competitive', 'operational'], required: true },
  sources: [{
    type: { type: String, required: true },
    url: { type: String, required: true },
    capturedAt: { type: String, required: true },
  }],
  aiModel: { type: String },
  processingTime: { type: Number },
  createdAt: { type: Date, default: Date.now },
  isArchived: { type: Boolean, default: false },
});

const companySchema = new Schema<Company>({
  name: { type: String, required: true },
  domain: { type: String },
  ticker: { type: String },
  industry: { type: String },
  isActive: { type: Boolean, default: true },
  signalCount: { type: Number, default: 0 },
});

companySchema.methods.updateLastFetched = async function () {
  this.lastFetched = new Date();
  await this.save();
};


export const SignalModel = model<SignalDocument>('Signal', signalSchema);
export const InsightModel = model<InsightDocument>('Insight', insightSchema);
