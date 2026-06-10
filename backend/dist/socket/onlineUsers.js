"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOnline = exports.getOnlineUsers = exports.removeUser = exports.addUser = void 0;
const onlineUsers = new Map();
const addUser = (userId, socketId) => {
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socketId);
};
exports.addUser = addUser;
const removeUser = (userId, socketId) => {
    const sockets = onlineUsers.get(userId);
    if (!sockets)
        return;
    sockets.delete(socketId);
    if (sockets.size === 0) {
        onlineUsers.delete(userId);
    }
};
exports.removeUser = removeUser;
const getOnlineUsers = () => {
    return [...onlineUsers.keys()];
};
exports.getOnlineUsers = getOnlineUsers;
const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
};
exports.isUserOnline = isUserOnline;
