import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (token: string | null | undefined) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      socketRef.current = null;
      return;
    }

    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return socketRef;
};
