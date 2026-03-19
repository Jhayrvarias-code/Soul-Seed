import { Request, Response } from "express";
import * as swipeService from "../services/swipe.service";

export const swipe = async (req: Request, res: Response) => {
  try {
    const fromUserId = (req as any).user.id;
    const { toUserId, action } = req.body;

    if (!toUserId || !action) {
      return res.status(400).json({
        message: "toUserId and action are required",
      });
    }

    if (!["like", "pass"].includes(action)) {
      return res.status(400).json({
        message: "Invalid action",
      });
    }

    const result = await swipeService.swipeUser(
      fromUserId,
      toUserId,
      action
    );

    res.status(200).json({
      message: action === "like" ? "Liked user" : "Passed user",
      match: result.match,
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};