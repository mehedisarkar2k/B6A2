import { config } from 'dotenv'
import { EnvSchema } from '../schema'

config()

// Environment zod schema
const env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
}

const ENV = EnvSchema.parse(env)

export { ENV }