import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpire: { type: Date },
  resetToken: { type: String },
  resetTokenExpire: { type: Date },
  avatar: { type: String }, // New field for avatar filename
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

