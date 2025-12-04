import { z } from "zod";

const CreateUserSchema = z.object({
    firstName: z.string().min(1).max(50).trim(),
    lastName: z.string().min(1).max(50).trim().optional(),
    email: z.email(),
    password: z.string().min(6).max(100),
    username: z.string().min(3).max(30).trim().optional(),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UserZodSchema = {
    CreateUserSchema,
};