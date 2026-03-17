import express from "express";
import { getDiscoverUsers } from "../controllers/discover.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protect, getDiscoverUsers);

export default router;