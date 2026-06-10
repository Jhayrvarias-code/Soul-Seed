"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_validators_1 = require("../validators/auth.validators");
/*
REGISTER CONTROLLER
*/
const register = async (req, res) => {
    try {
        // Validate request body
        const { error } = auth_validators_1.registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const formattedErrors = error.details.map((err) => ({
                field: err.path[0],
                message: err.message.replace(/["]/g, ""),
            }));
            return res.status(400).json({
                message: "Validation errors",
                errors: formattedErrors,
            });
        }
        const { password, confirmPassword, ...rest } = req.body;
        const { user, token, profileCompletionStatus } = await (0, auth_service_1.registerUser)({
            password,
            ...rest,
        });
        res.status(201).json({
            user,
            token,
            profileCompletionStatus,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
/*
LOGIN CONTROLLER
*/
const login = async (req, res) => {
    try {
        // Validate request body
        const { error } = auth_validators_1.loginSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: error.message,
            });
        }
        const { email, password } = req.body;
        // Call the service
        const { user, token, profileCompletionStatus } = await (0, auth_service_1.loginUser)(email, password);
        // Respond with proper variable names
        res.status(200).json({
            user,
            token,
            profileCompletionStatus,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.login = login;
/*
LOGOUT CONTROLLER
*/
const logout = async (req, res) => {
    try {
        // Optional: get token from header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Token required",
            });
        }
        await (0, auth_service_1.logoutUser)(token);
        return res.status(200).json({
            message: "Logged out successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Logout failed",
        });
    }
};
exports.logout = logout;
