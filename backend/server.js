import express from "express";
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json());
connectDB();

app.use("/api/user", userRouter);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
