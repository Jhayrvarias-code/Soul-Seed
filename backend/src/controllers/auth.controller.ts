import { Request, Response } from "express";
import { registerUser, loginUser, logoutUser } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.validators";

/*
REGISTER CONTROLLER
*/
export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
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

    const { user, token, profileCompletionStatus } = await registerUser({
      password,
      ...rest,
    });

    res.status(201).json({
      user,
      token,
      profileCompletionStatus,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
LOGIN CONTROLLER
*/
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const { email, password } = req.body;

    // Call the service
    const { user, token, profileCompletionStatus } = await loginUser(
      email,
      password,
    );

    // Respond with proper variable names
    res.status(200).json({
      user,
      token,
      profileCompletionStatus,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
LOGOUT CONTROLLER
*/
export const logout = async (req: Request, res: Response) => {
  try {
    // Optional: get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Token required",
      });
    }

    await logoutUser(token);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Logout failed",
    });
  }
};
