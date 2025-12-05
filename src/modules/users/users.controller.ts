import type { Request, Response } from 'express';
import { SendResponse } from '../../core';
import { UserZodSchema } from './users.schema';
import { UserService } from './users.service';

const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UserService.getAllUsers();

  return SendResponse.success({
    res,
    message: 'Users retrieved successfully',
    data: users,
  });
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = UserZodSchema.UserIdParamSchema.parse(req.params);
  const payload = UserZodSchema.UpdateUserSchema.parse(req.body);
  const currentUser = req.user!;

  const userIdNum = Number(userId);

  // Check if user exists
  const existingUser = await UserService.findUserById(userIdNum);
  if (!existingUser) {
    return SendResponse.notFound({
      res,
      message: 'User not found',
    });
  }

  // Authorization check: Admin can update any user, Customer can only update own profile
  if (currentUser.role !== 'admin' && currentUser.id !== userIdNum) {
    return SendResponse.forbidden({
      res,
      message: 'You can only update your own profile',
    });
  }

  // Customers cannot change their own role
  if (currentUser.role !== 'admin' && payload.role !== undefined) {
    return SendResponse.forbidden({
      res,
      message: 'You are not allowed to change your role',
    });
  }

  // Check if new email conflicts with another user
  if (
    payload.email &&
    payload.email.toLowerCase() !== existingUser.email.toLowerCase()
  ) {
    const conflictUser = await UserService.findUserByEmail(payload.email);
    if (conflictUser) {
      return SendResponse.conflict({
        res,
        message: 'Email already exists',
      });
    }
  }

  const user = await UserService.updateUser(userIdNum, payload);

  if (!user) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to update user',
    });
  }

  return SendResponse.success({
    res,
    message: 'User updated successfully',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = UserZodSchema.UserIdParamSchema.parse(req.params);
  const userIdNum = Number(userId);

  // Check if user exists
  const existingUser = await UserService.findUserById(userIdNum);
  if (!existingUser) {
    return SendResponse.notFound({
      res,
      message: 'User not found',
    });
  }

  // Check if user has active bookings
  const hasActiveBookings = await UserService.hasActiveBookings(userIdNum);
  if (hasActiveBookings) {
    return SendResponse.badRequest({
      res,
      message: 'Cannot delete user with active bookings',
    });
  }

  const deleted = await UserService.deleteUser(userIdNum);

  if (!deleted) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to delete user',
    });
  }

  return SendResponse.success({
    res,
    message: 'User deleted successfully',
  });
};

export const UserController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
