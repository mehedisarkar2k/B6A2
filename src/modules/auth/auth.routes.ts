import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requestValidator } from '../../middleware';
import { AuthZodSchema } from './auth.schema';
import { asyncHandler } from '../../core';

const authRouter = Router();

// POST /api/v1/auth/signup - Register new user
authRouter.post(
  '/signup',
  requestValidator(AuthZodSchema.SignupSchema),
  asyncHandler(AuthController.signup),
);

// POST /api/v1/auth/signin - Login user
authRouter.post(
  '/signin',
  requestValidator(AuthZodSchema.SigninSchema),
  asyncHandler(AuthController.signin),
);

// POST /api/v1/auth/forgot-password - Request password reset
authRouter.post(
  '/forgot-password',
  requestValidator(AuthZodSchema.ForgotPasswordSchema),
  asyncHandler(AuthController.forgotPassword),
);

// POST /api/v1/auth/reset-password - Reset password with token
authRouter.post(
  '/reset-password',
  requestValidator(AuthZodSchema.ResetPasswordSchema),
  asyncHandler(AuthController.resetPassword),
);

// POST /api/v1/auth/logout - Logout user
authRouter.post('/logout', asyncHandler(AuthController.logout));

export { authRouter as AuthRouter };
