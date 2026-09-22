import express from 'express';
import { protect } from '../controllers/authControllers.js';
import { updatePassword, updateUser } from '../controllers/userController.js';

export const userRouter = express.Router();

userRouter.route('/update-password').patch(protect, updatePassword);
userRouter.route('/update-details').patch(protect, updateUser);