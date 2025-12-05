import { Router } from 'express';
import { asyncHandler } from '../../core';
import { requestValidator, roleValidator } from '../../middleware';
import { UserController } from './user.controller';
import { UserZodSchema } from './user.schema';
import { ROLE } from '../../config';

const router = Router();

// GET /api/v1/users - Get all users (Admin only)
router.get(
  '/',
  roleValidator(ROLE.ADMIN),
  asyncHandler(UserController.getAllUsers),
);

// PUT /api/v1/users/:userId - Update user (Admin or Own Profile)
router.put(
  '/:userId',
  roleValidator(ROLE.ADMIN, ROLE.CUSTOMER),
  requestValidator(UserZodSchema.UpdateUserSchema),
  asyncHandler(UserController.updateUser),
);

// DELETE /api/v1/users/:userId - Delete user (Admin only)
router.delete(
  '/:userId',
  roleValidator(ROLE.ADMIN),
  asyncHandler(UserController.deleteUser),
);

export { router as UserRoutes };
