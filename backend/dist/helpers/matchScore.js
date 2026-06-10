"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchScore = void 0;
const calculateMatchScore = (userAInterests, userBInterests) => {
    const common = userAInterests.filter((interest) => userBInterests.includes(interest));
    return {
        score: common.length,
        commonInterests: common,
    };
};
exports.calculateMatchScore = calculateMatchScore;
