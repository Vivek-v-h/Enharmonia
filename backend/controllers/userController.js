import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

// JWT Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ------------------ SIGNUP ------------------
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Enter a valid Email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Password is too weak" });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpire: Date.now() + 3600000,
    });

    const user = await newUser.save();

    const verifyLink = `http://localhost:5000/api/user/verify-email/${verifyToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const message = {
      from: '"NoReply" <no-reply@example.com>',
      to: user.email,
      subject: "Verify your email",
      html: `<p>Click <a href="${verifyLink}">here</a> to verify your email address</p>`,
    };

    await transporter.sendMail(message);

    res.status(201).json({
      success: true,
      message: "Registration successful. Check your email to verify your account.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await userModel.findOne({
    verifyToken: token,
    verifyTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
};

// ------------------ LOGIN ------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.status(401).json({ message: "Please verify your email to login" });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};


// ------------------ FORGOT PASSWORD ------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const message = {
    from: '"NoReply" <no-reply@example.com>',
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  };

  await transporter.sendMail(message);
  res.status(200).json({ message: "Password reset email sent!" });
};

// ------------------ RESET PASSWORD ------------------
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Token is invalid or expired" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

// ------------------ UPDATE USER ------------------
const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (email && validator.isEmail(email)) updateData.email = email;
  if (password && validator.isStrongPassword(password)) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

  res.status(200).json({
    message: "User updated",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    }
  });
};

// ------------------ DELETE USER ------------------
const deleteUser = async (req, res) => {
  const userId = req.user.id;
  await userModel.findByIdAndDelete(userId);
  res.status(200).json({ message: "User deleted successfully" });
};

export {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateUser,
  deleteUser
};
