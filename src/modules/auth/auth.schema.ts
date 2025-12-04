import { z } from 'zod';

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
export type SigninInput = z.infer<typeof SigninSchema>;

const SignupSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().min(1).max(20).trim(),
  role: z.enum(['admin', 'customer']).default('customer'),
});
export type SignupInput = z.infer<typeof SignupSchema>;

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6).max(100),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const AuthZodSchema = {
  SigninSchema,
  SignupSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
};
