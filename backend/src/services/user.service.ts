import User from "../models/user.model";

/*
GET CURRENT USER PROFILE
*/
export const getCurrentUser = async (userId: string) => {

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};