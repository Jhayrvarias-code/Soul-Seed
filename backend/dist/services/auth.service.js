"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = require("../utils/generateToken");
const sanitizeUser_1 = require("../utils/sanitizeUser");
const crypto_1 = __importDefault(require("crypto"));
const refreshTokenModel_1 = __importDefault(require("../models/refreshTokenModel"));
const SALT_ROUNDS = 10;
/*
REGISTER USER
*/
const registerUser = async (userData) => {
    const { email, password } = userData;
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    const newUser = await user_model_1.default.create({
        ...userData,
        password: hashedPassword,
    });
    const token = (0, generateToken_1.generateToken)(newUser._id.toString());
    return {
        user: (0, sanitizeUser_1.sanitizeUser)(newUser),
        token,
        profileCompletionStatus: newUser.isProfileComplete,
    };
};
exports.registerUser = registerUser;
/*
LOGIN USER
*/
const loginUser = async (email, password) => {
    const user = await user_model_1.default.findOne({ email });
    if (!user || !user.password) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const AccessToken = (0, generateToken_1.generateToken)(user._id.toString());
    const refreshToken = crypto_1.default.randomBytes(64).toString("hex");
    await refreshTokenModel_1.default.create({
        userId: user._id.toString(),
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    return {
        user: (0, sanitizeUser_1.sanitizeUser)(user),
        token: AccessToken,
        refreshToken: refreshToken,
        profileCompletionStatus: user.isProfileComplete,
    };
};
exports.loginUser = loginUser;
const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token is required for logout");
    }
    await refreshTokenModel_1.default.findOneAndDelete({ token: refreshToken });
    return { message: "Logged out successfully" };
};
exports.logoutUser = logoutUser;
