import express from 'express';
import { forgetPassword, login, signup } from '../controllers/authControllers.js';

export const authRouter = express.Router();

authRouter.route('/signup').post(signup);
authRouter.route('/login').post(login);
authRouter.route('/forget-password').post(forgetPassword);