// frontend/src/services/userService.ts
import { api } from "../api/axios"; // your axios instance

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthdate: string;
  bio?: string;
  photos: { url: string; publicId: string; isAvatar: boolean }[];
  location?: string;
  isProfileComplete: boolean;
  interests: string[];
  lastSeen?: string;
  createdAt: string;
}

/**
 * Fetch the current logged-in user's data
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateUserProfile = async (data: any): Promise<User> => {
  const response = await api.put("/users/me", data);
  return response.data;
};
