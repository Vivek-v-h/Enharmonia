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

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Enter a valid Email" });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Password is too weak" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate secure email verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpire: Date.now() + 3600000, // expires in 1 hour
    });

    const user = await newUser.save();

    // Create verification link
    const verifyLink = `${process.env.BASE_URL}/api/user/verify-email/${verifyToken}`;

    // Mailtrap transporter setup
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email content
    const message = {
      from: '"NoReply" <no-reply@example.com>',
      to: user.email,
      subject: "Verify your email",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <p><a href="${verifyLink}">Verify your email</a></p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(message);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Check your email to verify your account.",
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// VERIFY EMAIL CONTROLLER
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
    console.error("Email verification error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
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
    return res
      .status(401)
      .json({ message: "Please verify your email to login" });
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

  if (!user)
    return res.status(400).json({ message: "Token is invalid or expired" });

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

  const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  res.status(200).json({
    message: "User updated",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
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
  deleteUser,
};
