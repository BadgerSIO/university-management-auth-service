"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
let server;
let isShuttingDown = false;
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Promise Rejection:', reason);
    // Optionally, you can also log the stack trace for debugging purposes.
    console.log('Promise Stack Trace:', promise);
    if (!isShuttingDown) {
        // If the server is not already shutting down, initiate a graceful shutdown.
        isShuttingDown = true;
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(1);
        });
    }
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.databaseUrl);
            console.log('Database connected');
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`App listening on port ${config_1.default.port}`);
            });
            process.on('SIGTERM', () => {
                console.log('SIGTERM IS RECEIVED');
                if (!isShuttingDown) {
                    isShuttingDown = true;
                    server.close(() => {
                        console.log('Server closed gracefully');
                        process.exit(0);
                    });
                }
            });
        }
        catch (error) {
            console.log('Error during bootstrap:', error);
        }
    });
}
bootstrap();
