import express from "express";
import { getMe } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { updateMe } from "../controllers/user.controller";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
