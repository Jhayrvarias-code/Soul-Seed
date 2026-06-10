import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import dotenv from "dotenv";
import router from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import photoRoutes from "./routes/photo.routes";
import discoverRoutes from "./routes/discover.routes";
import swipeRoutes from "./routes/swipe.routes";
import matchRoutes from "./routes/match.routes";
import messageRoutes from "./routes/message.routes";
import { isOriginAllowed } from "./config/cors";
import { connectMongo } from "./lib/mongoose";

dotenv.config();

const app = express();

function isOriginAllowed(origin: string | undefined): boolean {
  // Allow server-to-server requests or tools like Postman/cURL where origin is omitted
  if (!origin) return true;

  const allowedOrigins = [
    "http://localhost:5173", // Your local Vite development server
    process.env.FRONTEND_URL, // Your live Vercel production deployment domain
  ];

  return allowedOrigins.includes(origin);
}

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(async (_req, _res, next) => {
  try {
    await connectMongo();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use("/api/users", router);
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api/swipe", swipeRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (_req, res) => {
  res.send("API is running...");
});

export default app;
