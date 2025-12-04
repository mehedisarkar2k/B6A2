import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requestValidator } from '../../middleware';
import { AuthZodSchema } from './auth.schema';
import { asyncHandler } from '../../core';

const authRouter = Router();

authRouter.post(
  '/signup',
  requestValidator(AuthZodSchema.SignupSchema),
  asyncHandler(AuthController.signup),
);

authRouter.post(
  '/signin',
  requestValidator(AuthZodSchema.SigninSchema),
  asyncHandler(AuthController.login),
);

export { authRouter as AuthRouter };
