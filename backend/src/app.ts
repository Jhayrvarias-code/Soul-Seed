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

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// Configure CORS to allow frontend origins and support preflight requests
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_FRONTEND_URL,
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server or same-origin requests with no origin
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.indexOf(origin) !== -1
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// Ensure preflight requests are handled
app.options("*", cors());

// Fallback: set common CORS headers for any responses
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  if (!origin) {
    return next();
  }
  if (allowedOrigins.length === 0 || allowedOrigins.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
  }
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Routes
app.use("/api/users", router);
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api/swipe", swipeRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
