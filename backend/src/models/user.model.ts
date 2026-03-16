import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    age: number;
    bio?: string;
    photos: { url: string; publicId: string }[];
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

    photos: [
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }
    ],

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