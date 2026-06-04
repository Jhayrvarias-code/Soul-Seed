import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { getMessages, type Message } from "@/services/messageService";
import { useSocket } from "@/hooks/useSocket";
import MessageInput from "./messageInput";
import { GlobalStateContext } from "@/context/GlobalStateProvider";
import type { Match } from "@/services/matchService";
import { Button } from "../ui/button";
import { Check, ChevronLeft, CheckCheck } from "lucide-react";
import { cn } from "@/utils/utils";
import { getSenderId, messageIdString } from "@/utils/messageHelpers";

type ChatWindowProps = {
  match: Match;
  onBack?: () => void;
};

export default function ChatWindow({ match, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingClearRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const seenEmittedIdsRef = useRef<Set<string>>(new Set());

  const { user, token } = useContext(GlobalStateContext);
  const { socketRef, connected } = useSocket(
    token ?? localStorage.getItem("token"),
  );

  const otherUser = user?._id === match.user1._id ? match.user2 : match.user1;

  const isMine = useCallback(
    (msg: Message) => getSenderId(msg.sender) === user?._id,
    [user?._id],
  );

  const updateMessageStatus = useCallback(
    (messageId: string, status: Message["status"]) => {
      setMessages((prev) =>
        prev.map((m) =>
          messageIdString(m._id) === messageId ? { ...m, status } : m,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    seenEmittedIdsRef.current.clear();
    setMessages([]);
    setOtherTyping(false);
  }, [match._id]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !connected) return;

    socket.emit("join_match", match._id);

    getMessages(match._id)
      .then((res) => {
        setMessages(res.messages);
      })
      .catch((err) => console.error("Failed to load messages", err));

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleDelivered = (payload: { messageId?: unknown }) => {
      const id = messageIdString(payload.messageId);
      if (id) updateMessageStatus(id, "delivered");
    };

    const handleSeen = (payload: { messageId?: unknown }) => {
      const id = messageIdString(payload.messageId);
      if (id) updateMessageStatus(id, "seen");
    };

    const handleTyping = (payload: { userId?: string }) => {
      if (!payload?.userId || payload.userId === user?._id) return;
      setOtherTyping(true);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      typingClearRef.current = setTimeout(() => setOtherTyping(false), 2800);
    };

    const handleStopTyping = (payload: { userId?: string }) => {
      if (!payload?.userId || payload.userId === user?._id) return;
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      setOtherTyping(false);
    };

    socket.on("receive_message", handleMessage);
    socket.on("message_delivered", handleDelivered);
    socket.on("message_seen", handleSeen);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("message_delivered", handleDelivered);
      socket.off("message_seen", handleSeen);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
    };
  }, [match._id, socketRef, connected, updateMessageStatus, user?._id]);

  useEffect(() => {
    if (!user?._id || !messages.length || !socketRef.current || !connected)
      return;

    const latestInbound = [...messages]
      .reverse()
      .find((m) => getSenderId(m.sender) !== user._id);

    if (!latestInbound || latestInbound.status === "seen") return;

    const id = messageIdString(latestInbound._id);
    if (!id || seenEmittedIdsRef.current.has(id)) return;

    seenEmittedIdsRef.current.add(id);
    socketRef.current.emit("message_seen", {
      matchId: match._id,
      messageId: id,
    });
  }, [match._id, messages, socketRef, connected, user?._id]);

  const statusHint = (msg: Message): string => {
    if (!isMine(msg)) return "";
    if (msg.status === "seen") return "Seen";
    if (msg.status === "delivered") return "Delivered";
    return "Sent";
  };

  const statusIcon = (msg: Message) => {
    if (!isMine(msg)) return null;
    if (msg.status === "seen") {
      return <CheckCheck className="size-3 opacity-95" aria-hidden />;
    }
    if (msg.status === "delivered") {
      return <CheckCheck className="size-3 opacity-70" aria-hidden />;
    }
    return <Check className="size-3 opacity-70" aria-hidden />;
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-background">
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-2 py-2 sm:px-3">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Back to conversations"
            onClick={onBack}
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{otherUser.firstName}</p>
          <p className="text-xs text-muted-foreground">
            {otherTyping ? "Typing…" : "Match"}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
        {messages.map((msg) => {
          const mine = isMine(msg);
          const key = messageIdString(msg._id) ?? `${msg.text}-${mine}`;

          return (
            <div
              key={key}
              className={cn(
                "flex flex-col gap-0.5",
                mine ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm sm:max-w-[70%]",
                  mine
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted text-foreground",
                )}
              >
                {msg.text}
              </div>
              {mine ? (
                <span
                  className="flex items-center gap-1 px-1 text-[10px] text-muted-foreground sm:text-xs"
                  title={statusHint(msg)}
                >
                  {statusIcon(msg)}
                  <span className="sr-only">{statusHint(msg)}</span>
                </span>
              ) : null}
            </div>
          );
        })}

        {otherTyping ? (
          <div className="flex justify-start">
            <div
              className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm text-muted-foreground"
              aria-live="polite"
            >
              <span className="inline-flex gap-1">
                <span className="typing-dot" />
                <span className="typing-dot animation-delay-200" />
                <span className="typing-dot animation-delay-400" />
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <MessageInput matchId={match._id} socketRef={socketRef} />
    </div>
  );
}
