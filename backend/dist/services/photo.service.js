"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAvatar = exports.deletePhoto = exports.addPhoto = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_1 = require("cloudinary");
/**
 * Add photo to the user's profile
 */
const addPhoto = async (userId, photoUrl, publicId, isAvatar = false) => {
    const user = await user_model_1.default.findById(userId);
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
exports.addPhoto = addPhoto;
/**
 * Delete user's photo
 */
const deletePhoto = async (userId, photoId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const photos = user.photos;
    const photo = photos.id(photoId);
    if (!photo) {
        throw new Error("Photo not found");
    }
    // Delete from Cloudinary
    try {
        await cloudinary_1.v2.uploader.destroy(photo.publicId);
    }
    catch (err) {
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
exports.deletePhoto = deletePhoto;
/**
 * Set avatar to the user's profile
 */
const setAvatar = async (userId, photoId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    // Cast photos to DocumentArray so TS knows 'id' exists
    const photos = user.photos;
    const photo = photos.id(photoId); // now TypeScript knows 'id' exists
    let found = false;
    photos.forEach((p) => {
        if (p._id.toString() === photoId) {
            p.isAvatar = true;
            found = true;
        }
        else {
            p.isAvatar = false;
        }
    });
    if (!found) {
        throw new Error("Photo not found");
    }
    await user.save();
    return photos;
};
exports.setAvatar = setAvatar;
