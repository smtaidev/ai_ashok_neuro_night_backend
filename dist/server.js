"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
let server = null;
// Database connection
async function connectToDatabase() {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log('🛢 Database connected successfully');
    }
    catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
}
// Graceful shutdown
function gracefulShutdown(signal) {
    console.log(`Received ${signal}. Closing server...`);
    if (server) {
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
}
// Application bootstrap
async function bootstrap() {
    try {
        await connectToDatabase();
        //await seed();
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 Clarhet application is running on port ${config_1.default.port}`);
        });
        // Listen for termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        // Error handling
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });
        process.on('unhandledRejection', (error) => {
            console.error('Unhandled Rejection:', error);
            gracefulShutdown('unhandledRejection');
        });
    }
    catch (error) {
        console.error('Error during bootstrap:', error);
        process.exit(1);
    }
}
// Start the application
bootstrap();
