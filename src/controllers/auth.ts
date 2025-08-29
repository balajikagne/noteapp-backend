import { Request, Response } from "express";
import User from "../models/User";
import OTP from "../models/OTP";
import { sendMail } from "../utils/mailer";
import mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const OTP_TTL_MIN = Number(process.env.OTP_TTL_MIN || 10);

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOtp(req: Request, res: Response) {
  const { email , name, dob} = req.body;
  console.log(email, name, dob);
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Invalid email" });

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email, name, dob });

  const code = genCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

  await OTP.deleteMany({ user: user._id }); // remove older OTPs
  await OTP.create({ user: user._id, code, expiresAt });

  // Send or log
  await sendMail(email, "Your OTP for Note App", `Your OTP is ${code}. It is valid for ${OTP_TTL_MIN} minutes.`);

  return res.json({ message: "OTP sent (check console or your email)" });
}

export async function verifyOtp(req: Request, res: Response) {
  const { email, code } = req.body;
 console.log(email, code);
  if (!email || !code) return res.status(400).json({ message: "Missing email or code" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const otp = await OTP.findOne({ user: user._id, code });
  if (!otp) return res.status(400).json({ message: "Invalid OTP" });
  if (otp.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

  await OTP.deleteMany({ user: user._id }); // consume

  const token = jwt.sign({ userId: user._id.toString(), email: user.email,name:user.name,dob:user.dob }, JWT_SECRET, { expiresIn: "7d" });

  return res.json({ token, user: { email: user.email, id: user._id,name:user.name,dob:user.dob } });
}
