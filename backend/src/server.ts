import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app";
import { connectMongo } from "./lib/mongoose";
import { initSocket } from "./socket/socket";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

connectMongo()
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });
