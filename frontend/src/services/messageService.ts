import { api } from "../api/axios";

export interface Message {
  _id: string;
  text: string;
  sender: { _id: string; firstName: string };
  createdAt: string;
  status: "sent" | "delivered" | "seen";
}

export const sendMessage = async (
  matchId: string,
  text: string,
): Promise<Message> => {
  const res = await api.post("/messages", { matchId, text });
  return res.data.data;
};

export const getMessages = async (
  matchId: string,
  cursor?: string,
): Promise<{ messages: Message[]; nextCursor: string | null }> => {
  const res = await api.get(`/messages/${matchId}`, { params: { cursor } });
  return res.data;
};
