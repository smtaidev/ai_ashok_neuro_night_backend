import mongoose, { Schema, Document, Types } from "mongoose";

/** ==============================
 * Types
 * ============================== */
export type Platform = "x" | "instagram" | "linkedin" | "glassdoor";
export type SocialPlatform = "x" | "instagram" | "linkedin";
export type SentimentLabel = "positive" | "neutral" | "negative";
export type EngagementPeriodType = "L30D" | "L90D";

/** ==============================
 * Competitor
 * ============================== */
export interface ICompetitor extends Document {
  name: string;
  domain?: string;
  createdAt: Date;
}

const CompetitorSchema = new Schema<ICompetitor>({
  name: { type: String, required: true },
  domain: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const CompetitorModel = mongoose.model<ICompetitor>("Competitor", CompetitorSchema);

/** ==============================
 * PlatformAccount
 * ============================== */
export interface IPlatformAccount extends Document {
  competitorId: Types.ObjectId;
  platform: Platform;
  handle?: string;
  followers?: number;
  snapshotDate: Date;
}

const PlatformAccountSchema = new Schema<IPlatformAccount>({
  competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
  platform: { type: String, enum: ["x", "instagram", "linkedin"], required: true },
  handle: { type: String },
  followers: { type: Number },
  snapshotDate: { type: Date, required: true },
});

PlatformAccountSchema.index({ competitorId: 1, platform: 1, snapshotDate: 1 }, { unique: true });

export const PlatformAccountModel = mongoose.model<IPlatformAccount>("PlatformAccount", PlatformAccountSchema);

/** ==============================
 * SocialPost
 * ============================== */
export interface ISocialPost extends Document {
  competitorId: Types.ObjectId;
  platform: SocialPlatform;
  authorHandle?: string;
  createdAt: Date;
  text?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  quotes?: number;
}

const SocialPostSchema = new Schema<ISocialPost>({
  competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
  platform: { type: String, enum: ["x", "instagram", "linkedin"], required: true },
  authorHandle: { type: String },
  createdAt: { type: Date, required: true },
  text: { type: String },
  likes: { type: Number },
  comments: { type: Number },
  shares: { type: Number },
  quotes: { type: Number },
});

SocialPostSchema.index({ competitorId: 1, platform: 1, createdAt: 1 });

export const SocialPostModel = mongoose.model<ISocialPost>("SocialPost", SocialPostSchema);

/** ==============================
 * EngagementPeriod
 * ============================== */
export interface IEngagementPeriod extends Document {
  competitorId: Types.ObjectId;
  source: SocialPlatform;
  period: EngagementPeriodType;
  totalInteractions: number;
  avgFollowers: number;
  engagementRatio: number;
}

const EngagementPeriodSchema = new Schema<IEngagementPeriod>({
  competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
  source: { type: String, enum: ["x", "instagram", "linkedin"], required: true },
  period: { type: String, enum: ["L30D", "L90D"], required: true },
  totalInteractions: { type: Number, default: 0 },
  avgFollowers: { type: Number, default: 0 },
  engagementRatio: { type: Number, default: 0 },
});

EngagementPeriodSchema.index({ competitorId: 1, source: 1, period: 1 }, { unique: true });

export const EngagementPeriodModel = mongoose.model<IEngagementPeriod>("EngagementPeriod", EngagementPeriodSchema);

/** ==============================
 * SentimentItem
 * ============================== */
export interface ISentimentItem extends Document {
  itemId: string;
  source: Platform;
  competitorId: Types.ObjectId;
  createdAt: Date;
  score: number;
  label: SentimentLabel;
}

const SentimentItemSchema = new Schema<ISentimentItem>({
  itemId: { type: String, required: true, unique: true },
  source: { type: String, enum: ["x", "instagram", "linkedin", "glassdoor"], required: true },
  competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
  createdAt: { type: Date, required: true },
  score: { type: Number, required: true },
  label: { type: String, enum: ["positive", "neutral", "negative"], required: true },
});

SentimentItemSchema.index({ competitorId: 1, source: 1, createdAt: 1 });

export const SentimentItemModel = mongoose.model<ISentimentItem>("SentimentItem", SentimentItemSchema);

/** ==============================
 * SentimentWeekly
 * ============================== */
export interface ISentimentWeekly extends Document {
  competitorId: Types.ObjectId;
  source: Platform;
  weekStart: Date;
  avgScore?: number;
  posCount?: number;
  negCount?: number;
  neuCount?: number;
}

const SentimentWeeklySchema = new Schema<ISentimentWeekly>({
  competitorId: { type: Schema.Types.ObjectId, ref: "Competitor", required: true },
  source: { type: String, enum: ["x", "instagram", "linkedin", "glassdoor"], required: true },
  weekStart: { type: Date, required: true },
  avgScore: { type: Number },
  posCount: { type: Number },
  negCount: { type: Number },
  neuCount: { type: Number },
});

SentimentWeeklySchema.index({ competitorId: 1, source: 1, weekStart: 1 }, { unique: true });

export const SentimentWeeklyModel = mongoose.model<ISentimentWeekly>("SentimentWeekly", SentimentWeeklySchema);
