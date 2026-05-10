import Message from "../models/message.model";
import Match from "../models/match.model";
import User from "../models/user.model";
import mongoose from "mongoose";

const isUserInMatch = (match: any, userId: string) => {
  return match.user1.toString() === userId || match.user2.toString() === userId;
};

export const sendMessage = async (
  matchId: string,
  senderId: string,
  text: string,
) => {
  // Check if user belongs to match
  const match = await Match.findById(matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  // Check if sender belongs to match
  if (!isUserInMatch(match, senderId)) {
    throw new Error("Unauthorized: Not part of this match");
  }

  const created = await Message.create({
    match: new mongoose.Types.ObjectId(matchId),
    sender: new mongoose.Types.ObjectId(senderId),
    text,
  });

  const message = await Message.findById(created._id)
    .populate("sender", "firstName")
    .exec();

  if (!message) {
    throw new Error("Message not found after create");
  }

  return message;
};

export const getMessages = async (
  matchId: string,
  userId: string,
  cursor?: string,
) => {
  const match = await Match.findById(matchId);

  // To secure the only matched user can get the message
  if (!match) {
    throw new Error("Match not found");
  }

  if (!isUserInMatch(match, userId)) {
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
    messages.length > 0 ? messages[messages.length - 1].createdAt : null;

  return { messages, nextCursor };
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
