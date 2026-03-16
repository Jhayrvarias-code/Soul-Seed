import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { sanitizeUser } from "../utils/sanitizeUser";

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
    password: hashedPassword
  });

  const token = generateToken(newUser._id.toString());

  return {
    user: sanitizeUser(newUser),
    token,
    profileCompletionStatus: newUser.isProfileComplete
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

  const token = generateToken(user._id.toString());

  return {
    user: sanitizeUser(user),
    token,
    profileCompletionStatus: user.isProfileComplete
  };
};