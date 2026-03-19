import { Request, Response } from "express";
import * as matchService from "../services/match.service";

export const getMatches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const matches = await matchService.getUserMatches(userId);

    res.status(200).json({
      matches,
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};