import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  match: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  status: "sent" | "delivered" | "seen";
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    match: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMessage>("Message", messageSchema);
