import * as express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as bodyParser from "body-parser";

import { requestOtp, verifyOtp } from "./controllers/auth";
import { getNotes, createNote, deleteNote } from "./controllers/notes";
import { requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json()); // or: app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("✅ Connected to server");
});
// Routes
app.post("/auth/request-otp", requestOtp);
app.post("/auth/verify-otp", verifyOtp);

app.get("/notes", requireAuth, getNotes);
app.post("/notes", requireAuth, createNote);
app.delete("/notes/:id", requireAuth, deleteNote);

// Boot
const PORT = process.env.PORT || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/noteapp";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connect error:", err);
    process.exit(1);
  });
