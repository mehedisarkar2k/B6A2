import type { Request, Response } from 'express';
import { UserZodSchema } from './user.schema';
import { UserService } from './user.service';
import { Password, SendResponse } from '../../core';

const createUser = async (req: Request, res: Response) => {
  const { password, ...rest } = UserZodSchema.CreateUserSchema.parse(req.body);

  const hashedPassword = await Password.hash(password);

  const payload = {
    ...rest,
    password: hashedPassword,
  };

  const newUser = await UserService.createUser(payload);

  if (!newUser || !newUser.rowCount) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to create user',
    });
  }

  return SendResponse.created({
    res,
    message: 'User created successfully',
  });
};

export const UserController = {
  createUser,
};
