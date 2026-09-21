import express from 'express';
import { forgetPassword, login, protect, resetPassword, signup, updatePassword } from '../controllers/authControllers.js';

export const authRouter = express.Router();

authRouter.route('/signup').post(signup);
authRouter.route('/login').post(login);
authRouter.route('/forget-password').post(forgetPassword);
authRouter.route('/reset-password').patch(resetPassword);
authRouter.route('/update-password').patch(protect, updatePassword);