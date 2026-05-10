import { api } from "../api/axios";

export interface MessageSender {
  _id: string;
  firstName?: string;
}

export interface Message {
  _id: string;
  text: string;
  sender: MessageSender | string;
  createdAt?: string;
  status: "sent" | "delivered" | "seen";
}

export const sendMessage = async (
  matchId: string,
  text: string,
): Promise<Message> => {
  const res = await api.post("/messages", { matchId, text });
  return res.data.message;
};

export const getMessages = async (
  matchId: string,
  cursor?: string,
): Promise<{ messages: Message[]; nextCursor: string | null }> => {
  const res = await api.get(`/messages/${matchId}`, { params: { cursor } });
  return res.data;
};
