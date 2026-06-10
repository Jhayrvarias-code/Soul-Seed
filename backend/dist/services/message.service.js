"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastSeen = exports.markAsSeen = exports.markAsDelivered = exports.getMessages = exports.sendMessage = void 0;
const message_model_1 = __importDefault(require("../models/message.model"));
const match_model_1 = __importDefault(require("../models/match.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const isUserInMatch = (match, userId) => {
    return match.user1.toString() === userId || match.user2.toString() === userId;
};
const sendMessage = async (matchId, senderId, text) => {
    // Check if user belongs to match
    const match = await match_model_1.default.findById(matchId);
    if (!match) {
        throw new Error("Match not found");
    }
    // Check if sender belongs to match
    if (!isUserInMatch(match, senderId)) {
        throw new Error("Unauthorized: Not part of this match");
    }
    const created = await message_model_1.default.create({
        match: new mongoose_1.default.Types.ObjectId(matchId),
        sender: new mongoose_1.default.Types.ObjectId(senderId),
        text,
    });
    const message = await message_model_1.default.findById(created._id)
        .populate("sender", "firstName")
        .exec();
    if (!message) {
        throw new Error("Message not found after create");
    }
    return message;
};
exports.sendMessage = sendMessage;
const getMessages = async (matchId, userId, cursor) => {
    const match = await match_model_1.default.findById(matchId);
    // To secure the only matched user can get the message
    if (!match) {
        throw new Error("Match not found");
    }
    if (!isUserInMatch(match, userId)) {
        throw new Error("Unauthorized");
    }
    // Build query using ObjectId to avoid mismatches between string and ObjectId
    const query = { match: new mongoose_1.default.Types.ObjectId(matchId) };
    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }
    // Use lean() to return plain objects, then normalize IDs to strings so
    // controllers and clients receive consistent JSON-friendly data.
    const rawMessages = await message_model_1.default.find(query)
        .populate("sender", "firstName")
        .sort({ createdAt: 1 })
        .limit(20)
        .lean();
    const messages = rawMessages.map((msg) => ({
        _id: msg._id?.toString?.() ?? msg._id,
        match: msg.match?.toString?.() ?? msg.match,
        sender: msg.sender && typeof msg.sender === "object"
            ? {
                _id: msg.sender._id?.toString?.() ?? msg.sender._id,
                firstName: msg.sender.firstName,
            }
            : msg.sender,
        text: msg.text,
        status: msg.status,
        createdAt: msg.createdAt,
    }));
    const nextCursor = messages.length > 0 ? messages[messages.length - 1].createdAt : null;
    return { messages, nextCursor };
};
exports.getMessages = getMessages;
const markAsDelivered = async (messageId) => {
    return message_model_1.default.findByIdAndUpdate(messageId, { status: "delivered" }, { new: true })
        .populate("sender", "firstName")
        .exec();
};
exports.markAsDelivered = markAsDelivered;
const markAsSeen = async (messageId) => {
    return message_model_1.default.findByIdAndUpdate(messageId, { status: "seen" }, { new: true })
        .populate("sender", "firstName")
        .exec();
};
exports.markAsSeen = markAsSeen;
const updateLastSeen = async (userId) => {
    return await user_model_1.default.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
    });
};
exports.updateLastSeen = updateLastSeen;
