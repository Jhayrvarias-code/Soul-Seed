import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (buffer: Buffer) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder: "soulseed_profiles" },
      (error, result) => {

        if (error) return reject(error);

        resolve(result);

      }
    );

    stream.end(buffer);

  });

};