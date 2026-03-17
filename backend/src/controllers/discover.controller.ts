import { Request, Response } from "express";
import * as discoverService from "../services/discover.service";
import { calculateAge } from "../helpers/calculateAge";

export const getDiscoverUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const users = await discoverService.getDiscoverUsers(userId);

    // Attach computed age
    const result = users.map((user: any) => {
      const obj = user.toObject();

      return {
        ...obj,
        age: calculateAge(obj.birthdate),
      };
    });

    res.status(200).json({
      users: result,
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};