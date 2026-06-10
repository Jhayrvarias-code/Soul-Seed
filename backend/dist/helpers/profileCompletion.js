"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProfileCompletion = void 0;
const calculateAge_1 = require("./calculateAge");
const checkProfileCompletion = (user) => {
    if (!user.firstName)
        return false;
    if (!user.lastName)
        return false;
    if (!user.gender)
        return false;
    if (!user.birthdate)
        return false;
    if (!user.bio)
        return false;
    if (!user.interests || user.interests.length === 0)
        return false;
    const age = (0, calculateAge_1.calculateAge)(user.birthdate);
    if (age < 18)
        return false;
    // At least 1 photo required
    if (!user.photos || user.photos.length === 0)
        return false;
    return true;
};
exports.checkProfileCompletion = checkProfileCompletion;
