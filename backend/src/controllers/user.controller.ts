import { Request, Response } from "express";
import { getCurrentUser } from "../services/user.service";
import { checkProfileCompletion } from "../helpers/profileCompletion";

export const getMe = async (req: Request, res: Response) => {
  

  try {

    const userId = (req as any).user.id;

    const user = await getCurrentUser(userId);

   // Check if the user's profile is complete
    const isProfileComplete = checkProfileCompletion(user);

    res.status(200).json({
      ...user.toObject(), // convert Mongoose document to plain JS object
      isProfileComplete
    });

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }

};