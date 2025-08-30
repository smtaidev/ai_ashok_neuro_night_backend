
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

// router.get('/', competitorController.getCompanies.bind(competitorController));
// router.post('/', competitorController.createCompany.bind(competitorController));
// router.get('/:id', competitorController.getCompany.bind(competitorController));

// // Signals and data
// router.get('/:id/signals', competitorController.getCompanySignals.bind(competitorController));
// router.post('/:id/fetch', competitorController.fetchCompanyData.bind(competitorController));

// // Insights
// router.get('/:id/insights', competitorController.getCompanyInsights.bind(competitorController));
// router.post('/:id/insights/generate', competitorController.generateInsights.bind(competitorController));

// // Comparison
// router.get('/compare', competitorController.compareCompetitors.bind(competitorController));

// import { Router } from 'express';


// const router = Router();

// const controller = new CompetitorController();

// // All routes use bind to ensure `this` context
// router.get('/', controller.getCompanies.bind(controller));
// router.post('/', controller.createCompany.bind(controller));
// router.get('/:id', controller.getCompany.bind(controller));
// router.get('/:id/signals', controller.getCompanySignals.bind(controller));
// router.post('/:id/fetch', controller.fetchCompanyData.bind(controller));
// router.get('/:id/insights', controller.getCompanyInsights.bind(controller));
// router.post('/:id/insights/generate', controller.generateInsights.bind(controller));
// router.get('/compare', controller.compareCompetitors.bind(controller));

// export default router;