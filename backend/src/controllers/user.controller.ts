import { Request, Response } from "express";
import { getCurrentUser } from "../services/user.service";

export const getMe = async (req: Request, res: Response) => {

  try {

    const userId = (req as any).user.id;

    const user = await getCurrentUser(userId);

    res.status(200).json(user);

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }

};