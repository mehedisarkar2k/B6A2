import { DB_QUERY, Password } from '../../core';
import { JWTToken } from '../../core/jwt-token';
import type { User } from '../user/user.types';
import type { LoginInput, SignupInput } from './auth.schema';

const login = async (
  payload: LoginInput,
  user: User,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const { password } = payload;
  const isPasswordValid = Password.verify(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const tokens = JWTToken.generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return tokens;
};

const signup = async (payload: SignupInput) => {
  const queryText =
    'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING id, firstName, lastName, email, role, created_at';
  const queryParams = [
    payload.firstName,
    payload.lastName || null,
    payload.email,
    payload.password,
  ];

  return await DB_QUERY(queryText, queryParams);
};

export const AuthService = {
  login,
  signup,
};
