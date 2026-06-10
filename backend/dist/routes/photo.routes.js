"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const photo_controller_1 = require("../controllers/photo.controller");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/upload", auth_middleware_1.protect, upload_middleware_1.default.single("photo"), photo_controller_1.uploadPhoto);
router.delete("/:photoId", auth_middleware_1.protect, photo_controller_1.deletePhoto);
router.patch("/avatar/:photoId", auth_middleware_1.protect, photo_controller_1.setAvatar);
exports.default = router;
