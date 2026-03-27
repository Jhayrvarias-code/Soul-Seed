import User from "../models/user.model";
import { getBirthdateRange } from "../helpers/date.helper";
import Swipe from "../models/swipe.model";
import mongoose from "mongoose";

export const getDiscoverUsers = async (currentUserId: string) => {
  // Example default age range (can be dynamic later)
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

  return users;
};
