import { Types } from "mongoose";
import User from "../models/user.model";
import { v2 as cloudinary } from "cloudinary";

interface IPhoto {
  _id: Types.ObjectId;
  url: string;
  publicId: string;
  isAvatar: boolean;
}

/**
 * Add photo to the user's profile
 */
export const addPhoto = async (
  userId: string,
  photoUrl: string,
  publicId: string,
  isAvatar: boolean = false,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.photos.length >= 9) {
    throw new Error("Maximum of 9 photos allowed");
  }

  // Check if an avatar already exists
  const hasAvatar = user.photos.some((photo) => photo.isAvatar);

  // If no avatar exists, force this photo to be avatar
  const finalIsAvatar = hasAvatar ? isAvatar : true;

  if (finalIsAvatar) {
    user.photos.forEach((photo) => {
      photo.isAvatar = false;
    });
  }

  // Add new photo to DB
  user.photos.push({
    url: photoUrl,
    publicId: publicId,
    isAvatar: finalIsAvatar,
  });

  await user.save();

  return user.photos;
};

/**
 * Delete user's photo
 */
export const deletePhoto = async (userId: string, photoId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const photos = user.photos as Types.DocumentArray<IPhoto>;

  const photo = photos.id(photoId);

  if (!photo) {
    throw new Error("Photo not found");
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(photo.publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
  }

  // Remove from MongoDB
  photos.pull(photoId);

  // If deleted photo was avatar, assign new avatar if any photos left
  if (photo.isAvatar && photos.length > 0) {
    photos[0].isAvatar = true;
  }

  await user.save();

  return photos;
};

/**
 * Set avatar to the user's profile
 */
export const setAvatar = async (userId: string, photoId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Cast photos to DocumentArray so TS knows 'id' exists
  const photos = user.photos as Types.DocumentArray<IPhoto>;

  const photo = photos.id(photoId); // now TypeScript knows 'id' exists

  let found = false;

  photos.forEach((p) => {
    if (p._id.toString() === photoId) {
      p.isAvatar = true;
      found = true;
    } else {
      p.isAvatar = false;
    }
  });

  if (!found) {
    throw new Error("Photo not found");
  }

  await user.save();

  return photos;
};
