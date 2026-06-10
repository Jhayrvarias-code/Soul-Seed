"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = void 0;
const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
exports.calculateAge = calculateAge;
