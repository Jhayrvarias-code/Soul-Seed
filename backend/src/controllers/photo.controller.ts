import { Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";
import { uploadToCloudinary } from "../helpers/uploadToCloudinary";
import * as photoService from "../services/photo.service";
import cloudinary from "../config/cloudinary";

/**
 * Upload a photo and add it to the user's profile
 */
export const uploadPhoto = async (req: Request, res: Response) => {

  let uploadedImage: UploadApiResponse | null = null;

  try {

    const userId = (req as any).user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

// Upload photo to Cloudinary
    uploadedImage = await uploadToCloudinary(
      req.file.buffer
    ) as UploadApiResponse;

  // Add photo URL and public ID to user's profile
  const photos = await photoService.addPhoto(
  userId,
  uploadedImage.secure_url,
  uploadedImage.public_id
);

// console.log("PHOTO OBJECT:", {
//   url: uploadedImage.secure_url,
//   publicId: uploadedImage.public_id
// });

   res.status(200).json({
  message: "Photo uploaded successfully",
  photos,
  avatar: photos.find(p => p.isAvatar) || null
});

  } catch (error: any) {

    if (uploadedImage?.public_id) {
    await cloudinary.uploader.destroy(uploadedImage.public_id);
  }

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};

/**
 * Delete a photo from user's profile
 */
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { photoId } = req.params as { photoId: string };

    const photos = await photoService.deletePhoto(userId, photoId);

    res.status(200).json({
      message: "Photo deleted successfully",
      photos,
    });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Set a specific photo as user's avatar
 */
export const setAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { photoId } = req.params as { photoId: string };

    const photos = await photoService.setAvatar(userId, photoId);

    res.status(200).json({
      message: "Avatar updated successfully",
      photos,
    });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};