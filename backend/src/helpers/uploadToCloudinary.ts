import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

// Helper function to upload a buffer to Cloudinary
export const uploadToCloudinary = (buffer: Buffer) => {

  return new Promise <UploadApiResponse>((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder: "soulseed_profiles" },
      (error, result) => {

        if (error) return reject(error);

        resolve(result as UploadApiResponse);

      }
    );

    stream.end(buffer);

  });

};