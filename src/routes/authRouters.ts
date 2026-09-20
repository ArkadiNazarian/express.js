import express from 'express';
import { login, signup } from '../controllers/authControllers.js';

export const authRouter = express.Router();

authRouter.route('/signup').post(signup);
authRouter.route('/login').post(login);