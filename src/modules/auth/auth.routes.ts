import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requestValidator } from '../../middleware';
import { AuthZodSchema } from './auth.schema';
import { asyncHandler } from '../../core';

const authRouter = Router();

authRouter.post(
  '/login',
  requestValidator(AuthZodSchema.LoginSchema),
  asyncHandler(AuthController.login),
);

export { authRouter as AuthRouter };
