import { DB_QUERY, Password } from '../../core';
import { JWTToken } from '../../core/jwt-token';
import type { User } from '../user/user.types';
import type { SigninInput, SignupInput } from './auth.schema';

const login = async (
  payload: SigninInput,
  user: User,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const { password } = payload;
  const isPasswordValid = await Password.verify(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const tokens = await JWTToken.generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return tokens;
};

const signup = async (payload: SignupInput) => {
  const queryText = `
    INSERT INTO users (name, email, password, phone, role) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, name, email, phone, role
  `;
  const queryParams = [
    payload.name,
    payload.email.toLowerCase(),
    payload.password,
    payload.phone,
    payload.role || 'customer',
  ];

  return await DB_QUERY(queryText, queryParams);
};

const storeResetToken = async (userId: number, resetToken: string) => {
  // Store reset token in sessions table with a special identifier
  const queryText = `
    INSERT INTO sessions (id, user_id, refresh_token, created_at) 
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (id) DO UPDATE SET refresh_token = $3, updated_at = NOW()
  `;
  const tokenId = `reset_${userId}`;
  await DB_QUERY(queryText, [tokenId, userId, resetToken]);
};

const getResetToken = async (userId: number) => {
  const queryText = `SELECT refresh_token FROM sessions WHERE id = $1`;
  const tokenId = `reset_${userId}`;
  const result = await DB_QUERY(queryText, [tokenId]);
  return result.rows[0]?.refresh_token;
};

const deleteResetToken = async (userId: number) => {
  const queryText = `DELETE FROM sessions WHERE id = $1`;
  const tokenId = `reset_${userId}`;
  await DB_QUERY(queryText, [tokenId]);
};

const updatePassword = async (userId: number, hashedPassword: string) => {
  const queryText = `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`;
  await DB_QUERY(queryText, [hashedPassword, userId]);
};

const storeRefreshToken = async (
  userId: number,
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string,
) => {
  const sessionId = `session_${userId}_${Date.now()}`;
  const queryText = `
    INSERT INTO sessions (id, user_id, refresh_token, user_agent, ip_address, created_at) 
    VALUES ($1, $2, $3, $4, $5, NOW())
  `;
  await DB_QUERY(queryText, [
    sessionId,
    userId,
    refreshToken,
    userAgent,
    ipAddress,
  ]);
};

const deleteUserSessions = async (userId: number) => {
  const queryText = `DELETE FROM sessions WHERE user_id = $1 AND id LIKE 'session_%'`;
  await DB_QUERY(queryText, [userId]);
};

const deleteSession = async (refreshToken: string) => {
  const queryText = `DELETE FROM sessions WHERE refresh_token = $1`;
  await DB_QUERY(queryText, [refreshToken]);
};

export const AuthService = {
  login,
  signup,
  storeResetToken,
  getResetToken,
  deleteResetToken,
  updatePassword,
  storeRefreshToken,
  deleteUserSessions,
  deleteSession,
};
