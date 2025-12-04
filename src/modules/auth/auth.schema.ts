import { z } from 'zod';

const SigninSchema = z
  .object({
    email: z.email().optional(),
    username: z.string().min(3).max(30).trim().optional(),
    password: z.string().min(6).max(100),
  })
  .refine((data) => data.email || data.username, {
    message: 'Either email or username is required',
    path: ['email', 'username'],
  });
export type LoginInput = z.infer<typeof SigninSchema>;

const SignupSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim().optional(),
  email: z.email(),
  password: z.string().min(6).max(100),
  username: z.string().min(3).max(30).trim().optional(),
});
export type SignupInput = z.infer<typeof SignupSchema>;

export const AuthZodSchema = {
  SigninSchema,
  SignupSchema,
};
