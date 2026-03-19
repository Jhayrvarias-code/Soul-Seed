import express from "express";
import { getMatches } from "../controllers/match.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protect, getMatches);

export default router;