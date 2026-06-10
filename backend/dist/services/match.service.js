"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMatches = void 0;
const match_model_1 = __importDefault(require("../models/match.model"));
const getUserMatches = async (userId) => {
    const matches = await match_model_1.default.find({
        $or: [{ user1: userId }, { user2: userId }],
    })
        .populate("user1", "-password")
        .populate("user2", "-password")
        .sort({ createdAt: -1 });
    return matches;
};
exports.getUserMatches = getUserMatches;
