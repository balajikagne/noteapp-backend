import { Request, Response } from "express";
import Note from "../models/Notes";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";

export async function getNotes(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
  return res.json(notes);
}

export async function createNote(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });
  const note = await Note.create({ user: new mongoose.Types.ObjectId(userId), title, content });
  return res.status(201).json(note);
}

export async function deleteNote(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { id } = req.params;
  const note = await Note.findOneAndDelete({ _id: id, user: userId });
  if (!note) return res.status(404).json({ message: "Note not found" });
  return res.json({ message: "Deleted" });
}
