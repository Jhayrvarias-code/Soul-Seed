import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Update with your frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room (for private chat between users)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', ({ roomId, message, senderId }) => {
    // Broadcast to other clients in the same room
    socket.to(roomId).emit('receiveMessage', { message, senderId });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  });

export { io }; // Export io if we want to use it in services/controllers