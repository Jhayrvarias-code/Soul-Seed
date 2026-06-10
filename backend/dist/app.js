"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const photo_routes_1 = __importDefault(require("./routes/photo.routes"));
const discover_routes_1 = __importDefault(require("./routes/discover.routes"));
const swipe_routes_1 = __importDefault(require("./routes/swipe.routes"));
const match_routes_1 = __importDefault(require("./routes/match.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const allowedOrigins_1 = require("./config/allowedOrigins");
const mongoose_1 = require("./lib/mongoose");
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: (origin, callback) => {
        const allowed = (0, allowedOrigins_1.isOriginAllowed)(origin);
        if (!origin || allowed) {
            callback(null, true);
        }
        else {
            console.log("Blocked CORS origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(async (_req, _res, next) => {
    try {
        await (0, mongoose_1.connectMongo)();
        next();
    }
    catch (err) {
        next(err);
    }
});
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
function mountRoutes(prefix) {
    const base = prefix ? `${prefix}` : "";
    app.use(`${base}/users`, user_routes_1.default);
    app.use(`${base}/auth`, auth_routes_1.default);
    app.use(`${base}/photos`, photo_routes_1.default);
    app.use(`${base}/discover`, discover_routes_1.default);
    app.use(`${base}/swipe`, swipe_routes_1.default);
    app.use(`${base}/matches`, match_routes_1.default);
    app.use(`${base}/messages`, message_routes_1.default);
}
// Local dev: full path `/api/auth/...`
mountRoutes("/api");
// Vercel Services: strips `/api` prefix → `/auth/...`
mountRoutes("");
app.get("/", (_req, res) => {
    res.send("API is running...");
});
exports.default = app;
