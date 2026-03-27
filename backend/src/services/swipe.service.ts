import Swipe from "../models/swipe.model";
import Match from "../models/match.model";
import mongoose from "mongoose";

const sortUsers = (id1: string, id2: string) => {
  return [id1, id2].sort(); // ensures (A,B) == (B,A)
};
console.log(sortUsers);

export const swipeUser = async (
  fromUserId: string,
  toUserId: string,
  action: "like" | "pass",
) => {
  //Prevent self swipe
  if (fromUserId === toUserId) {
    throw new Error("You cannot swipe yourself");
  }

  // Save swipe (update if exists)
  await Swipe.findOneAndUpdate(
    { fromUser: fromUserId, toUser: toUserId },
    { action },
    { upsert: true, new: true },
  );

  // If it's a pass → no match (early exit)
  if (action === "pass") {
    return { match: false };
  }

  // Check if the other user liked you
  const reverseSwipe = await Swipe.findOne({
    fromUser: toUserId,
    toUser: fromUserId,
    action: "like",
  });

  if (!reverseSwipe) {
    return { match: false };
  }

  const [id1, id2] = sortUsers(fromUserId, toUserId);

  const user1 = new mongoose.Types.ObjectId(id1);
  const user2 = new mongoose.Types.ObjectId(id2);

  // CRITICAL: ensure unique match per pair
  const match = await Match.findOneAndUpdate(
    { user1, user2 },
    { $setOnInsert: { user1, user2 } }, // only insert if not exists
    { upsert: true, new: true },
  );

  return {
    match: true,
    matchId: match._id,
  };
};
