import { IUser } from "../models/user.model";

// REMOVE SENSITIVE DATA
export const sanitizeUser = (user: IUser) => {
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};