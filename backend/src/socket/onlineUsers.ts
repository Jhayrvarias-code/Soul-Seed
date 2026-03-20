const onlineUsers = new Map<string, Set<string>>();

export const addUser = (userId: string, socketId: string) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId)!.add(socketId);
};

export const removeUser = (userId: string, socketId: string) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);
  }
};

export const getOnlineUsers = () => {
  return [...onlineUsers.keys()];
};

export const isUserOnline = (userId: string) => {
  return onlineUsers.has(userId);
};