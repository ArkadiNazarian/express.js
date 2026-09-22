import type { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import { User } from "../models/usersModels.js";
import jwt from 'jsonwebtoken';

export const updatePassword = async (req: any, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new Error('Current password and new password are required');
        }

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            throw new Error('User not found');
        }

        const comparePassword = await bcrypt.compare(currentPassword, user.password);

        if (!comparePassword) {
            throw new Error('Invalid password');
        }

        const updatedUser = await User.findByIdAndUpdate(user.id, {
            password: await bcrypt.hash(newPassword, 12),
        }, { returnDocument: 'after' }).select('-__v -password');

        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, {
            expiresIn: 3600
        });

        res.status(200).json({
            success: true,
            token: token,
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

export const updateUser = async (req: any, res: Response) => {
    try {
        

        if (req.body.password || req.body.confirmPassword) {
            throw new Error('Password cannot be updated');
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await User.findByIdAndUpdate(user.id, {
            ...req.body
        }, { returnDocument: 'after' ,runValidators: true }).select('-__v');

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