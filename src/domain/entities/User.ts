//src/models/User.ts

import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// // Adiciona índice único para o campo email
// UserSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>("User", UserSchema);
