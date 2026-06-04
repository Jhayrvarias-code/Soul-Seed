const { io } = require("socket.io-client");

const socket = io(process.env.VITE_REACT_APP_API_URL);

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  // join chat room
  socket.emit("joinRoom", "room123");

  // send test message
  socket.emit("sendMessage", {
    roomId: "room123",
    message: "Hello from test client",
    senderId: "user1",
  });
});

socket.on("receiveMessage", (data) => {
  console.log("Message received:", data);
});
