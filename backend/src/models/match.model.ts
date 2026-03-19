import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  users: mongoose.Types.ObjectId[]; // [userA, userB]
  createdAt: Date;
}

const matchSchema = new Schema<IMatch>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate matches
matchSchema.index({ users: 1 }, { unique: true });

export default mongoose.model<IMatch>("Match", matchSchema);