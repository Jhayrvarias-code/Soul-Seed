"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getMe = void 0;
const user_service_1 = require("../services/user.service");
const profileCompletion_1 = require("../helpers/profileCompletion");
const user_service_2 = require("../services/user.service");
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await (0, user_service_1.getCurrentUser)(userId);
        // Check if the user's profile is complete
        const isProfileComplete = (0, profileCompletion_1.checkProfileCompletion)(user);
        res.status(200).json({
            ...user.toObject(), // convert Mongoose document to plain JS object
            isProfileComplete,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedUser = await (0, user_service_2.updateUserProfile)(userId, req.body);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
exports.updateMe = updateMe;
