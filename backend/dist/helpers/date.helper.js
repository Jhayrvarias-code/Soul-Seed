"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBirthdateRange = void 0;
const getBirthdateRange = (minAge, maxAge) => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    return { minDate, maxDate };
};
exports.getBirthdateRange = getBirthdateRange;
