import Match from "../models/match.model";

export const getUserMatches = async (userId: string) => {

  const matches = await Match.find({
    users: userId,
  })
    .populate("users", "-password")
    .sort({ createdAt: -1 });

  return matches;
};