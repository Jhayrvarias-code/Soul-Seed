"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getCurrentUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
/*
GET CURRENT USER PROFILE
*/
const getCurrentUser = async (userId) => {
    const user = await user_model_1.default.findById(userId).select("-password"); // Exclude password from the response
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getCurrentUser = getCurrentUser;
const updateUserProfile = async (userId, data) => {
    const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        interests: data.interests,
    }, { new: true }).select("-password");
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
};
exports.updateUserProfile = updateUserProfile;
