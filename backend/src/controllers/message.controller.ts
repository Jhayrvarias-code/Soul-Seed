import { Request, Response } from "express";
import * as messageService from "../services/message.service";
import { resourceLimits } from "node:worker_threads";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const { matchId, text } = req.body;

    if (!matchId || !text) {
      return res.status(400).json({
        message: "matchId and text are required",
      });
    }

    const message = await messageService.sendMessage(matchId, senderId, text);

    // Normalize message to JSON-friendly shape (string IDs) for client
    const msg = message as any;
    const messagePayload = {
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

    res.status(201).json({ message: "Message sent", data: messagePayload });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    // to check if autorized
    const userId = (req as any).user.id;

    const { matchId } = req.params as { matchId: string };
    const cursor = req.query.cursor as string | undefined;

    const result = await messageService.getMessages(matchId, userId, cursor);

    // Convert Mongoose documents to plain JSON-friendly objects so ObjectIds
    // (and populated sender documents) are serialized as strings. This fixes
    // the UI reload case where IDs appear as objects and messages disappear.
    const plainMessages = result.messages.map((msg: any) => ({
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
    }));

    // TEMP LOG — remove after debugging
    try {
      console.log(
        `GET /api/messages match=${matchId} user=${userId} count=${plainMessages.length} first=`,
        plainMessages[0],
      );
    } catch (e) {
      /* ignore logging errors */
    }
    res.status(200).json({
      messages: plainMessages,
      nextCursor: result.nextCursor,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
