import express from "express";
import { swipe } from "../controllers/swipe.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, swipe);

export default router;