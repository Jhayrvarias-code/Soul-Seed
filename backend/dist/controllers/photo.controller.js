"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAvatar = exports.deletePhoto = exports.uploadPhoto = void 0;
const uploadToCloudinary_1 = require("../helpers/uploadToCloudinary");
const photoService = __importStar(require("../services/photo.service"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
/**
 * Upload a photo and add it to the user's profile
 */
const uploadPhoto = async (req, res) => {
    let uploadedImage = null;
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Upload photo to Cloudinary
        uploadedImage = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer);
        // Add photo URL and public ID to user's profile
        const photos = await photoService.addPhoto(userId, uploadedImage.secure_url, uploadedImage.public_id);
        // console.log("PHOTO OBJECT:", {
        //   url: uploadedImage.secure_url,
        //   publicId: uploadedImage.public_id
        // });
        res.status(200).json({
            message: "Photo uploaded successfully",
            photos,
            avatar: photos.find(p => p.isAvatar) || null
        });
    }
    catch (error) {
        if (uploadedImage?.public_id) {
            await cloudinary_1.default.uploader.destroy(uploadedImage.public_id);
        }
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};
exports.uploadPhoto = uploadPhoto;
/**
 * Delete a photo from user's profile
 */
const deletePhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        const { photoId } = req.params;
        const photos = await photoService.deletePhoto(userId, photoId);
        res.status(200).json({
            message: "Photo deleted successfully",
            photos,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deletePhoto = deletePhoto;
/**
 * Set a specific photo as user's avatar
 */
const setAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        const { photoId } = req.params;
        const photos = await photoService.setAvatar(userId, photoId);
        res.status(200).json({
            message: "Avatar updated successfully",
            photos,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.setAvatar = setAvatar;
