import type { Request, Response } from 'express';
import { AuthZodSchema } from './auth.schema';
import { Password, SendResponse } from '../../core';
import { AuthService } from './auth.service';
import { ENV } from '../../config';
import { JWTToken } from '../../core/jwt-token';
import { UserService } from '../users/users.service';
import type { UserWithoutPassword } from '../users/users.types';

const signin = async (req: Request, res: Response) => {
  const payload = AuthZodSchema.SigninSchema.parse(req.body);

  const user = await UserService.findUserByEmail(payload.email.toLowerCase());

  if (!user) {
    return SendResponse.unauthorized({ res, message: 'Invalid credentials' });
  }

  try {
    const { accessToken, refreshToken } = await AuthService.login(
      payload,
      user,
    );

    // Store refresh token in database
    await AuthService.storeRefreshToken(
      user.id,
      refreshToken,
      req.headers['user-agent'],
      req.ip,
    );

    // Set refresh token in http only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const userData: UserWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return SendResponse.success({
      res,
      message: 'Login successful',
      data: {
        token: accessToken,
        user: userData,
      },
    });
  } catch {
    return SendResponse.unauthorized({ res, message: 'Invalid credentials' });
  }
};

const signup = async (req: Request, res: Response) => {
  const { password, ...rest } = AuthZodSchema.SignupSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await UserService.findUserByEmail(
    rest.email.toLowerCase(),
  );
  if (existingUser) {
    return SendResponse.conflict({ res, message: 'Email already exists' });
  }

  const hashedPassword = await Password.hash(password);

  const payload = {
    ...rest,
    password: hashedPassword,
  };

  const newUser = await AuthService.signup(payload);

  if (!newUser || !newUser.rowCount) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to create user',
    });
  }

  const userData = newUser.rows[0] as UserWithoutPassword;

  return SendResponse.created({
    res,
    message: 'User registered successfully',
    data: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
    },
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = AuthZodSchema.ForgotPasswordSchema.parse(req.body);

  const user = await UserService.findUserByEmail(email.toLowerCase());

  // Always return success to prevent email enumeration
  if (!user) {
    return SendResponse.success({
      res,
      message:
        'If an account exists with this email, a password reset link has been sent',
    });
  }

  // Generate reset token (valid for 1 hour)
  const resetToken = JWTToken.sign({
    id: user.id,
    email: user.email,
    type: 'password_reset',
  });

  // Store reset token
  await AuthService.storeResetToken(user.id, resetToken);

  // In production, you would send this token via email
  // For now, we'll return it in the response (only for development/testing)
  return SendResponse.success({
    res,
    message:
      'If an account exists with this email, a password reset link has been sent',
    data:
      ENV.NODE_ENV === 'development'
        ? { resetToken } // Only in development
        : undefined,
  });
};

const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = AuthZodSchema.ResetPasswordSchema.parse(req.body);

  try {
    // Verify the reset token
    const decoded = JWTToken.verify<{
      id: number;
      email: string;
      type: string;
    }>(token);

    if (decoded.type !== 'password_reset') {
      return SendResponse.badRequest({ res, message: 'Invalid reset token' });
    }

    // Check if this token is still valid in the database
    const storedToken = await AuthService.getResetToken(decoded.id);
    if (!storedToken || storedToken !== token) {
      return SendResponse.badRequest({
        res,
        message: 'Invalid or expired reset token',
      });
    }

    // Hash new password
    const hashedPassword = await Password.hash(password);

    // Update password
    await AuthService.updatePassword(decoded.id, hashedPassword);

    // Delete the reset token
    await AuthService.deleteResetToken(decoded.id);

    // Invalidate all existing sessions for this user
    await AuthService.deleteUserSessions(decoded.id);

    return SendResponse.success({
      res,
      message: 'Password reset successfully',
    });
  } catch {
    return SendResponse.badRequest({
      res,
      message: 'Invalid or expired reset token',
    });
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    // Delete the session from database
    await AuthService.deleteSession(refreshToken);
  }

  // Clear the refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return SendResponse.success({
    res,
    message: 'Logged out successfully',
  });
};

const refreshTokenHandler = async (req: Request, res: Response) => {
  // Get refresh token from cookie or body
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return SendResponse.unauthorized({
      res,
      message: 'Refresh token is required',
    });
  }

  try {
    // Check if session exists in database
    const session = await AuthService.findSessionByRefreshToken(refreshToken);
    if (!session) {
      return SendResponse.unauthorized({
        res,
        message: 'Invalid or expired refresh token',
      });
    }

    // Generate new tokens
    const tokens = JWTToken.refreshToken(refreshToken);

    // Update session with new refresh token (token rotation)
    await AuthService.updateSessionRefreshToken(
      refreshToken,
      tokens.refreshToken,
    );

    // Set new refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return SendResponse.success({
      res,
      message: 'Token refreshed successfully',
      data: {
        token: tokens.accessToken,
      },
    });
  } catch {
    // If refresh token is invalid, delete the session
    await AuthService.deleteSession(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return SendResponse.unauthorized({
      res,
      message: 'Invalid or expired refresh token',
    });
  }
};

export const AuthController = {
  signin,
  signup,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken: refreshTokenHandler,
};
