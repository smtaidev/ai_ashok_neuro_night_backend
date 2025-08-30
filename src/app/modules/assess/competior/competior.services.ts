
// import OpenAI from 'openai';
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
