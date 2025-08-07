"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const foundation_route_1 = require("../modules/foundation/foundation.route");
const finalcialTracker_router_1 = require("../modules/finalcialTracker/finalcialTracker.router");
const assess_route_1 = require("../modules/assess/assess.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/foundation",
        route: foundation_route_1.FoundationRoutes,
    },
    {
        path: "/finalcialTracker",
        route: finalcialTracker_router_1.finalcialTrackerRouter
    },
    {
        path: "/assess",
        route: assess_route_1.assessRouter
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
