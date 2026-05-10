import { api } from "../api/axios";

export interface DiscoverUser {
  _id: string;
  firstName: string;
  lastName?: string;
  birthdate: string;
  age?: number;
  bio?: string;
  interests?: string[];
  photos?: Array<{ url: string; isAvatar: boolean }>;
}

export const getDiscoverUsers = async (): Promise<DiscoverUser[]> => {
  const res = await api.get("/discover");
  return res.data.users;
};
