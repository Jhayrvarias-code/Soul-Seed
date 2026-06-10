"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;
async function connectMongo() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not set");
    }
    if (cache.conn)
        return cache.conn;
    if (!cache.promise) {
        cache.promise = mongoose_1.default.connect(uri).then((m) => m);
    }
    cache.conn = await cache.promise;
    return cache.conn;
}
