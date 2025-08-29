import mongoose from "mongoose";

export interface IOTP extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  code: string;
  expiresAt: Date;
}

const OTPSchema = new mongoose.Schema<IOTP>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTP>("OTP", OTPSchema);
