import { z } from "zod";

const LoginSchema = z.object({
    email: z.email().optional(),
    username: z.string().min(3).max(30).trim().optional(),
    password: z.string().min(6).max(100),
}).refine(data => data.email || data.username, {
    message: "Either email or username is required",
    path: ["email", "username"],
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const AuthZodSchema = {
    LoginSchema,
};