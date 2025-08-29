
// import express from 'express'
// import { AssessContllors } from '../assess.contllors'
// import auth from '../../../middlewares/auth'
// import { competitorControllers } from './competior.contllors';


// const router=express.Router()

// // ✅ Upsert Engagement
// router.post("/upsert-engagement", auth("companyAdmin"), competitorControllers.upsertEngagementController);

// // ✅ Upsert Weekly Sentiment
// router.post("/upsert-weekly-sentiment", auth("companyAdmin"), competitorControllers.upsertWeeklySentimentController);

// // ✅ Get Net Sentiment Score L30D
// router.get("/net-sentiment-l30d", auth("companyAdmin"), competitorControllers.getNetSentimentScoreL30DController);

// // ✅ Get Net Sentiment Trend Slope
// router.get("/net-sentiment-trend-slope", auth("companyAdmin"), competitorControllers.getNetSentimentTrendSlopeController);
// //-------------competior route arey ---------------------------------------
// router.get('/',auth('companyAdmin'),AssessContllors.createCompetitorAnalysisIntDb)
// router.patch('/:id',auth('companyAdmin'),AssessContllors.updatCompetitorAnalysisIntDb)
// router.patch('/:id',auth('companyAdmin'),AssessContllors.updatCompetitorAnalysisIntDb)


// export const assessCompetiorRouter=router