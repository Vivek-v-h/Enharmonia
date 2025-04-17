import express from "express";
import cors from "cors"; // ✅ import cors
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // ✅ enable cors for frontend
app.use(express.json());

connectDB();

app.use("/api/user", userRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
