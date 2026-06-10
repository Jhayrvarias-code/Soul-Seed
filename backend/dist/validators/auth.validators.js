"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const MINIMUM_AGE = 18;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(30).required(),
    lastName: joi_1.default.string().min(2).max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(passwordRegex).required().messages({
        "string.pattern.base": "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
        "string.empty": "Password is required",
    }),
    confirmPassword: joi_1.default.any().valid(joi_1.default.ref("password")).required().messages({
        "any.only": "Passwords do not match",
        "string.empty": "Confirm password is required",
    }),
    birthdate: joi_1.default.date()
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - MINIMUM_AGE)))
        .required()
        .messages({
        "date.max": "You must be at least 18 years old",
        "date.base": "Birthdate must be a valid date",
    }),
    gender: joi_1.default.string().valid("Male", "Female", "Other").required(),
    interests: joi_1.default.array().items(joi_1.default.string()).max(4).optional(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
