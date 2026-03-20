import Message from "../models/message.model";
import Match from "../models/match.model";
import User from "../models/user.model";

export const sendMessage = async (
  matchId: string,
  senderId: string,
  text: string
) => {

// Check if user belongs to match
  const match = await Match.findById(matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  const isParticipant = match.users.some(
    (userId) => userId.toString() === senderId
  );

  if (!isParticipant) {
    throw new Error("Unauthorized: Not part of this match");
  }
    
  const message = await Message.create({
    match: matchId,
    sender: senderId,
    text,
  });

  return message;
};

export const getMessages = async (matchId: string, userId: string, cursor?: string) => {

    const match = await Match.findById(matchId);
    
// To secure the only matched user can get the message
  if (!match) {
    throw new Error("Match not found");
  }

  const isParticipant = match.users.some(
    (id) => id.toString() === userId
  );

  if (!isParticipant) {
    throw new Error("Unauthorized");
  }

  let query: any = { match: matchId }; //Query

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }
  

  const messages = await Message.find({ match: matchId })
    .populate("sender", "firstName")
    .sort({ createdAt: 1 })
    .limit(20);

    const nextCursor =
    messages.length > 0
      ? messages[messages.length - 1].createdAt
      : null;

  return {messages, nextCursor,}
};

export const markAsDelivered = async (messageId: string) => {
  return Message.findByIdAndUpdate(messageId, { status: "delivered" });
};

export const markAsSeen = async (messageId: string) => {
  return Message.findByIdAndUpdate(messageId, { status: "seen" });
};

export const updateLastSeen = async (userId: string) => {
  return await User.findByIdAndUpdate(userId, {
    lastSeen: new Date(),
  });
};