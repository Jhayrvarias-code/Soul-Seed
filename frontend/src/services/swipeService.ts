import { api } from "../api/axios";

export const swipeUser = async (toUserId: string, action: "like" | "pass") => {
  const res = await api.post("/swipe", { toUserId, action });
  return res.data;
};
