import { Router } from 'express';
import { UserController } from './user.controller';
import { asyncHandler } from '../../core';
import { requestValidator } from '../../middleware';
import { UserZodSchema } from './user.schema';

const userRouter = Router();

userRouter.post(
    '/',
    requestValidator(UserZodSchema.CreateUserSchema),
    asyncHandler(UserController.createUser)
);

export { userRouter as UserRouter };
