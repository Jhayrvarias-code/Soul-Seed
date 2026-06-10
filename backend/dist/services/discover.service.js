"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscoverUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const date_helper_1 = require("../helpers/date.helper");
const swipe_model_1 = __importDefault(require("../models/swipe.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const matchScore_1 = require("../helpers/matchScore");
const getDiscoverUsers = async (currentUserId) => {
    // Example default age range (can be dynamic later)
    const currentUser = await user_model_1.default.findById(currentUserId);
    if (!currentUser) {
        throw new Error("Current user not found");
    }
    const { minDate, maxDate } = (0, date_helper_1.getBirthdateRange)(18, 40);
    // Get all users current user already swiped
    const existingSwipe = await swipe_model_1.default.find({ fromUser: currentUserId }).select("toUser");
    // Get all user list
    const swipedUserIds = existingSwipe.map((swipe) => swipe.toUser);
    //New Implement
    const excludedIds = [...swipedUserIds, currentUserId].map((id) => new mongoose_1.default.Types.ObjectId(id));
    const users = await user_model_1.default.find({
        _id: { $nin: excludedIds },
        birthdate: {
            $gte: minDate,
            $lte: maxDate,
        },
        photos: { $exists: true, $not: { $size: 0 } },
    })
        .select("-password")
        .limit(20);
    const scoredUsers = users.map((user) => {
        const { score, commonInterests } = (0, matchScore_1.calculateMatchScore)(currentUser.interests, user.interests);
        return {
            ...user.toObject(),
            matchScore: score,
            commonInterests,
        };
    });
    // sort by best match
    scoredUsers.sort((a, b) => b.matchScore - a.matchScore);
    return scoredUsers;
};
exports.getDiscoverUsers = getDiscoverUsers;
