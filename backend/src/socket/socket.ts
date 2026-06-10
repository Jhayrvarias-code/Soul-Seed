import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import * as messageService from "../services/message.service";
import {
  addUser,
  removeUser,
  getOnlineUsers,
  isUserOnline,
} from "./onlineUsers";
import { isOriginAllowed } from "../config/allowedOrigins";

interface JwtPayload {
  id: string;
  email: string;
}

// Initialize Socket.io
export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
          callback(null, origin ?? true);
        } else {
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

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      socket.data.user = decoded; // attach user info
      next();
    } catch (err) {
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

    addUser(userId, socket.id); // Add online users
    io.emit("online_users", getOnlineUsers()); // Broadcast online users

    // JOIN MATCH ROOM
    socket.on("join_match", (matchId: string) => {
      if (!matchId) return;
      socket.join(matchId);
      console.log(`User ${userId} joined match room ${matchId}`);
    });

    //TYPING
    socket.on("typing", (matchId: string) => {
      socket.to(matchId).emit("typing", {
        userId,
      });
    });

    socket.on("stop_typing", (matchId: string) => {
      socket.to(matchId).emit("stop_typing", {
        userId,
      });
    });

    // SEND MESSAGE
    socket.on(
      "send_message",
      async ({ matchId, text }: { matchId: string; text: string }) => {
        if (!matchId || !text?.trim()) {
          return socket.emit("error", "Invalid data");
        }
        try {
          const message = await messageService.sendMessage(
            matchId,
            userId,
            text,
          );

          // Mark as delivered and get updated populated message
          const delivered = await messageService.markAsDelivered(
            message._id.toString(),
          );

          const msg = delivered || message;

          // Normalize message to plain JSON-friendly object
          const messageData = {
            _id: msg._id?.toString?.() ?? msg._id,
            match: msg.match?.toString?.() ?? msg.match,
            sender:
              msg.sender && typeof msg.sender === "object"
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
        } catch (err: any) {
          console.error("send_message error:", err.message);
          socket.emit("error", err.message);
        }
      },
    );

    //SEEN
    socket.on(
      "message_seen",
      async ({
        matchId,
        messageId,
      }: {
        matchId: string;
        messageId: string;
      }) => {
        try {
          if (!matchId || !messageId) return;
          await messageService.markAsSeen(messageId);
          socket.to(matchId).emit("message_seen", { messageId });
        } catch (err) {
          console.error("message_seen error:", err);
        }
      },
    );

    socket.on("disconnect", async () => {
      console.log("Disconnected:", userId);

      removeUser(userId, socket.id);

      const stillOnline = isUserOnline(userId);

      if (!stillOnline) {
        await messageService.updateLastSeen(userId);
      }

      //Update online users
      io.emit("online_users", getOnlineUsers());
    });
  });

  return io;
};
