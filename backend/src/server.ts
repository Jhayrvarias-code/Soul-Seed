import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app';
import http from 'http';

//initialize Socket.io
import { initSocket } from "./socket/socket"

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

initSocket(server);


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