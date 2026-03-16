import express from "express";
import { uploadPhoto } from "../controllers/photo.controller";
import upload from "../middlewares/upload.middleware";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("photo"),
  uploadPhoto
);

export default router;