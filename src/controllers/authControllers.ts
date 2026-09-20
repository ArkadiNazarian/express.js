import type { Request, Response } from 'express';
import { User } from '../models/usersModels.js';

export const signup = async (req: Request, res: Response) => {
    try {

        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
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