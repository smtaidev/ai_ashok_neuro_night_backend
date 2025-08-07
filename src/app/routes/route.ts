import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { FoundationRoutes } from "../modules/foundation/foundation.route";
import { finalcialTrackerRouter } from "../modules/finalcialTracker/finalcialTracker.router";
import { assessRouter } from "../modules/assess/assess.route";



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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
