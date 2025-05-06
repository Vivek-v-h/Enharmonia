import express from 'express';
import { signup, login, deleteUser, forgotPassword, resetPassword, verifyEmail } from "../controllers/userController.js";
import protect from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);  // Signup route
userRouter.post('/login', login);  // Login route
userRouter.post('/forgot-password', forgotPassword);  // Forgot password route
userRouter.post('/reset-password/:token', resetPassword);  // Reset password route

userRouter.delete('/delete', protect, deleteUser);  // Delete user route (protected)
userRouter.get('/verify-email/:token', verifyEmail);  // Email verification route

export default userRouter;
