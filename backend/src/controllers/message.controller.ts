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

    const message = await messageService.sendMessage(
      matchId,
      senderId,
      text
    );

    res.status(201).json({
      message: "Message sent",
      data: message,
    });

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
    const cursor = req.query.cursor as string | undefined

    const result = await messageService.getMessages(matchId, userId, cursor);

    res.status(200).json({
      messages: result.messages,
      nextCursor: result.nextCursor,
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};