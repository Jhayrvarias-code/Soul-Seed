"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swipeUser = void 0;
const swipe_model_1 = __importDefault(require("../models/swipe.model"));
const match_model_1 = __importDefault(require("../models/match.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const sortUsers = (id1, id2) => {
    return [id1, id2].sort(); // ensures (A,B) == (B,A)
};
console.log(sortUsers);
const swipeUser = async (fromUserId, toUserId, action) => {
    //Prevent self swipe
    if (fromUserId === toUserId) {
        throw new Error("You cannot swipe yourself");
    }
    // Save swipe (update if exists)
    await swipe_model_1.default.findOneAndUpdate({ fromUser: fromUserId, toUser: toUserId }, { action }, { upsert: true, new: true });
    // If it's a pass → no match (early exit)
    if (action === "pass") {
        return { match: false };
    }
    // Check if the other user liked you
    const reverseSwipe = await swipe_model_1.default.findOne({
        fromUser: toUserId,
        toUser: fromUserId,
        action: "like",
    });
    if (!reverseSwipe) {
        return { match: false };
    }
    const [id1, id2] = sortUsers(fromUserId, toUserId);
    const user1 = new mongoose_1.default.Types.ObjectId(id1);
    const user2 = new mongoose_1.default.Types.ObjectId(id2);
    // CRITICAL: ensure unique match per pair
    const match = await match_model_1.default.findOneAndUpdate({ user1, user2 }, { $setOnInsert: { user1, user2 } }, // only insert if not exists
    { upsert: true, new: true });
    return {
        match: true,
        matchId: match._id,
    };
};
exports.swipeUser = swipeUser;
