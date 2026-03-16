import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    age: number;
    bio?: string;
    photos: string[];
    location?: string;
    isProfileComplete: boolean;
    interests: string[];
    createdAt: Date;
}   

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      required: true
    },

    bio: {
      type: String,
      default: ""
    },

    photos: {
      type: [String],
      default: []
    },

    location: {
      type: String
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    },

    interests: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>("User", UserSchema);