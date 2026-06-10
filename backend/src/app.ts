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
import { isOriginAllowed } from "./config/allowedOrigins";
import { connectMongo } from "./lib/mongoose";

dotenv.config();

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowed = isOriginAllowed(origin);

    if (!origin || allowed) {
      callback(null, true);
    } else {
      console.log("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
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

function mountRoutes(prefix: string) {
  const base = prefix ? `${prefix}` : "";
  app.use(`${base}/users`, router);
  app.use(`${base}/auth`, authRoutes);
  app.use(`${base}/photos`, photoRoutes);
  app.use(`${base}/discover`, discoverRoutes);
  app.use(`${base}/swipe`, swipeRoutes);
  app.use(`${base}/matches`, matchRoutes);
  app.use(`${base}/messages`, messageRoutes);
}

// Local dev: full path `/api/auth/...`
mountRoutes("/api");
// Vercel Services: strips `/api` prefix → `/auth/...`
mountRoutes("");

app.get("/", (_req, res) => {
  res.send("API is running...");
});

export default app;
