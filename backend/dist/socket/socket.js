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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const messageService = __importStar(require("../services/message.service"));
const onlineUsers_1 = require("./onlineUsers");
const allowedOrigins_1 = require("../config/allowedOrigins");
// Initialize Socket.io
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: (origin, callback) => {
                if ((0, allowedOrigins_1.isOriginAllowed)(origin)) {
                    callback(null, origin ?? true);
                }
                else {
                    callback(null, false);
                }
            },
            credentials: true,
        },
    });
    // Auth
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                throw new Error("No token provided");
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.user = decoded; // attach user info
            next();
        }
        catch (err) {
            next(new Error("Unauthorized"));
        }
    });
    /** *
   Socket.io events
  */
    // CONNECTION
    io.on("connection", (socket) => {
        const userId = socket.data.user.id;
        if (!userId) {
            socket.disconnect();
            return;
        }
        console.log("User connected:", userId);
        (0, onlineUsers_1.addUser)(userId, socket.id); // Add online users
        io.emit("online_users", (0, onlineUsers_1.getOnlineUsers)()); // Broadcast online users
        // JOIN MATCH ROOM
        socket.on("join_match", (matchId) => {
            if (!matchId)
                return;
            socket.join(matchId);
            console.log(`User ${userId} joined match room ${matchId}`);
        });
        //TYPING
        socket.on("typing", (matchId) => {
            socket.to(matchId).emit("typing", {
                userId,
            });
        });
        socket.on("stop_typing", (matchId) => {
            socket.to(matchId).emit("stop_typing", {
                userId,
            });
        });
        // SEND MESSAGE
        socket.on("send_message", async ({ matchId, text }) => {
            if (!matchId || !text?.trim()) {
                return socket.emit("error", "Invalid data");
            }
            try {
                const message = await messageService.sendMessage(matchId, userId, text);
                // Mark as delivered and get updated populated message
                const delivered = await messageService.markAsDelivered(message._id.toString());
                const msg = delivered || message;
                // Normalize message to plain JSON-friendly object
                const messageData = {
                    _id: msg._id?.toString?.() ?? msg._id,
                    match: msg.match?.toString?.() ?? msg.match,
                    sender: msg.sender && typeof msg.sender === "object" && "firstName" in msg.sender
                        ? {
                            _id: msg.sender._id?.toString?.() ?? msg.sender._id,
                            firstName: msg.sender.firstName,
                        }
                        : msg.sender,
                    text: msg.text,
                    status: msg.status,
                    createdAt: msg.createdAt,
                };
                // Emit delivered message to room
                io.to(matchId).emit("receive_message", messageData);
                io.to(matchId).emit("message_delivered", {
                    messageId: messageData._id,
                });
            }
            catch (err) {
                console.error("send_message error:", err.message);
                socket.emit("error", err.message);
            }
        });
        //SEEN
        socket.on("message_seen", async ({ matchId, messageId, }) => {
            try {
                if (!matchId || !messageId)
                    return;
                await messageService.markAsSeen(messageId);
                socket.to(matchId).emit("message_seen", { messageId });
            }
            catch (err) {
                console.error("message_seen error:", err);
            }
        });
        socket.on("disconnect", async () => {
            console.log("Disconnected:", userId);
            (0, onlineUsers_1.removeUser)(userId, socket.id);
            const stillOnline = (0, onlineUsers_1.isUserOnline)(userId);
            if (!stillOnline) {
                await messageService.updateLastSeen(userId);
            }
            //Update online users
            io.emit("online_users", (0, onlineUsers_1.getOnlineUsers)());
        });
    });
    return io;
};
exports.initSocket = initSocket;
