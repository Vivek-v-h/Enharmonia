import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import protect from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.put('/update', protect, updateUser);
userRouter.delete('/delete', protect, deleteUser);

export default userRouter;

