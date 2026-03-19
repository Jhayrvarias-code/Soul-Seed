import User from "../models/user.model";
import { getBirthdateRange } from "../helpers/date.helper";
import Swipe from "../models/swipe.model";

export const getDiscoverUsers = async (
  currentUserId: string
) => {
  // Example default age range (can be dynamic later)
  const { minDate, maxDate } = getBirthdateRange(18, 40);

  // Get all users current user already swiped
  const existingSwipe = await Swipe.find({fromUser: currentUserId}).select("toUser");

  // Get all user list
  const swipedUserIds = existingSwipe.map(swipe => swipe.toUser);
  

  const users = await User.find({
    _id: { $ne: currentUserId,
        $nin: swipedUserIds,
     },

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