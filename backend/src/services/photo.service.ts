import User from "../models/user.model";

export const addPhoto = async (
  userId: string,
  photoUrl: string,
  publicId: string
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.photos.length >= 9) {
    throw new Error("Maximum of 9 photos allowed");
  }

  user.photos.push({
    url: photoUrl,
    publicId: publicId
  });

  await user.save();

  return user.photos;

};