// import catchAsync from "../../../utils/catchAsync";
// import sendResponse from "../../../utils/sendResponse";
// import { getNetSentimentScoreL30D, getNetSentimentTrendSlope, upsertEngagement, upsertWeeklySentiment } from "./competior.services";


// // ✅ Upsert Engagement
// const upsertEngagementController = catchAsync(async (req, res) => {
//   const { competitorId, source, days } = req.body;
//   const result = await upsertEngagement(competitorId, source, days);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Engagement updated successfully",
//     data: result,
//   });
// });

// // ✅ Upsert Weekly Sentiment
// const upsertWeeklySentimentController = catchAsync(async (req, res) => {
//   const { competitorId, source } = req.body;
//   await upsertWeeklySentiment(competitorId, source);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Weekly sentiment updated successfully",
//     data: null,
//   });
// });

// // ✅ Get Net Sentiment Score L30D
// const getNetSentimentScoreL30DController = catchAsync(async (req, res) => {
//   const { competitorId, source } = req.query as { competitorId: string; source: "x"|"instagram"|"linkedin"|"glassdoor" };
//   const result = await getNetSentimentScoreL30D(competitorId, source);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Net sentiment score retrieved successfully",
//     data: result,
//   });
// });

// // ✅ Get Net Sentiment Trend Slope
// const getNetSentimentTrendSlopeController = catchAsync(async (req, res) => {
//   const { competitorId, source } = req.query as { competitorId: string; source: "x"|"instagram"|"linkedin"|"glassdoor" };
//   const result = await getNetSentimentTrendSlope(competitorId, source);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Net sentiment trend slope retrieved successfully",
//     data: result,
//   });
// });

// export const competitorControllers = {
//   upsertEngagementController,
//   upsertWeeklySentimentController,
//   getNetSentimentScoreL30DController,
//   getNetSentimentTrendSlopeController
// };
