"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const route_1 = __importDefault(require("./app/routes/route"));
const app = (0, express_1.default)();
// Middleware setup
// Allow all origins, methods, and credentials if needed
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Allow the request origin or fall back to a default if not present
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    else {
        res.header("Access-Control-Allow-Origin", ["http://localhost:3000", "http://localhost:3001"]);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return; // Ensure the function exits after handling OPTIONS
    }
    next();
});
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("🟢Clarhet Server is running..");
});
app.use("/api/v1", route_1.default);
app.use(globalErrorhandler_1.default);
app.use(notFound_1.default);
exports.default = app;
