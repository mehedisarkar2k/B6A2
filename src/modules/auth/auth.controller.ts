import { Request, Response } from 'express';
import { AuthZodSchema } from './auth.schema';
import { User } from '../user/user.types';
import { SendResponse } from '../../core';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ENV } from '../../config';

const login = async (req: Request, res: Response) => {
    const payload = AuthZodSchema.LoginSchema.parse(req.body);
    let user: User | undefined;

    if (payload.email) {
        user = await UserService.findUserByEmail(payload.email);
    } else if (payload.username) {
        user = await UserService.findUserByUsername(payload.username);
    } else {
        return SendResponse.unprocessableEntity({
            res,
            message: 'Either email or username is required',
        });
    }

    if (!user) {
        return SendResponse.notFound({ res, message: 'User not found' });
    }

    const { accessToken, refreshToken } = await AuthService.login(payload, user);

    // set refresh token in http only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return SendResponse.success({
        res,
        message: 'Login successful',
        data: {
            accessToken,
        },
    });
};

export const AuthController = {
    login,
};
