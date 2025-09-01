import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { FoundationRoutes } from "../modules/foundation/foundation.route";
import { finalcialTrackerRouter } from "../modules/finalcialTracker/finalcialTracker.router";
import { assessRouter } from "../modules/assess/assess.route";
import { assessChallengeRouter } from "../modules/assess/challenge/inde";
import { assessClarhetRouter } from "../modules/assess/clarhet/inde";
import { assessSwotRouter } from "../modules/assess/swot/inex";
import { blueprintRouter} from "../modules/blueprint/blueprint.route";
import { choregorapRoute } from "../modules/choreograph/choreograph.router";
import { aiRespnonseRoute } from "../modules/ai.response/ai.route";
import { chatBotRoute } from "../modules/chat-bot/chat.route";
import { PlanRouters } from "../modules/Plan/plan.route";
import { alignmentCheckRoute } from "../modules/alignmentCheck/alignmentCheck.route";
import { SubscriptionRoutes } from "../modules/Subscription/Subscription.route";
import { meetingRoute } from "../modules/meetings/meeting.route";
import { agendaRoute } from "../modules/Agenda/Agenda.route";
import { organizationUserRoute } from "../modules/organization-role/organization-role.route";
import { businessFunctionRoute } from "../modules/businessfuncation/businessfuncation.route";
import { TalentRoute } from "../modules/Talent/Telent.route";
import { NotificationRoute } from "../modules/notification/notification.route";
import { companyRoute } from "../modules/company/company.route";
import { CompetitorAnalysisRoute } from "../modules/assess/competior/controllers";
import { competitorRoute } from "../modules/assess/competior/competitors.route/competitors.route";
import { companyInfoRote } from "../modules/company-info/company-info.route";
import { assessCompetiorRouter } from "../modules/assess/competior/competior.route";

const router = express.Router()

const moduleRoutes = [

  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/foundation",
    route: FoundationRoutes,
  },
  {
    path: "/finalcialTracker",
    route:finalcialTrackerRouter
  },
  {
    path: "/assess",
    route:assessRouter
  },
  {
    path: "/challenge",
    route:assessChallengeRouter
  },
  {
    path: "/create-clarhet",
    route:assessClarhetRouter
  },
  {
    path: "/competitors",
    // route:CompetitorAnalysisRoute
    route:assessCompetiorRouter
  },
  {
    path: "/create-swot",
    route:assessSwotRouter
  },
  {
    path: "/blueprint",
    route:blueprintRouter
  },
  {
    path: "/choreograph",
    route:choregorapRoute
  },
  {
    path: "/ai-recommendations",
    route:aiRespnonseRoute
  },
  {
    path: "/chat-bot",
    route:chatBotRoute
  },
  {
    path: "/plan",
    route:PlanRouters
  },
  {
    path: "/alignments",
    route:alignmentCheckRoute
  },
  {
    path: "/subscription",
    route:SubscriptionRoutes
  },
  {
    path: "/meetings",
    route:meetingRoute
  },
  {
    path: "/agendas",
    route:agendaRoute
  },
  {
    path: "/organization",
    route:organizationUserRoute
  },
  {
    path: "/business-function",
    route:businessFunctionRoute
  },
  {
    path: "/talents",
    route:TalentRoute
  },
  {
    path: "/notifications",
    route:NotificationRoute
  },
  {
    path: "/company",
    route:companyRoute
  },
  {
    path: "/company-info",
    route:companyInfoRote
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
