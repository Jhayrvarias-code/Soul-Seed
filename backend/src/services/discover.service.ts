import User from "../models/user.model";
import { getBirthdateRange } from "../helpers/date.helper";
import Swipe from "../models/swipe.model";
import mongoose from "mongoose";
import { calculateMatchScore } from "../helpers/matchScore";

export const getDiscoverUsers = async (currentUserId: string) => {
  // Example default age range (can be dynamic later)

  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    throw new Error("Current user not found");
  }

  const { minDate, maxDate } = getBirthdateRange(18, 40);

  // Get all users current user already swiped
  const existingSwipe = await Swipe.find({ fromUser: currentUserId }).select(
    "toUser",
  );

  // Get all user list
  const swipedUserIds = existingSwipe.map((swipe) => swipe.toUser);

  //New Implement
  const excludedIds = [...swipedUserIds, currentUserId].map(
    (id) => new mongoose.Types.ObjectId(id),
  );

  const users = await User.find({
    _id: { $nin: excludedIds },

    birthdate: {
      $gte: minDate,
      $lte: maxDate,
    },

    photos: { $exists: true, $not: { $size: 0 } },
  })
    .select("-password")
    .limit(20);

  const scoredUsers = users.map((user) => {
    const { score, commonInterests } = calculateMatchScore(
      currentUser.interests,
      user.interests,
    );

    return {
      ...user.toObject(),
      matchScore: score,
      commonInterests,
    };
  });

  // sort by best match
  scoredUsers.sort((a, b) => b.matchScore - a.matchScore);

  return scoredUsers;
};
