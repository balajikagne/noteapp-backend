import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
    name?: string;
    dob?: Date;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  dob: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>("User", UserSchema);
