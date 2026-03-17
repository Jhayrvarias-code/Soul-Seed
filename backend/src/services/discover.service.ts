import User from "../models/user.model";
import { getBirthdateRange } from "../helpers/date.helper";

export const getDiscoverUsers = async (
  currentUserId: string
) => {
  // Example default age range (can be dynamic later)
  const { minDate, maxDate } = getBirthdateRange(18, 40);

  const users = await User.find({
    _id: { $ne: currentUserId },

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