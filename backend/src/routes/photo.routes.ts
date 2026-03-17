import express from "express";
import { uploadPhoto, deletePhoto, setAvatar } from "../controllers/photo.controller";
import upload from "../middlewares/upload.middleware";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("photo"),
  uploadPhoto
);

router.delete("/:photoId", protect, deletePhoto);
router.patch("/avatar/:photoId", protect, setAvatar);
export default router;