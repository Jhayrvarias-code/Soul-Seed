"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = require("./lib/mongoose");
const socket_1 = require("./socket/socket");
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app_1.default);
(0, socket_1.initSocket)(server);
(0, mongoose_1.connectMongo)()
    .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
});
