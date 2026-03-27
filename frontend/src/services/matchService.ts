import { api } from "../api/axios";

export interface Match {
  _id: string;
  user1: { _id: string; firstName: string };
  user2: { _id: string; firstName: string };
  createdAt: string;
}

export const getMatches = async (): Promise<Match[]> => {
  const res = await api.get("/matches");
  return res.data.matches;
};
