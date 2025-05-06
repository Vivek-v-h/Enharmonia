import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ------------------ SIGNUP ------------------
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Password is too weak" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpire: Date.now() + 3600000, // 1 hour
    });

    const user = await newUser.save();
    const verifyLink = `${process.env.BASE_URL}/api/user/verify-email/${verifyToken}`;

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
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}">Verify your email</a>
        <p>This link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(message);

    res.status(201).json({
      success: true,
      message: "Registration successful. Check your email to verify your account.",
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ------------------ VERIFY EMAIL ------------------
const verifyEmail = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Verify email error:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ------------------ LOGIN ------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before login" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ------------------ FORGOT PASSWORD ------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email." });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONT_URL}/reset-password/${resetToken}`;

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
      subject: "Password Reset",
      html: `
        <p>Hi ${user.name},</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(message);
    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ------------------ RESET PASSWORD ------------------
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).json({ message: "Password is too weak." });
  }

  try {
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been updated successfully." });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ------------------ DELETE USER ------------------
const deleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    await userModel.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err.message);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

export {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deleteUser,
};
