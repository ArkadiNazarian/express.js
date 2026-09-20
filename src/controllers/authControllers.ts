import type { Request, Response } from 'express';
import { User } from '../models/usersModels.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signup = async (req: Request, res: Response) => {
    try {

        const user = await User.create(req.body);

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
            expiresIn: '3600'
        });

        res.status(201).json({
            success: true,
            token,
            data: {
                user
            }
        });

    } catch (e) {

        const error = e as Error;

        res.status(500).json({
            success: false,
            error: error.message
        });

    }


}

export const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error('Email or password is required');
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
            expiresIn: '3600'
        });

        res.status(200).json({
            success: true,
            token: token,
        });

    } catch (e) {

        const error = e as Error;

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
}