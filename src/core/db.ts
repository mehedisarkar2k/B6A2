import type { QueryResult, QueryResultRow } from 'pg';
import { Pool } from 'pg';
import { ENV } from '../config/env';

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: {
    rejectUnauthorized: ENV.NODE_ENV !== 'development',
  },
});

export const DB_QUERY = async <T extends QueryResultRow = QueryResultRow>(
  queryText: string,
  params?: unknown[],
): Promise<QueryResult<T>> => {
  return pool.query<T>(queryText, params);
};

export const initDB = async () => {
  // Create users table if not exists
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        email VARCHAR(150) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE,
        password TEXT NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

  // sessions table for refresh tokens
  await pool.query(`
        CREATE TABLE IF NOT EXISTS sessions(
        id VARCHAR(255) PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        refresh_token TEXT NOT NULL,
        user_agent TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
};
