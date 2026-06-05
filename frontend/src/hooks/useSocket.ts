import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "@/config/api";

export const useSocket = (token: string | null | undefined) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    const socket = io(getApiBaseUrl(), {
      auth: { token },
      autoConnect: true,
    });

    socketRef.current = socket;
    setConnected(socket.connected);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  return { socketRef, connected } as const;
};
