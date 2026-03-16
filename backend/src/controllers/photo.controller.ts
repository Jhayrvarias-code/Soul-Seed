import { Request, Response } from "express";
import { uploadToCloudinary } from "../helpers/uploadToCloudinary";
import { addPhoto } from "../services/photo.service";

export const uploadPhoto = async (req: Request, res: Response) => {

  try {

    const userId = (req as any).user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result: any = await uploadToCloudinary(req.file.buffer);

  const photos = await addPhoto(
  userId,
  result.secure_url,
  result.public_id
);

console.log("PHOTO OBJECT:", {
  url: result.secure_url,
  publicId: result.public_id
});

    res.status(200).json({
      message: "Photo uploaded successfully",
      photoUrl: result.secure_url,
      photos
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};