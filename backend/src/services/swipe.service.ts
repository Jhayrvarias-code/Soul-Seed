import Swipe from "../models/swipe.model";
import Match from "../models/match.model";

export const swipeUser = async (
  fromUserId: string,
  toUserId: string,
  action: "like" | "pass"
) => {

  if (fromUserId === toUserId) {
    throw new Error("You cannot swipe yourself");
  }

  // Save swipe (update if exists)
  await Swipe.findOneAndUpdate(
    { fromUser: fromUserId, toUser: toUserId },
    { action },
    { upsert: true, new: true }
  );

  // If it's a pass → no match (early exit)
  if (action === "pass") {
    return { match: false };
  }

  // Check if the other user liked you
  const existingSwipe = await Swipe.findOne({
    fromUser: toUserId,
    toUser: fromUserId,
    action: "like",
  });

  if (existingSwipe) {

    // Prevent duplicate match
    const existingMatch = await Match.findOne({
      users: { $all: [fromUserId, toUserId] },
    });

    if (!existingMatch) {
      await Match.create({
        users: [fromUserId, toUserId],
      });
    }

    return { match: true };
  }

  return { match: false };
};