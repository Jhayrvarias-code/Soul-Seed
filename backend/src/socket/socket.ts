import { Server} from 'socket.io';
import jwt from "jsonwebtoken";
import * as messageService from "../services/message.service";
import {addUser, removeUser, getOnlineUsers, isUserOnline} from "./onlineUsers";
import { isOriginAllowed } from "../config/cors";

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
  io.on('connection', (socket) => {
   const userId = socket.data.user.id;
   if (!userId) {
      socket.disconnect();
      return;
    }
  console.log('User connected:', userId);

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
      userId
    });
  });

  socket.on("stop_typing", (matchId: string) => {
    socket.to(matchId).emit("stop_typing", {
      userId
    });
  });

    // SEND MESSAGE
     socket.on("send_message", async ({ matchId, text }:{ matchId: string; text: string }) => {

     if (!matchId || !text?.trim()) {
    return socket.emit("error", "Invalid data");
}
 try {
      const message = await messageService.sendMessage(
        matchId,
        userId,
        text
      );

        // Emit message to room
        io.to(matchId).emit("receive_message", message);

        // Mark as delivered
        await messageService.markAsDelivered(message._id.toString());


     // Notify users about delivery
        io.to(matchId).emit("message_delivered", { messageId: message._id });
      } catch (err: any) {
        console.error("send_message error:", err.message);
        socket.emit("error", err.message);
      }
  });

    //SEEN
    socket.on("message_seen", async ({ matchId, messageId }: { matchId: string; messageId: string }) => {
      try {
        if (!matchId || !messageId) return;
        await messageService.markAsSeen(messageId);
        socket.to(matchId).emit("message_seen", { messageId });
      } catch (err) {
        console.error("message_seen error:", err);
      }
    });

  socket.on("disconnect", async() => {
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
}