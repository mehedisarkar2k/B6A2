import { z } from "zod";

export const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("8000"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET_KEY: z.string().min(1, "JWT_SECRET_KEY is required"),
    REFRESH_TOKEN_SECRET_KEY: z.string().min(1, "REFRESH_TOKEN_SECRET_KEY is required"),
});