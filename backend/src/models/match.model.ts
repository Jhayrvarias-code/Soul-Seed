import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
  createdAt: Date;
}

const matchSchema = new Schema<IMatch>(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Ensure UNIQUE PAIR (A,B) only once
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

export default mongoose.model<IMatch>("Match", matchSchema);
