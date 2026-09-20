import express from 'express';
import { signup } from '../controllers/authControllers.js';

export const authRouter = express.Router();

authRouter.route('/signup').post(signup);