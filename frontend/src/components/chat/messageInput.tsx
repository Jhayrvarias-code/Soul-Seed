import { useEffect, useRef, useState, type RefObject } from "react";
import type { Socket } from "socket.io-client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizontal } from "lucide-react";

type MessageInputProps = {
  matchId: string;
  socketRef: RefObject<Socket | null>;
};

const TYPING_DEBOUNCE_MS = 400;

export default function MessageInput({ matchId, socketRef }: MessageInputProps) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const idleStopRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const typingActiveRef = useRef(false);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (idleStopRef.current) clearTimeout(idleStopRef.current);
      if (typingActiveRef.current) {
        socketRef.current?.emit("stop_typing", matchId);
        typingActiveRef.current = false;
      }
    };
  }, [matchId, socketRef]);

  const stopTypingSignals = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = undefined;
    if (idleStopRef.current) clearTimeout(idleStopRef.current);
    idleStopRef.current = undefined;
    if (typingActiveRef.current) {
      socketRef.current?.emit("stop_typing", matchId);
      typingActiveRef.current = false;
    }
  };

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    stopTypingSignals();

    socketRef.current?.emit("send_message", {
      matchId,
      text: trimmed,
    });

    setText("");
  };

  const onChange = (value: string) => {
    setText(value);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = undefined;
      if (!typingActiveRef.current && value.trim().length > 0) {
        typingActiveRef.current = true;
        socketRef.current?.emit("typing", matchId);
      }
      if (idleStopRef.current) clearTimeout(idleStopRef.current);
      idleStopRef.current = setTimeout(() => {
        idleStopRef.current = undefined;
        if (typingActiveRef.current) {
          socketRef.current?.emit("stop_typing", matchId);
          typingActiveRef.current = false;
        }
      }, 2500);
    }, TYPING_DEBOUNCE_MS);
  };

  return (
    <div className="flex shrink-0 items-end gap-2 border-t border-border bg-background p-3 sm:p-4">
      <Input
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Message…"
        className="min-h-10 flex-1 rounded-xl bg-muted/40 dark:bg-muted/20"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        aria-label="Message text"
      />
      <Button
        type="button"
        size="icon"
        className="size-10 shrink-0 rounded-xl"
        aria-label="Send message"
        onClick={send}
        disabled={!text.trim()}
      >
        <SendHorizontal className="size-4" />
      </Button>
    </div>
  );
}
