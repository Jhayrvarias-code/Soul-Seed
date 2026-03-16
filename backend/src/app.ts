import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import dotenv from 'dotenv';
import router from './routes/user.routes';
import authRoutes from "./routes/auth.routes";
import photoRoutes from "./routes/photo.routes";

dotenv.config();
  
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Routes
app.use('/api/users', router);
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;