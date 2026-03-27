import Match from "../models/match.model";

export const getUserMatches = async (userId: string) => {
  const matches = await Match.find({
    $or: [{ user1: userId }, { user2: userId }],
  })
    .populate("user1", "-password")
    .populate("user2", "-password")
    .sort({ createdAt: -1 });
  return matches;
};
