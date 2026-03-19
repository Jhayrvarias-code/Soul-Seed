import mongoose, { Schema, Document } from "mongoose";

export interface ISwipe extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  action: "like" | "pass";
  createdAt: Date;
}

const swipeSchema = new Schema<ISwipe>(
  {
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["like", "pass"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate swipe
swipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export default mongoose.model<ISwipe>("Swipe", swipeSchema);