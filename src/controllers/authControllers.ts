import type { Request, Response } from 'express';
import { User } from '../models/usersModels.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

export const protect = async (req: Request, res: Response, next: Function) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new Error('No token provided');
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as { userId: string; iat: number; exp: number }


        const user = await User.findById(decodedToken.userId);

        if (!user) {
            throw new Error('User not found');
        }


        (req as any).user = user;
        next();

    } catch (e) {

        const error = e as Error;

        res.status(401).json({
            success: false,
            error: error.message
        });
    }
}

export const signup = async (req: Request, res: Response) => {
    try {

        const user = await User.create(req.body);

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
            expiresIn: 3600
        });

        // this line will add the token to cookie header of the response called token
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600 });

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
            expiresIn: 3600
        });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600 });

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

export const forgetPassword = async (req: Request, res: Response, next: Function) => {
    try {

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            throw new Error('User not found');
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        await User.findByIdAndUpdate(user.id, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
        });

        res.status(200).json({
            success: true,
            resetPasswordToken: rawToken
        });

    } catch (e) {
        const error = e as Error;

        res.status(500).json({
            success: false,
            error: error.message
        });
    }

}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { resetPasswordToken, password } = req.body;

        if (!resetPasswordToken || !password) {
            res.status(400).json({ success: false, error: 'Token and password are required' });
            return;
        }

        const hashedToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() }
        }).select('-password -__v');


        if (!user || !user.resetPasswordToken) {
            res.status(400).json({ success: false, error: 'Expired reset token' });
            return;
        }

        if (!user) {
            res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(user.id, {
            password: await bcrypt.hash(password, 12),
            resetPasswordToken: null,
            resetPasswordExpires: null
        }, { returnDocument: 'after' }).select('-__v -password');

        res.status(200).json({
            success: true,
            data: {
                user: updatedUser
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