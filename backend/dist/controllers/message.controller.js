"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.sendMessage = void 0;
const messageService = __importStar(require("../services/message.service"));
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { matchId, text } = req.body;
        if (!matchId || !text) {
            return res.status(400).json({
                message: "matchId and text are required",
            });
        }
        const message = await messageService.sendMessage(matchId, senderId, text);
        // Normalize message to JSON-friendly shape (string IDs) for client
        const msg = message;
        const messagePayload = {
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
        };
        res.status(201).json({ message: "Message sent", data: messagePayload });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
exports.sendMessage = sendMessage;
const getMessages = async (req, res) => {
    try {
        // to check if autorized
        const userId = req.user.id;
        const { matchId } = req.params;
        const cursor = req.query.cursor;
        const result = await messageService.getMessages(matchId, userId, cursor);
        // Convert Mongoose documents to plain JSON-friendly objects so ObjectIds
        // (and populated sender documents) are serialized as strings. This fixes
        // the UI reload case where IDs appear as objects and messages disappear.
        const plainMessages = result.messages.map((msg) => ({
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
        // TEMP LOG — remove after debugging
        try {
            console.log(`GET /api/messages match=${matchId} user=${userId} count=${plainMessages.length} first=`, plainMessages[0]);
        }
        catch (e) {
            /* ignore logging errors */
        }
        res.status(200).json({
            messages: plainMessages,
            nextCursor: result.nextCursor,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
exports.getMessages = getMessages;
