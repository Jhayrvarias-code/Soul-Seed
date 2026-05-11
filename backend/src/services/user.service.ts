import User from "../models/user.model";

/*
GET CURRENT USER PROFILE
*/
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password"); // Exclude password from the response

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      interests: data.interests,
    },
    { new: true }, // return updated document
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};
