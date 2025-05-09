import express from "express";
import cors from "cors"; // ✅ import cors
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import adRouter from "./routes/ad.route.js"
import path from "path";
const app = express();
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // ✅ enable cors for frontend
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/user", userRouter);
app.use("/api/ad",adRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
