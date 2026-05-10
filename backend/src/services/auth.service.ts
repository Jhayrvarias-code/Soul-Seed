import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { sanitizeUser } from "../utils/sanitizeUser";
import crypto from "crypto";
import RefreshToken from "../models/refreshTokenModel";

const SALT_ROUNDS = 10;

/*
REGISTER USER
*/
export const registerUser = async (userData: Partial<IUser>) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });

  const token = generateToken(newUser._id.toString());

  return {
    user: sanitizeUser(newUser),
    token,
    profileCompletionStatus: newUser.isProfileComplete,
  };
};

/*
LOGIN USER
*/
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const AccessToken = generateToken(user._id.toString());

  const refreshToken = crypto.randomBytes(64).toString("hex");

  await RefreshToken.create({
    userId: user._id.toString(),
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    user: sanitizeUser(user),
    token: AccessToken,
    refreshToken: refreshToken,
    profileCompletionStatus: user.isProfileComplete,
  };
};

export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required for logout");
  }

  await RefreshToken.findOneAndDelete({ token: refreshToken });
  return { message: "Logged out successfully" };
};
