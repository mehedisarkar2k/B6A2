import { z } from 'zod';

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).max(20).trim().optional(),
  role: z.enum(['admin', 'customer']).optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

const UserIdParamSchema = z.object({
  userId: z.string().regex(/^\d+$/, 'User ID must be a number'),
});
export type UserIdParam = z.infer<typeof UserIdParamSchema>;

export const UserZodSchema = {
  UpdateUserSchema,
  UserIdParamSchema,
};
